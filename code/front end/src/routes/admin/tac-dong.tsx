import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, NotebookTabs } from "lucide-react";

import { AdminEmptyState, AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminStatusBadge } from "@/components/admin/admin-ui";
import { formatAdminDate } from "@/lib/admin-utils";
import { adminListCampaignUpdates } from "@backend/campaigns.functions";

export const Route = createFileRoute("/admin/tac-dong")({
  head: () => ({
    meta: [
      { title: "Tác động & tiến độ · Góp Xanh Admin" },
      {
        name: "description",
        content: "Theo dõi nhật ký tiến độ và tác động dự kiến của chiến dịch Góp Xanh.",
      },
    ],
  }),
  component: AdminImpactPage,
});

function AdminImpactPage() {
  const fetchUpdates = useServerFn(adminListCampaignUpdates);
  const {
    data: updates = [],
    isLoading,
    error,
  } = useQuery({ queryKey: ["admin-campaign-updates"], queryFn: fetchUpdates });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Theo dõi tác động"
        title="Tác động & tiến độ"
        description="Kiểm tra các mốc triển khai do Chủ dự án / Đối tác cập nhật. Chỉ số tác động định lượng và minh chứng độc lập chưa thuộc schema MVP hiện tại."
      />
      {error && (
        <p className="mt-5 border-l-4 border-destructive bg-white px-4 py-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Không tải được nhật ký tiến độ."}
        </p>
      )}
      {!isLoading && updates.length === 0 ? (
        <div className="mt-6">
          <AdminEmptyState
            icon={NotebookTabs}
            title="Chưa có nhật ký tiến độ"
            description="Khi Chủ dự án đăng cập nhật, các mốc mới nhất sẽ xuất hiện tại đây."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {updates.map((update) => (
            <article key={update.id} className="border border-moss/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-clay">
                    {formatAdminDate(update.created_at)}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold text-moss">
                    {update.title}
                  </h2>
                </div>
                {update.campaign && <AdminStatusBadge status={update.campaign.status} />}
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/65">{update.description}</p>
              {update.campaign && (
                <div className="mt-5 border-t border-moss/10 pt-4">
                  <p className="text-xs font-bold uppercase text-ink/40">Chiến dịch</p>
                  <div className="mt-1 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-moss">{update.campaign.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink/50">
                        Tác động kỳ vọng: {update.campaign.impact}
                      </p>
                    </div>
                    {(update.campaign.status === "dang_gay_quy" ||
                      update.campaign.status === "hoan_thanh") && (
                      <Link
                        to="/chien-dich/$slug"
                        params={{ slug: update.campaign.slug }}
                        className="shrink-0 text-moss hover:text-leaf"
                        aria-label={"Xem chiến dịch " + update.campaign.name}
                      >
                        <ArrowUpRight className="size-4" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
