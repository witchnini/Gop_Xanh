import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { greenFilterCriteria } from "@/lib/data";

export const Route = createFileRoute("/bo-loc-xanh")({
  head: () => ({
    meta: [
      { title: "Bộ lọc xanh — Tiêu chí xét duyệt chiến dịch | Góp Xanh" },
      {
        name: "description",
        content:
          "Mọi chiến dịch trên Góp Xanh đều qua bộ lọc xanh: tính khả thi, mức độ minh bạch và tác động tới môi trường, cộng đồng.",
      },
      { property: "og:title", content: "Bộ lọc xanh — Góp Xanh" },
      {
        property: "og:description",
        content: "Ba nhóm tiêu chí sàng lọc trước khi một chiến dịch được mở gây quỹ.",
      },
    ],
  }),
  component: GreenFilterPage,
});

function GreenFilterPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-5xl text-moss">Bộ lọc xanh</h1>
      <p className="text-ink/65 mt-3 max-w-2xl leading-relaxed">
        Trước khi một chiến dịch được mở gây quỹ, ban điều hành Góp Xanh cùng giảng viên Học viện
        Ngân hàng thẩm định hồ sơ theo ba nhóm tiêu chí. Đây là cơ sở để người đóng góp yên tâm và
        để nông hộ biết cần chuẩn bị gì.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {greenFilterCriteria.map((g, i) => (
          <div key={g.group} className="bg-card rounded-3xl p-6 ring-1 ring-moss/10">
            <span className="font-display text-2xl text-clay">0{i + 1}</span>
            <h2 className="font-display text-2xl text-moss mt-3">{g.group}</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink/65 leading-relaxed">
              {g.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 rounded-full bg-leaf shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-moss text-cream rounded-3xl p-8 mt-12">
        <h2 className="font-display text-3xl">Quy trình xét duyệt</h2>
        <ol className="grid md:grid-cols-4 gap-6 mt-6 text-sm">
          <li>
            <span className="font-display text-2xl">01</span>
            <p className="text-cream/75 mt-2">Nông hộ nộp hồ sơ mô hình và nhu cầu vốn.</p>
          </li>
          <li>
            <span className="font-display text-2xl">02</span>
            <p className="text-cream/75 mt-2">Ban điều hành chấm theo ba nhóm tiêu chí.</p>
          </li>
          <li>
            <span className="font-display text-2xl">03</span>
            <p className="text-cream/75 mt-2">Khảo sát thực địa cùng cộng tác viên địa phương.</p>
          </li>
          <li>
            <span className="font-display text-2xl">04</span>
            <p className="text-cream/75 mt-2">Công bố chiến dịch và mở gây quỹ trên nền tảng.</p>
          </li>
        </ol>
      </div>

      <div className="flex flex-wrap gap-3 mt-10">
        <Button asChild size="lg" className="rounded-full font-bold px-6">
          <Link to="/chien-dich">Xem chiến dịch đã qua bộ lọc</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-full font-bold px-6 border-moss/30 text-moss hover:bg-moss/5"
        >
          <Link to="/lien-he">Nông hộ muốn đăng ký</Link>
        </Button>
      </div>
    </div>
  );
}
