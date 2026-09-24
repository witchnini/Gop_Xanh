import { Link } from "@tanstack/react-router";
import footerLogo from "../../../../docs/UI/UX style guideline/logo/Logo GX.png";

export function SiteFooter() {
  return (
    <footer className="bg-moss text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="relative h-[132px] w-[170px] overflow-hidden">
            <img
              src={footerLogo}
              alt="Góp Xanh"
              className="absolute -left-[34px] -top-[52px] h-[240px] w-[240px] max-w-none"
            />
          </div>
          <p className="text-white/75 mt-4 max-w-sm leading-relaxed">
            Nền tảng gây quỹ cộng đồng vi mô cho nông nghiệp xanh tại Hà Nội. Mỗi hành động nhỏ, một
            mái xanh lớn.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-white/55 font-bold">Khám phá</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link to="/chien-dich" className="hover:text-sage">
                Chiến dịch
              </Link>
            </li>
            <li>
              <Link to="/cong-tac-vien" className="hover:text-sage">
                Đăng ký cộng tác viên
              </Link>
            </li>
            <li>
              <Link to="/doi-tac" className="hover:text-sage">
                Đối tác
              </Link>
            </li>
            <li>
              <Link to="/bo-loc-xanh" className="hover:text-sage">
                Bộ lọc xanh
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase text-white/55 font-bold">Liên hệ</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>hello@gopxanh.vn</li>
            <li>(024) 3200 0000</li>
            <li>Học viện Ngân hàng, Q. Đống Đa, Hà Nội</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="max-w-7xl mx-auto px-6 py-5 text-xs text-white/50">
          © 2026 Góp Xanh · Nhóm dự án GIEO · Dữ liệu chiến dịch trong bản demo là dữ liệu mẫu.
        </p>
      </div>
    </footer>
  );
}
