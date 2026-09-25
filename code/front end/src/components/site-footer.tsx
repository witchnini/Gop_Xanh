import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import footerLogo from "../../../../docs/UI/UX style guideline/logo/Logo GX.png";

export function SiteFooter() {
  return (
    <footer className="bg-moss text-white mt-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 md:grid-cols-[minmax(0,1.4fr)_minmax(150px,0.65fr)_minmax(220px,1fr)] md:gap-8 lg:px-8">
        <div className="max-w-md">
          <div className="relative h-[104px] w-[136px] overflow-hidden">
            <img
              src={footerLogo}
              alt="Góp Xanh"
              className="absolute -left-[29px] -top-[42px] h-[190px] w-[190px] max-w-none"
            />
          </div>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/75">
            Nền tảng gây quỹ cộng đồng vi mô cho nông nghiệp xanh tại Hà Nội. Mỗi hành động nhỏ, một
            mái xanh lớn.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-sage">Khám phá</p>
          <ul className="mt-3 space-y-2 text-sm leading-5 text-white/80">
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
          <p className="text-xs font-bold uppercase text-sage">Liên hệ</p>
          <ul className="mt-3 space-y-3 text-sm leading-5 text-white/80">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden="true" />
              <a href="mailto:hello@gopxanh.vn" className="break-all hover:text-sage">
                hello@gopxanh.vn
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden="true" />
              <a href="tel:+842432000000" className="hover:text-sage">
                (024) 3200 0000
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden="true" />
              <span>Học viện Ngân hàng, Q. Đống Đa, Hà Nội</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-5xl px-6 py-3 text-xs leading-5 text-white/50 lg:px-8">
          © 2026 Góp Xanh · Nhóm dự án Shark Xanh · Dữ liệu chiến dịch trong bản demo là dữ liệu mẫu.
        </p>
      </div>
    </footer>
  );
}
