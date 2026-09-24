import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Handshake, HeartHandshake, LogOut, Menu, ShieldCheck, UserRound } from "lucide-react";

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
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (!currentSession) return null;
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

  const roleInfo = session?.isAdmin
    ? {
        shortLabel: "Admin",
        fullLabel: "Quản trị viên",
        icon: ShieldCheck,
        badgeClass: "border-moss bg-moss text-white",
        actionClass: "bg-moss text-white hover:bg-leaf",
      }
    : session?.isPartner
      ? {
          shortLabel: "Chủ dự án",
          fullLabel: "Chủ dự án / Đối tác",
          icon: Handshake,
          badgeClass: "border-clay/40 bg-[#fff0d1] text-[#8a4f0e]",
          actionClass: "bg-clay text-white hover:bg-[#bd7930]",
        }
      : session
        ? {
            shortLabel: "Người đóng góp",
            fullLabel: "Người đóng góp",
            icon: HeartHandshake,
            badgeClass: "border-leaf/25 bg-[#e5f1e2] text-moss",
            actionClass: "bg-moss text-white hover:bg-leaf",
          }
        : null;

  const RoleIcon = roleInfo?.icon;
  const desktopRoleLinks = session?.isPartner
    ? [{ to: "/ho-so-cua-toi", label: "Hồ sơ của tôi" }]
    : session && !session.isAdmin
      ? [{ to: "/hoat-dong-cua-toi", label: "Hoạt động của tôi" }]
      : [];
  const mobileRoleLinks = session?.isAdmin
    ? [{ to: "/admin", label: "Panel quản trị" }]
    : session?.isPartner
      ? [
          { to: "/ho-so-cua-toi", label: "Hồ sơ của tôi" },
          { to: "/nop-ho-so", label: "Nộp hồ sơ" },
        ]
      : session
        ? [{ to: "/hoat-dong-cua-toi", label: "Hoạt động của tôi" }]
        : [];

  const primaryAction = session?.isAdmin
    ? { to: "/admin", label: "Panel quản trị" }
    : session?.isPartner
      ? { to: "/nop-ho-so", label: "Nộp hồ sơ" }
      : { to: "/chien-dich", label: "Đóng góp ngay" };

  return (
    <header className="sticky top-0 z-50 border-b border-moss/10 bg-white/95 text-moss shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Góp Xanh - Trang chủ">
          <span className="relative block h-14 w-[86px] overflow-hidden" aria-hidden="true">
            <img
              src={brandLogo}
              alt=""
              className="absolute -left-[15px] -top-[30px] h-[120px] w-[120px] max-w-none"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-4 whitespace-nowrap text-sm font-semibold text-ink/75 xl:flex 2xl:gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-moss" }}
              className="shrink-0 whitespace-nowrap transition-colors hover:text-moss"
            >
              {link.label}
            </Link>
          ))}
          {desktopRoleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "text-moss" }}
              className="shrink-0 whitespace-nowrap rounded-md bg-sage/70 px-3 py-2 font-bold text-moss transition-colors hover:bg-sage"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {session && roleInfo && RoleIcon ? (
            <>
              <span
                className={
                  "hidden h-9 items-center gap-2 whitespace-nowrap rounded-full border px-3 text-xs font-extrabold lg:inline-flex " +
                  roleInfo.badgeClass
                }
                aria-label={"Vai trò: " + roleInfo.fullLabel}
                title={"Vai trò: " + roleInfo.fullLabel}
              >
                <RoleIcon className="size-4" aria-hidden="true" />
                {roleInfo.shortLabel}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="hidden rounded-full font-bold text-moss hover:bg-moss/5 lg:inline-flex"
                aria-label="Đăng xuất"
                title="Đăng xuất"
              >
                <LogOut className="size-4" />
                <span className="hidden 2xl:inline">Đăng xuất</span>
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden whitespace-nowrap rounded-full font-bold text-moss hover:bg-moss/5 lg:inline-flex"
            >
              <Link to="/auth">Đăng nhập</Link>
            </Button>
          )}

          <Button
            asChild
            className={
              "hidden whitespace-nowrap rounded-full px-5 font-bold shadow-sm sm:inline-flex " +
              (roleInfo?.actionClass ?? "bg-moss text-white hover:bg-leaf")
            }
          >
            <Link to={primaryAction.to}>
              {RoleIcon && <RoleIcon className="size-4" aria-hidden="true" />}
              {primaryAction.label}
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-moss hover:bg-moss/5 xl:hidden"
                aria-label="Mở menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-moss/20 bg-white text-ink">
              {session && roleInfo && RoleIcon && (
                <div className="mx-6 mt-8 border-b border-moss/10 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-moss text-white">
                      <UserRound className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-ink">
                        {session.fullName || session.email}
                      </p>
                      <p className="truncate text-xs text-ink/45">{session.email}</p>
                    </div>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-sage px-3 py-1.5 text-xs font-bold text-moss">
                    <RoleIcon className="size-4" />
                    {roleInfo.fullLabel}
                  </span>
                </div>
              )}

              <nav className="mt-7 flex flex-col gap-5 px-6 text-lg font-semibold text-ink/80">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="whitespace-nowrap transition-colors hover:text-moss"
                  >
                    {link.label}
                  </Link>
                ))}
                {session && roleInfo && mobileRoleLinks.length > 0 && (
                  <div className="border-l-4 border-clay bg-[#fffaf0] px-4 py-3">
                    <p className="text-[11px] font-extrabold uppercase text-clay">
                      Dành cho {roleInfo.fullLabel}
                    </p>
                    <div className="mt-3 flex flex-col gap-3">
                      {mobileRoleLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="whitespace-nowrap text-sm font-extrabold text-moss transition-colors hover:text-leaf"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
