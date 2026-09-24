import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardClock,
  HandCoins,
  Sprout,
  Users,
  UsersRound,
} from "lucide-react";

import { AdminEmptyState, AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminStatusBadge } from "@/components/admin/admin-ui";
import { formatAdminDate, formatAdminMoney } from "@/lib/admin-utils";
import { adminListCampaigns, adminListPending, adminStats } from "@backend/campaigns.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Tổng quan quản trị · Góp Xanh" },
      {
        name: "description",
        content: "Tổng quan vận hành, hồ sơ và nguồn lực trên nền tảng Góp Xanh.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const fetchStats = useServerFn(adminStats);
  const fetchPending = useServerFn(adminListPending);
  const fetchCampaigns = useServerFn(adminListCampaigns);

  const statsQuery = useQuery({ queryKey: ["admin-stats"], queryFn: fetchStats });
  const pendingQuery = useQuery({ queryKey: ["admin-pending"], queryFn: fetchPending });
  const campaignsQuery = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: fetchCampaigns,
  });

  const stats = statsQuery.data;
  const pending = pendingQuery.data ?? [];
  const campaigns = campaignsQuery.data ?? [];
  const loading = statsQuery.isLoading || pendingQuery.isLoading || campaignsQuery.isLoading;
  const error = statsQuery.error || pendingQuery.error || campaignsQuery.error;

  const statItems = [
    {
      label: "Hồ sơ cần xử lý",
      value: stats?.pendingCampaigns ?? 0,
      icon: ClipboardClock,
      href: "/admin/ho-so",
      accent: "text-clay",
    },
    {
      label: "Đang gây quỹ",
      value: stats?.liveCampaigns ?? 0,
      icon: Sprout,
      href: "/admin/chien-dich",
      accent: "text-leaf",
    },
    {
      label: "Tổng đóng góp demo",
      value: formatAdminMoney(stats?.totalRaised ?? 0),
      icon: HandCoins,
      href: "/admin/dong-gop",
      accent: "text-moss",
    },
    {
      label: "Lượt đóng góp",
      value: stats?.totalDonations ?? 0,
      icon: Users,
      href: "/admin/dong-gop",
      accent: "text-moss",
    },
    {
      label: "Đăng ký chuyên môn",
      value: stats?.totalVolunteers ?? 0,
      icon: UsersRound,
      href: "/admin/cong-tac-vien",
      accent: "text-leaf",
    },
    {
      label: "Tài khoản nền tảng",
      value: stats?.totalUsers ?? 0,
      icon: CheckCircle2,
      href: "/admin",
      accent: "text-moss",
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Trung tâm vận hành"
        title="Tổng quan"
        description="Theo dõi vòng đời chiến dịch từ tiếp nhận hồ sơ, sàng lọc, huy động nguồn lực đến cập nhật tác động."
        action={
          <Link
            to="/admin/ho-so"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-moss px-4 text-sm font-bold text-white hover:bg-leaf"
          >
            Xử lý hồ sơ
            <ArrowRight className="size-4" />
          </Link>
        }
      />

      {error && (
        <p className="mt-5 border-l-4 border-destructive bg-white px-4 py-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Không tải được dữ liệu quản trị."}
        </p>
      )}

      <section
        aria-label="Chỉ số vận hành"
        className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.href}
              className="group border border-moss/10 bg-white p-5 transition hover:border-moss/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-ink/45">{item.label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-ink">
                    {loading ? "—" : item.value}
                  </p>
                </div>
                <Icon className={"size-5 " + item.accent} />
              </div>
              <p className="mt-4 flex items-center gap-1 text-xs font-bold text-moss">
                Xem chi tiết
                <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
              </p>
            </Link>
          );
        })}
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.45fr_0.8fr]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-moss">Ưu tiên xét duyệt</h2>
              <p className="mt-1 text-sm text-ink/55">Hồ sơ chờ lâu nhất được đưa lên trước.</p>
            </div>
            <Link to="/admin/ho-so" className="text-xs font-bold text-moss hover:underline">
              Xem tất cả
            </Link>
          </div>

          {pending.length === 0 ? (
            <AdminEmptyState
              icon={CheckCircle2}
              title="Không còn hồ sơ chờ xử lý"
              description="Các hồ sơ mới sẽ xuất hiện tại đây sau khi Chủ dự án / Đối tác gửi xét duyệt."
            />
          ) : (
            <div className="overflow-x-auto border border-moss/10 bg-white">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-moss/10 bg-[#f8faf6] text-xs uppercase text-ink/45">
                  <tr>
                    <th className="px-4 py-3">Hồ sơ</th>
                    <th className="px-4 py-3">Chủ thể</th>
                    <th className="px-4 py-3">Ngày gửi</th>
                    <th className="px-4 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.slice(0, 6).map((campaign) => (
                    <tr key={campaign.id} className="border-b border-moss/5 last:border-0">
                      <td className="px-4 py-3">
                        <Link to="/admin/ho-so" className="font-bold text-moss hover:underline">
                          {campaign.name}
                        </Link>
                        <p className="mt-1 text-xs text-ink/45">{campaign.district}</p>
                      </td>
                      <td className="px-4 py-3 text-ink/65">{campaign.ownerName}</td>
                      <td className="px-4 py-3 text-ink/55">
                        {formatAdminDate(campaign.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={campaign.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-moss">Tình trạng chiến dịch</h2>
          <p className="mt-1 text-sm text-ink/55">Ảnh chụp nhanh toàn bộ danh mục.</p>
          <div className="mt-4 divide-y divide-moss/10 border border-moss/10 bg-white">
            {[
              ["Tổng chiến dịch", campaigns.length],
              ["Chờ duyệt / bổ sung", stats?.pendingCampaigns ?? 0],
              ["Đang gây quỹ", stats?.liveCampaigns ?? 0],
              ["Đã hoàn thành", stats?.completedCampaigns ?? 0],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-ink/60">{label}</span>
                <span className="text-sm font-extrabold text-moss">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
