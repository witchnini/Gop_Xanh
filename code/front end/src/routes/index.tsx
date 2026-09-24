import { createFileRoute, Link } from "@tanstack/react-router";

import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui/button";
import { campaigns, heroImage, modelSteps, platformStats, progressOf, formatVnd } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Góp Xanh — Gây quỹ cộng đồng cho nông nghiệp xanh Hà Nội" },
      {
        name: "description",
        content:
          "Góp Xanh kết nối người trẻ đô thị với nông hộ, hợp tác xã canh tác xanh quanh Hà Nội. Góp từ 50.000đ, theo dõi tác động minh bạch.",
      },
      { property: "og:title", content: "Góp Xanh — Gây quỹ cộng đồng cho nông nghiệp xanh" },
      {
        property: "og:description",
        content: "Góp từ 50.000đ cho nông hộ xanh quanh Hà Nội và theo dõi tác động minh bạch.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = campaigns[0]!;
  const percent = progressOf(featured);

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-clay bg-clay/10 px-3 py-1.5 rounded-full">
            <span className="size-2 rounded-full bg-clay" /> Chiến dịch nổi bật
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-moss mt-6">
            Gieo một đồng,
            <br />
            ươm một <span className="italic text-leaf">mảnh xanh</span> giữa lòng Hà Nội.
          </h1>
          <p className="text-lg text-ink/70 mt-6 max-w-xl leading-relaxed">
            Góp Xanh kết nối bạn với các nông hộ và hợp tác xã canh tác xanh ngoại thành. Mỗi đóng
            góp vi mô đều biến thành hạt giống, giống cây và vùng đất sạch — minh bạch tới từng
            đồng.
          </p>
          <div className="grid gap-3 mt-8 sm:flex sm:flex-wrap">
            <Button asChild size="lg" className="w-full rounded-full font-bold px-6 sm:w-auto">
              <Link to="/chien-dich">Xem tất cả chiến dịch</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full font-bold px-6 border-moss/30 text-moss hover:bg-moss/5 sm:w-auto"
            >
              <Link to="/cong-tac-vien">Đăng ký cộng tác viên</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 mt-10 text-sm sm:flex sm:flex-wrap sm:gap-x-8">
            {platformStats.map((s) => (
              <p key={s.label} className="flex min-w-0 items-center gap-2">
                <span className="font-display text-2xl text-moss">{s.value}</span>
                <span className="text-ink/60">{s.label}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-card rounded-3xl p-4 sm:p-6 shadow-widget ring-1 ring-moss/10">
            <img
              src={heroImage}
              alt="Cánh đồng rau hữu cơ ngoại thành Hà Nội lúc bình minh"
              width={1024}
              height={640}
              className="w-full aspect-[16/10] object-cover rounded-2xl"
            />
            <div className="flex flex-wrap items-start justify-between gap-3 mt-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-clay font-bold">
                  Vùng trồng · {featured.district}
                </p>
                <h2 className="font-display text-2xl text-moss mt-1">{featured.name}</h2>
              </div>
              <span className="text-xs font-bold bg-leaf/15 text-pine px-3 py-1.5 rounded-full">
                {percent}% tiến độ
              </span>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <p className="font-display text-3xl text-moss">{formatVnd(featured.raised)}</p>
                <p className="text-sm text-ink/50">mục tiêu {formatVnd(featured.goal)}</p>
              </div>
              <div className="h-3 rounded-full bg-moss/10 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-leaf to-moss"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex gap-2">
                {featured.tiers.map((t) => (
                  <Link
                    key={t.amount}
                    to="/dong-gop/$slug"
                    params={{ slug: featured.slug }}
                    search={{ amount: t.amount }}
                    className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl border border-moss/20 hover:bg-moss/5 transition"
                  >
                    {Math.round(t.amount / 1000)}k
                  </Link>
                ))}
              </div>
              <Button
                asChild
                className="w-full rounded-xl font-bold bg-clay text-white hover:brightness-95"
              >
                <Link to="/dong-gop/$slug" params={{ slug: featured.slug }}>
                  Góp cho chiến dịch này
                </Link>
              </Button>
              <p className="text-[11px] text-ink/45 leading-snug">
                Bản demo mô phỏng thanh toán: bạn sẽ nhận xác nhận và bản cập nhật từ nông hộ, chưa
                trừ tiền thật.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="font-display text-4xl text-moss">Mô hình hoạt động</h2>
        <p className="text-ink/60 mt-1">
          Góp đa nguồn lực — Lọc xanh — Theo dõi tác động — Chia sẻ rủi ro.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {modelSteps.map((s) => (
            <div key={s.step} className="bg-card rounded-3xl p-6 ring-1 ring-moss/10">
              <span className="font-display text-2xl text-clay">{s.step}</span>
              <h3 className="font-display text-xl text-moss mt-3">{s.title}</h3>
              <p className="text-sm text-ink/60 mt-2 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl text-moss">Chiến dịch nổi bật</h2>
            <p className="text-ink/60 mt-1">Đang cần sự đồng hành của bạn ngay lúc này.</p>
          </div>
          <Link
            to="/chien-dich"
            className="text-sm font-bold text-moss hover:text-leaf hover:underline"
          >
            Xem tất cả chiến dịch →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {campaigns.map((c) => (
            <CampaignCard key={c.slug} campaign={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
