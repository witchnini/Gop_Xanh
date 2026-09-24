import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const campaignSchema = z.object({
  name: z.string().min(4, "Tên chiến dịch tối thiểu 4 ký tự"),
  category: z.string().min(1, "Vui lòng chọn nhóm mô hình"),
  district: z.string().min(1, "Vui lòng nhập quận/huyện"),
  summary: z.string().min(20, "Tóm tắt tối thiểu 20 ký tự"),
  story: z.string().min(50, "Câu chuyện tối thiểu 50 ký tự"),
  method: z.string().min(10, "Mô tả phương thức canh tác tối thiểu 10 ký tự"),
  impact: z.string().min(10, "Mô tả tác động tối thiểu 10 ký tự"),
  goal: z.number().min(10000000, "Mục tiêu gây quỹ tối thiểu 10.000.000đ"),
});

function slugify(name: string) {
  const base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Thông tin phiên đăng nhập + vai trò của người dùng hiện tại */
export const getMySession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: roles }, { data: profile }] = await Promise.all([
      context.supabase.from("user_roles").select("role").eq("user_id", context.userId),
      context.supabase.from("profiles").select("full_name, organization").eq("id", context.userId).maybeSingle(),
    ]);
    const roleList = (roles ?? []).map((r) => r.role as string);
    return {
      userId: context.userId,
      email: (context.claims?.email as string | undefined) ?? null,
      fullName: profile?.full_name ?? "",
      organization: profile?.organization ?? null,
      roles: roleList,
      isAdmin: roleList.includes("admin"),
      isPartner: roleList.includes("partner"),
      isContributor: roleList.includes("contributor"),
    };
  });

/** Nông hộ nộp hồ sơ chiến dịch */
export const submitCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => campaignSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isPartner, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "partner",
    });
    if (roleError || !isPartner) throw new Error("Chỉ tài khoản Chủ dự án / Đối tác mới nộp được hồ sơ.");

    const { data: inserted, error } = await context.supabase
      .from("campaigns")
      .insert({ ...data, goal: data.goal, owner_id: context.userId, slug: slugify(data.name) })
      .select("id, slug, name, status")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true as const, campaign: inserted };
  });

/** Nông hộ xem hồ sơ của mình */
export const getMyCampaigns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: allowed, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "partner",
    });
    if (roleError || !allowed) throw new Error("Chỉ Chủ dự án / Đối tác được quản lý hồ sơ.");
    const { data, error } = await context.supabase
      .from("campaigns")
      .select("id, slug, name, category, district, goal, raised, status, review_note, created_at")
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Nông hộ đăng cập nhật tiến độ */
export const addCampaignUpdate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        campaignId: z.string().uuid(),
        title: z.string().min(4, "Tiêu đề tối thiểu 4 ký tự"),
        description: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("campaign_updates").insert({
      campaign_id: data.campaignId,
      title: data.title,
      description: data.description,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Admin: hồ sơ chờ duyệt / cần bổ sung */
export const adminListPending = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("campaigns")
      .select("id, slug, name, category, district, summary, story, method, impact, goal, status, owner_id, created_at")
      .in("status", ["cho_duyet", "can_bo_sung"])
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const ownerIds = [...new Set(rows.map((r) => r.owner_id))];
    const { data: owners } = ownerIds.length
      ? await context.supabase.from("profiles").select("id, full_name, organization").in("id", ownerIds)
      : { data: [] };
    const ownerMap = new Map((owners ?? []).map((o) => [o.id, o]));
    return rows.map((r) => ({
      ...r,
      ownerName: ownerMap.get(r.owner_id)?.organization || ownerMap.get(r.owner_id)?.full_name || "Chủ thể",
    }));
  });

/** Admin: toàn bộ chiến dịch */
export const adminListCampaigns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("campaigns")
      .select("id, slug, name, category, district, goal, raised, supporters, status, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Admin: duyệt / yêu cầu bổ sung / từ chối / đổi trạng thái */
export const adminReviewCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        campaignId: z.string().uuid(),
        status: z.enum(["dang_gay_quy", "can_bo_sung", "tu_choi", "hoan_thanh"]),
        note: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("campaigns")
      .update({ status: data.status, review_note: data.note ?? null, updated_at: new Date().toISOString() })
      .eq("id", data.campaignId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Admin: thống kê nền tảng */
export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const [campaigns, donations, volunteers] = await Promise.all([
      context.supabase.from("campaigns").select("id, status, goal, raised"),
      context.supabase.from("donations").select("amount"),
      context.supabase.from("volunteer_applications").select("id"),
    ]);
    const list = campaigns.data ?? [];
    return {
      totalCampaigns: list.length,
      pendingCampaigns: list.filter((c) => c.status === "cho_duyet" || c.status === "can_bo_sung").length,
      liveCampaigns: list.filter((c) => c.status === "dang_gay_quy").length,
      totalRaised: (donations.data ?? []).reduce((s, d) => s + Number(d.amount), 0),
      totalDonations: (donations.data ?? []).length,
      totalVolunteers: (volunteers.data ?? []).length,
    };
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!isAdmin) throw new Error("Bạn không có quyền quản trị.");
}

/** Công khai: chiến dịch đã duyệt (đọc bằng quyền anon, RLS lọc sẵn) */
export const listApprovedCampaigns = createServerFn({ method: "GET" }).handler(async () => {
  const supabasePublic = await publicClient();
  const { data, error } = await supabasePublic
    .from("campaigns")
    .select("id, slug, name, category, district, summary, story, method, impact, goal, raised, supporters, image_url, status")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

/** Công khai: chi tiết một chiến dịch đã duyệt theo slug */
export const getPublicCampaign = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const supabasePublic = await publicClient();
    const { data: campaign, error } = await supabasePublic
      .from("campaigns")
      .select("id, slug, name, category, district, summary, story, method, impact, goal, raised, supporters, image_url, status")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!campaign) return null;
    const { data: updates } = await supabasePublic
      .from("campaign_updates")
      .select("title, description, created_at")
      .eq("campaign_id", campaign.id)
      .order("created_at", { ascending: false });
    return { ...campaign, updates: updates ?? [] };
  });

export async function publicClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}
