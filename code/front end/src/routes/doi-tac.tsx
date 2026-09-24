import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/doi-tac")({
  head: () => ({
    meta: [
      { title: "Đối tác đồng hành — Học viện Ngân hàng | Góp Xanh" },
      {
        name: "description",
        content:
          "Học viện Ngân hàng đồng hành cùng Góp Xanh: xây tiêu chí tài chính, đào tạo quản lý vốn cho nông hộ và huy động mentor.",
      },
      { property: "og:title", content: "Đối tác đồng hành — Góp Xanh" },
      {
        property: "og:description",
        content: "Vai trò chuyên môn của Học viện Ngân hàng trong nền tảng Góp Xanh.",
      },
    ],
  }),
  component: PartnerPage,
});

const roles = [
  {
    title: "Xây dựng tiêu chí tài chính",
    description:
      "Giảng viên khoa Tài chính hỗ trợ thiết kế bộ tiêu chí thẩm định nhu cầu vốn và khả năng hoàn vốn của nông hộ.",
  },
  {
    title: "Đào tạo quản lý tài chính",
    description:
      "Các khoá ngắn hạn về ghi chép thu chi, tính giá thành và lập kế hoạch vốn cho nông hộ, hợp tác xã.",
  },
  {
    title: "Huy động mentor sinh viên",
    description:
      "Sinh viên tham gia với vai trò cộng tác viên: truyền thông, thiết kế, khảo sát thực địa và hỗ trợ kế toán.",
  },
];


function PartnerPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-clay bg-clay/10 px-3 py-1.5 rounded-full">
        Đối tác chuyên môn
      </span>
      <h1 className="font-display text-5xl text-moss mt-6">Học viện Ngân hàng</h1>
      <p className="text-ink/65 mt-3 max-w-2xl leading-relaxed">
        Góp Xanh là dự án của nhóm GIEO — Học viện Ngân hàng. Nhà trường đồng hành với vai trò
        chuyên môn tài chính, giúp nền tảng giữ được tính khả thi và minh bạch trong từng chiến
        dịch.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {roles.map((r) => (
          <div key={r.title} className="bg-card rounded-3xl p-6 ring-1 ring-moss/10">
            <h2 className="font-display text-2xl text-moss">{r.title}</h2>
            <p className="text-sm text-ink/65 mt-3 leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-moss text-cream rounded-3xl p-8">
          <h2 className="font-display text-3xl">Giá trị cho nông hộ</h2>
          <ul className="mt-4 space-y-3 text-sm text-cream/80 leading-relaxed">
            <li>Tiếp cận vốn khởi động mà không cần tài sản thế chấp.</li>
            <li>Được hướng dẫn quản lý dòng tiền và lập kế hoạch mùa vụ.</li>
            <li>Kết nối với kênh tiêu thụ tại nội thành Hà Nội.</li>
          </ul>
        </div>
        <div className="bg-card rounded-3xl p-8 ring-1 ring-moss/10">
          <h2 className="font-display text-3xl text-moss">Giá trị cho nhà trường</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/65 leading-relaxed">
            <li>Không gian thực hành tài chính vi mô cho sinh viên.</li>
            <li>Dữ liệu thực tế phục vụ nghiên cứu tài chính nông nghiệp.</li>
            <li>Hoạt động cộng đồng gắn với chuyên môn đào tạo.</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-10">
        <Button asChild size="lg" className="rounded-full font-bold px-6">
          <Link to="/lien-he">Đăng ký hợp tác</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-full font-bold px-6 border-moss/30 text-moss hover:bg-moss/5"
        >
          <Link to="/cong-tac-vien">Tham gia làm mentor</Link>
        </Button>
      </div>
    </div>
  );
}
