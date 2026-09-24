import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Mail, Phone, Search, UsersRound, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminEmptyState, AdminPageHeader } from "@/components/admin/admin-shell";
import { formatAdminDate } from "@/lib/admin-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminListVolunteers, adminReviewVolunteer } from "@backend/campaigns.functions";
import { campaigns } from "@/lib/data";

function slugToName(slug: string) {
  return campaigns.find((c) => c.slug === slug)?.name ?? slug;
}

const STATUS_LABEL: Record<string, string> = {
  cho_duyet: "Chờ duyệt",
  da_duyet: "Đã duyệt",
  tu_choi: "Từ chối",
};
const STATUS_STYLE: Record<string, string> = {
  cho_duyet: "bg-clay/15 text-clay",
  da_duyet: "bg-leaf/15 text-pine",
  tu_choi: "bg-ink/10 text-ink/50",
};

export const Route = createFileRoute("/admin/cong-tac-vien")({
  head: () => ({
    meta: [
      { title: "Cộng tác viên · Góp Xanh Admin" },
      {
        name: "description",
        content: "Quản lý đăng ký đóng góp chuyên môn cho các chiến dịch Góp Xanh.",
      },
    ],
  }),
  component: AdminVolunteersPage,
});

function AdminVolunteersPage() {
  const queryClient = useQueryClient();
  const fetchVolunteers = useServerFn(adminListVolunteers);
  const reviewVolunteer = useServerFn(adminReviewVolunteer);
  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({ queryKey: ["admin-volunteers"], queryFn: fetchVolunteers });
  const [query, setQuery] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    if (!normalized) return applications;
    return applications.filter((item) =>
      [item.full_name, item.email, item.role, item.campaign_slug]
        .join(" ")
        .toLocaleLowerCase("vi")
        .includes(normalized),
    );
  }, [applications, query]);

  async function handleReview(applicationId: string, status: "da_duyet" | "tu_choi" | "cho_duyet") {
    setUpdating(applicationId);
    try {
      await reviewVolunteer({ data: { applicationId, status } });
      queryClient.invalidateQueries({ queryKey: ["admin-volunteers"] });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không cập nhật được trạng thái.");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Góp đa nguồn lực"
        title="Cộng tác viên"
        description="Tiếp nhận và kết nối chuyên môn về truyền thông, công nghệ, logistics, bán hàng và tư vấn với các chiến dịch phù hợp."
      />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-ink/35" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm tên, kỹ năng hoặc chiến dịch..."
            className="bg-white pl-9"
          />
        </div>
        <p className="text-sm font-bold text-moss">
          {isLoading ? "Đang tải..." : filtered.length + " đăng ký"}
        </p>
      </div>
      {error && (
        <p className="mt-4 border-l-4 border-destructive bg-white px-4 py-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Không tải được đăng ký cộng tác viên."}
        </p>
      )}
      {!isLoading && filtered.length === 0 ? (
        <div className="mt-5">
          <AdminEmptyState
            icon={UsersRound}
            title="Chưa có đăng ký phù hợp"
            description="Đăng ký đóng góp chuyên môn sẽ xuất hiện tại đây để Ban vận hành kết nối."
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => {
            const status = (item as any).status ?? "cho_duyet";
            const isUpdating = updating === item.id;
            return (
              <article key={item.id} className="border border-moss/10 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-moss">{item.full_name}</h2>
                    <p className="mt-1 text-xs text-ink/45">
                      Đăng ký {formatAdminDate(item.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[status] ?? STATUS_STYLE.cho_duyet}`}>
                      {STATUS_LABEL[status] ?? status}
                    </span>
                    <span className="rounded-full bg-sage px-3 py-1 text-xs font-bold text-moss">
                      {item.role}
                    </span>
                  </div>
                </div>
                <div className="mt-4 border-y border-moss/10 py-3">
                  <p className="text-xs font-bold uppercase text-ink/40">Chiến dịch quan tâm</p>
                  <p className="mt-1 text-sm font-bold text-moss">{slugToName(item.campaign_slug)}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink/65">{item.experience}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-4 text-xs font-bold">
                    <a
                      href={"mailto:" + item.email}
                      className="inline-flex items-center gap-2 text-moss hover:underline"
                    >
                      <Mail className="size-3.5" />
                      {item.email}
                    </a>
                    <a
                      href={"tel:" + item.phone}
                      className="inline-flex items-center gap-2 text-moss hover:underline"
                    >
                      <Phone className="size-3.5" />
                      {item.phone}
                    </a>
                  </div>
                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {status !== "da_duyet" && (
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleReview(item.id, "da_duyet")}
                        className="rounded-full bg-leaf/80 hover:bg-leaf text-white font-bold gap-1"
                      >
                        <Check className="size-3.5" />
                        Duyệt
                      </Button>
                    )}
                    {status !== "tu_choi" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => handleReview(item.id, "tu_choi")}
                        className="rounded-full border-destructive/40 text-destructive hover:bg-destructive/5 font-bold gap-1"
                      >
                        <X className="size-3.5" />
                        Từ chối
                      </Button>
                    )}
                    {status !== "cho_duyet" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isUpdating}
                        onClick={() => handleReview(item.id, "cho_duyet")}
                        className="rounded-full text-ink/50 font-bold text-xs"
                      >
                        Đặt lại
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
