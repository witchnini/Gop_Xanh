import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { getMySession } from "@backend/campaigns.functions";
import { getMyActivity } from "@backend/gopxanh.functions";
import { campaigns as mockCampaigns } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/hoat-dong-cua-toi")({
  beforeLoad: async () => {
    const session = await getMySession();
    // Accessible by any logged-in user (contributor, partner, admin)
    if (!session.userId) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Hoạt động của tôi — Góp Xanh" },
      {
        name: "description",
        content:
          "Xem lại các chiến dịch bạn đã đăng ký hỗ trợ với vai trò cộng tác viên trên nền tảng Góp Xanh.",
      },
      { property: "og:title", content: "Hoạt động của tôi — Góp Xanh" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MyActivityPage,
});

function campaignName(slug: string) {
  return mockCampaigns.find((c) => c.slug === slug)?.name ?? slug;
}

function MyActivityPage() {
  const fetchActivity = useServerFn(getMyActivity);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-activity"],
    queryFn: fetchActivity,
    retry: false,
  });

  const applications = data?.applications ?? [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <p className="text-xs uppercase tracking-[0.15em] text-clay font-bold">
        Vai trò: Cộng tác viên / Người đóng góp
      </p>
      <h1 className="font-display text-5xl text-moss mt-2">Hoạt động của tôi</h1>
      <p className="text-ink/65 mt-3 leading-relaxed">
        Danh sách các chiến dịch bạn đã đăng ký hỗ trợ với vai trò cộng tác viên.
      </p>

      <div className="mt-10">
        <h2 className="font-display text-2xl text-moss">Đăng ký cộng tác viên</h2>

        {isLoading ? (
          <p className="text-ink/60 mt-6">Đang tải dữ liệu...</p>
        ) : isError ? (
          <div className="bg-destructive/10 rounded-3xl p-6 ring-1 ring-destructive/20 mt-6">
            <p className="text-sm font-bold text-destructive">Không tải được dữ liệu:</p>
            <p className="text-sm text-destructive/80 mt-1 font-mono">
              {error instanceof Error ? error.message : "Lỗi không xác định"}
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-card rounded-3xl p-8 ring-1 ring-moss/10 mt-6 text-center">
            <p className="text-ink/65 leading-relaxed">
              Bạn chưa đăng ký hỗ trợ chiến dịch nào. Hãy tìm hiểu các chiến dịch đang cần cộng
              tác viên!
            </p>
            <Button asChild className="rounded-full font-bold mt-5">
              <Link to="/cong-tac-vien">Đăng ký cộng tác viên</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {applications.map((app) => (
              <article
                key={app.id}
                className="bg-card rounded-3xl p-6 ring-1 ring-moss/10"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl text-moss">
                      {campaignName(app.campaign_slug)}
                    </h3>
                    <p className="text-xs text-ink/50 mt-1">
                      Vai trò: <span className="font-bold text-pine">{app.role}</span> · Đăng ký ngày{" "}
                      {new Date(app.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-leaf/15 text-pine">
                    Đang xét duyệt
                  </span>
                </div>
                <details className="mt-3 group">
                  <summary className="text-sm font-bold text-pine cursor-pointer select-none">
                    Xem kinh nghiệm đã gửi
                  </summary>
                  <p className="mt-2 text-sm text-ink/70 whitespace-pre-line border-l-2 border-pine/20 pl-4">
                    {app.experience}
                  </p>
                </details>
                <div className="mt-4">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full border-moss/30 text-moss hover:bg-moss/5"
                  >
                    <Link to="/chien-dich/$slug" params={{ slug: app.campaign_slug }}>
                      Xem chiến dịch →
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 flex gap-3 flex-wrap">
        <Button asChild className="rounded-full font-bold">
          <Link to="/cong-tac-vien">+ Đăng ký hỗ trợ chiến dịch mới</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-moss/30 text-moss">
          <Link to="/chien-dich">Xem tất cả chiến dịch</Link>
        </Button>
      </div>
    </div>
  );
}
