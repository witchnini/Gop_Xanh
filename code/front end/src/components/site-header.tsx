import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Menu, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { getMySession } from "@backend/campaigns.functions";
import brandLogo from "../../../../docs/UI/UX style guideline/logo/Logo.png";

const links = [
  { to: "/", label: "Trang chủ" },
  { to: "/chien-dich", label: "Chiến dịch" },
  { to: "/bo-loc-xanh", label: "Bộ lọc xanh" },
  { to: "/cong-tac-vien", label: "Cộng tác viên" },
  { to: "/doi-tac", label: "Đối tác" },
  { to: "/lien-he", label: "Liên hệ" },
] as const;

export function SiteHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchSession = useServerFn(getMySession);

  const { data: session } = useQuery({
    queryKey: ["header-session"],
    queryFn: async () => {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      if (!s) return null;
      try {
        return await fetchSession();
      } catch {
        return null;
      }
    },
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  const roleLinks = session
    ? session.isAdmin
      ? [{ to: "/quan-tri", label: "Quản trị" }]
      : session.isPartner
        ? [
            { to: "/ho-so-cua-toi", label: "Hồ sơ của tôi" },
            { to: "/nop-ho-so", label: "Nộp hồ sơ" },
          ]
        : []
    : [];

  return (
    <header className="sticky top-0 z-50 border-b border-moss/10 bg-white/95 text-moss shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Góp Xanh - Trang chủ">
          <span className="relative block h-14 w-[86px] overflow-hidden" aria-hidden="true">
            <img
              src={brandLogo}
              alt=""
              className="absolute -left-[15px] -top-[30px] h-[120px] w-[120px] max-w-none"
            />
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-ink/75">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-moss" }}
              className="hover:text-moss transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {roleLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to as string}
              activeProps={{ className: "text-moss" }}
              className="hover:text-moss transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="hidden md:flex items-center gap-2 text-xs font-semibold text-ink/65">
                <UserRound className="size-4" />
                {session.fullName || session.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="hidden sm:inline-flex rounded-full font-bold text-moss hover:bg-moss/5"
              >
                <LogOut className="size-4" /> Đăng xuất
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex rounded-full font-bold text-moss hover:bg-moss/5"
            >
              <Link to="/auth">Đăng nhập</Link>
            </Button>
          )}
          <Button
            asChild
            className="hidden sm:inline-flex rounded-full font-bold px-5 bg-moss text-white hover:bg-leaf"
          >
            <Link to="/chien-dich">Đóng góp ngay</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-moss hover:bg-moss/5"
                aria-label="Mở menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-moss/20 text-ink">
              <nav className="mt-10 flex flex-col gap-5 px-6 text-lg font-semibold text-ink/80">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} className="hover:text-moss transition-colors">
                    {l.label}
                  </Link>
                ))}
                {roleLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to as string}
                    className="hover:text-moss transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                {session ? (
                  <button type="button" onClick={handleSignOut} className="text-left text-moss">
                    Đăng xuất
                  </button>
                ) : (
                  <Link to="/auth" className="text-moss">
                    Đăng nhập
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
