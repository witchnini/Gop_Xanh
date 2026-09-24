import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const donationSchema = z.object({
  campaignSlug: z.string().min(1),
  amount: z.number().min(10000, "Mức đóng góp tối thiểu là 10.000đ"),
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().email("Email chưa đúng định dạng"),
  phone: z.string().optional(),
  message: z.string().optional(),
  anonymous: z.boolean().optional(),
});

export const submitDonation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => donationSchema.parse(data))
  .handler(async ({ data }) => {
    const code = "GX" + Date.now().toString().slice(-8);
    const { publicClient } = await import("./campaigns.functions");
    try {
      const supabasePublic = await publicClient();
      const { data: campaign } = await supabasePublic
        .from("campaigns")
        .select("id")
        .eq("slug", data.campaignSlug)
        .maybeSingle();
      await supabasePublic.from("donations").insert({
        campaign_id: campaign?.id ?? null,
        campaign_slug: data.campaignSlug,
        amount: data.amount,
        full_name: data.fullName,
        email: data.email,
        anonymous: data.anonymous ?? false,
      });
    } catch (err) {
      console.error("[gopxanh] donation persist failed", err);
    }
    return {
      ok: true as const,
      code,
      message: "Đây là đóng góp mô phỏng trong bản demo, chưa trừ tiền thật.",
    };
  });

const volunteerSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().email("Email chưa đúng định dạng"),
  phone: z.string().min(8, "Vui lòng nhập số điện thoại"),
  campaignSlug: z.string().min(1, "Vui lòng chọn chiến dịch"),
  role: z.string().min(1, "Vui lòng chọn vai trò"),
  experience: z.string().min(10, "Mô tả kinh nghiệm tối thiểu 10 ký tự"),
});

export const submitVolunteer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => volunteerSchema.parse(data))
  .handler(async ({ data }) => {
    const { publicClient } = await import("./campaigns.functions");
    try {
      const supabasePublic = await publicClient();
      await supabasePublic.from("volunteer_applications").insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        campaign_slug: data.campaignSlug,
        role: data.role,
        experience: data.experience,
      });
    } catch (err) {
      console.error("[gopxanh] volunteer persist failed", err);
    }
    return { ok: true as const, message: "Đã nhận đăng ký cộng tác viên." };
  });

const contactSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  organization: z.string().optional(),
  email: z.string().email("Email chưa đúng định dạng"),
  topic: z.string().min(1, "Vui lòng chọn nội dung"),
  content: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    console.log("[gopxanh] contact", data);
    return { ok: true as const, message: "Đã nhận yêu cầu liên hệ." };
  });
