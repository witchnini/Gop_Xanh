import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, ExternalLink, Search, Sprout } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminEmptyState, AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminStatusBadge } from "@/components/admin/admin-ui";
import { ADMIN_STATUS_LABELS, formatAdminDate, formatAdminMoney } from "@/lib/admin-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminListCampaigns, adminReviewCampaign } from "@backend/campaigns.functions";

export const Route = createFileRoute("/admin/chien-dich")({
  head: () => ({
    meta: [
      { title: "Quản lý chiến dịch · Góp Xanh Admin" },
      { name: "description", content: "Theo dõi trạng thái và vòng đời các chiến dịch Góp Xanh." },
    ],
  }),
  component: AdminCampaignsPage,
});

function AdminCampaignsPage() {
  const fetchCampaigns = useServerFn(adminListCampaigns);
  const reviewCampaign = useServerFn(adminReviewCampaign);
  const queryClient = useQueryClient();
  const {
    data: campaigns = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: fetchCampaigns,
  });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [acting, setActing] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return campaigns.filter((campaign) => {
      const matchesStatus = status === "all" || campaign.status === status;
      const matchesQuery =
        !normalized ||
        campaign.name.toLocaleLowerCase("vi").includes(normalized) ||
        campaign.district.toLocaleLowerCase("vi").includes(normalized) ||
        campaign.category.toLocaleLowerCase("vi").includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [campaigns, query, status]);

  async function completeCampaign(campaignId: string) {
    setActing(campaignId);
    try {
      await reviewCampaign({ data: { campaignId, status: "hoan_thanh" } });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] }),
      ]);
    } finally {
      setActing(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Danh mục vận hành"
        title="Chiến dịch"
        description="Theo dõi trạng thái, tiến độ huy động và đóng chiến dịch khi kế hoạch đã hoàn tất."
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-ink/35" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên, loại mô hình hoặc khu vực..."
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {Object.entries(ADMIN_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="font-bold text-moss">
          {isLoading ? "Đang tải..." : filtered.length + " / " + campaigns.length + " chiến dịch"}
        </p>
        <p className="text-xs text-ink/45">Đóng góp tài chính trong MVP là dữ liệu mô phỏng.</p>
      </div>

      {error && (
        <p className="mt-4 border-l-4 border-destructive bg-white px-4 py-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Không tải được chiến dịch."}
        </p>
      )}

      {!isLoading && filtered.length === 0 ? (
        <div className="mt-5">
          <AdminEmptyState
            icon={Sprout}
            title="Không tìm thấy chiến dịch"
            description="Thử thay đổi từ khóa hoặc bộ lọc trạng thái."
          />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto border border-moss/10 bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-moss/10 bg-[#f8faf6] text-xs uppercase text-ink/45">
              <tr>
                <th className="px-4 py-3">Chiến dịch</th>
                <th className="px-4 py-3">Mục tiêu</th>
                <th className="px-4 py-3">Đã huy động</th>
                <th className="px-4 py-3">Người góp</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((campaign) => {
                const progress =
                  Number(campaign.goal) > 0
                    ? Math.min(
                        100,
                        Math.round((Number(campaign.raised) / Number(campaign.goal)) * 100),
                      )
                    : 0;
                return (
                  <tr key={campaign.id} className="border-b border-moss/5 last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-bold text-moss">{campaign.name}</p>
                      <p className="mt-1 text-xs text-ink/45">
                        {campaign.category} · {campaign.district} ·{" "}
                        {formatAdminDate(campaign.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-ink/65">
                      {formatAdminMoney(Number(campaign.goal))}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-moss">
                        {formatAdminMoney(Number(campaign.raised))}
                      </p>
                      <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-moss/10">
                        <div className="h-full bg-leaf" style={{ width: progress + "%" }} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-ink/60">{campaign.supporters}</td>
                    <td className="px-4 py-4">
                      <AdminStatusBadge status={campaign.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {(campaign.status === "dang_gay_quy" ||
                          campaign.status === "hoan_thanh") && (
                          <Link
                            to="/chien-dich/$slug"
                            params={{ slug: campaign.slug }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-moss hover:underline"
                          >
                            Xem <ExternalLink className="size-3" />
                          </Link>
                        )}
                        {campaign.status === "dang_gay_quy" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={acting !== null}
                            onClick={() => completeCampaign(campaign.id)}
                            className="h-8 text-xs font-bold"
                          >
                            <CheckCircle2 className="size-3.5" /> Hoàn thành
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
