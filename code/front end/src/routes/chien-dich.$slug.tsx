import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { getPublicCampaign } from "@backend/campaigns.functions";
import { formatVnd, getCampaign, mapDbCampaign, progressOf } from "@/lib/data";

export const Route = createFileRoute("/chien-dich/$slug")({
  loader: async ({ params }) => {
    const mock = getCampaign(params.slug);
    if (mock) return { campaign: mock };
    const db = await getPublicCampaign({ data: { slug: params.slug } });
    if (!db) throw notFound();
    return { campaign: mapDbCampaign(db) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Không tìm thấy chiến dịch — Góp Xanh" }, { name: "robots", content: "noindex" }],
      };
    }
    const { campaign } = loaderData;
    return {
      meta: [
        { title: `${campaign.name} — Chiến dịch Góp Xanh` },
        { name: "description", content: campaign.summary },
        { property: "og:title", content: `${campaign.name} — Góp Xanh` },
        { property: "og:description", content: campaign.summary },
      ],
    };
  },
  component: CampaignDetail,
});

function CampaignDetail() {
  const { campaign } = Route.useLoaderData();
  const percent = progressOf(campaign);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/chien-dich" className="text-sm font-semibold text-ink/50 hover:text-moss">
        ← Tất cả chiến dịch
      </Link>

      <div className="grid lg:grid-cols-12 gap-10 mt-6">
        <div className="lg:col-span-7">
          <img
            src={campaign.image}
            alt={`Hình ảnh chiến dịch ${campaign.name}`}
            width={1024}
            height={640}
            className="w-full aspect-[16/10] object-cover rounded-3xl"
          />
          <div className="flex items-center gap-3 mt-6 text-xs font-bold">
            <span className="bg-leaf/15 text-pine px-3 py-1 rounded-full">{campaign.category}</span>
            <span className="text-ink/40">{campaign.district}</span>
            <span className="text-ink/40">· {campaign.status}</span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl text-moss mt-3">{campaign.name}</h1>
          <p className="text-ink/60 mt-2">Chủ thể: {campaign.owner}</p>
          <p className="text-lg text-ink/75 mt-6 leading-relaxed">{campaign.story}</p>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-card rounded-3xl p-5 ring-1 ring-moss/10">
              <p className="text-xs uppercase tracking-[0.15em] text-clay font-bold">
                Phương thức sản xuất
              </p>
              <p className="text-sm text-ink/70 mt-2 leading-relaxed">{campaign.method}</p>
            </div>
            <div className="bg-card rounded-3xl p-5 ring-1 ring-moss/10">
              <p className="text-xs uppercase tracking-[0.15em] text-clay font-bold">
                Tác động dự kiến
              </p>
              <p className="text-sm text-ink/70 mt-2 leading-relaxed">{campaign.impact}</p>
            </div>
          </div>

          {campaign.budget.length > 0 && (
            <>
              <h2 className="font-display text-3xl text-moss mt-12">Kế hoạch sử dụng vốn</h2>
              <div className="mt-5 space-y-3">
                {campaign.budget.map((b) => {
                  const share = Math.round((b.amount / campaign.goal) * 100);
                  return (
                    <div key={b.label} className="bg-card rounded-2xl p-4 ring-1 ring-moss/10">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-ink/80">{b.label}</span>
                        <span className="font-bold text-moss">{formatVnd(b.amount)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-moss/10 overflow-hidden mt-2">
                        <div className="h-full bg-sage rounded-full" style={{ width: `${share}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {campaign.updates.length > 0 && (
            <>
              <h2 className="font-display text-3xl text-moss mt-12">Nhật ký cập nhật</h2>
              <ol className="mt-5 border-l-2 border-moss/15 pl-6 space-y-8">
                {campaign.updates.map((u) => (
                  <li key={u.date + u.title} className="relative">
                    <span className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-leaf" />
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-clay">{u.date}</p>
                    <p className="font-display text-xl text-moss mt-1">{u.title}</p>
                    <p className="text-sm text-ink/65 mt-1 leading-relaxed">{u.description}</p>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-card rounded-3xl p-6 ring-1 ring-moss/10 shadow-widget lg:sticky lg:top-6">
            <div className="flex items-end justify-between">
              <p className="font-display text-3xl text-moss">{formatVnd(campaign.raised)}</p>
              <p className="text-sm text-ink/50">mục tiêu {formatVnd(campaign.goal)}</p>
            </div>
            <div className="h-3 rounded-full bg-moss/10 mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-leaf to-moss"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-ink/55 mt-3">
              <span>{percent}% · {campaign.supporters} người đã góp</span>
              <span>còn {campaign.daysLeft} ngày</span>
            </div>

            {campaign.tiers.length > 0 && (
              <>
                <h2 className="font-display text-2xl text-moss mt-8">Các gói đóng góp</h2>
                <div className="mt-4 space-y-3">
                  {campaign.tiers.map((t) => (
                    <Link
                      key={t.amount}
                      to="/dong-gop/$slug"
                      params={{ slug: campaign.slug }}
                      search={{ amount: t.amount }}
                      className="block rounded-2xl border border-moss/15 p-4 hover:border-moss/40 hover:bg-moss/5 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg text-moss">{t.title}</span>
                        <span className="text-sm font-bold text-clay">{formatVnd(t.amount)}</span>
                      </div>
                      <p className="text-sm text-ink/60 mt-1 leading-relaxed">{t.reward}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="mt-6 space-y-3">
              <Button asChild size="lg" className="w-full rounded-full font-bold">
                <Link to="/dong-gop/$slug" params={{ slug: campaign.slug }}>
                  Đóng góp ngay
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full rounded-full font-bold border-moss/30 text-moss hover:bg-moss/5"
              >
                <Link to="/cong-tac-vien" search={{ campaign: campaign.slug }}>
                  Tham gia với vai trò cộng tác viên
                </Link>
              </Button>
            </div>

            {campaign.roles.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.15em] text-clay font-bold">
                  Vai trò đang cần hỗ trợ
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink/65">
                  {campaign.roles.map((r) => (
                    <li key={r.title}>
                      <span className="font-semibold text-ink/85">{r.title}</span> — {r.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
