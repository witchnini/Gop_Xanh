import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  ClipboardCheck,
  ExternalLink,
  HandCoins,
  Leaf,
  LogOut,
  Menu,
  NotebookTabs,
  PanelLeftClose,
  PanelLeftOpen,
  Sprout,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import footerLogo from "../../../../../docs/UI/UX style guideline/logo/Logo GX.png";

type AdminShellProps = {
  children: React.ReactNode;
  userLabel: string;
};

type AdminNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const adminNav: AdminNavItem[] = [
  { to: "/admin", label: "Tổng quan", icon: BarChart3, exact: true },
  { to: "/admin/ho-so", label: "Duyệt hồ sơ", icon: ClipboardCheck },
  { to: "/admin/chien-dich", label: "Chiến dịch", icon: Sprout },
  { to: "/admin/dong-gop", label: "Đóng góp", icon: HandCoins },
  { to: "/admin/cong-tac-vien", label: "Cộng tác viên", icon: UsersRound },
  { to: "/admin/tac-dong", label: "Tác động & tiến độ", icon: NotebookTabs },
];

function AdminNavigation({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <TooltipProvider delayDuration={150}>
      <nav className="space-y-1" aria-label="Điều hướng quản trị">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const link = (
            <Link
              to={item.to}
              onClick={onNavigate}
              aria-label={collapsed ? item.label : undefined}
              className={
                "flex h-10 items-center rounded-md text-sm font-semibold transition " +
                (collapsed ? "justify-center px-2 " : "gap-3 px-3 ") +
                (active ? "bg-sage text-moss" : "text-white/75 hover:bg-white/10 hover:text-white")
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );

          return collapsed ? (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            <div key={item.to}>{link}</div>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/admin" className="flex justify-center" aria-label="Góp Xanh Admin">
      <span
        className={
          "relative block shrink-0 overflow-hidden transition-[width,height] duration-200 " +
          (compact ? "h-12 w-[62px]" : "h-24 w-[124px]")
        }
        aria-hidden="true"
      >
        <img
          src={footerLogo}
          alt=""
          className={
            "absolute max-w-none " +
            (compact
              ? "-left-[13px] -top-[20px] h-[90px] w-[90px]"
              : "-left-[26px] -top-[39px] h-[176px] w-[176px]")
          }
        />
      </span>
    </Link>
  );
}

export function AdminShell({ children, userLabel }: AdminShellProps) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-ink">
      <aside
        className={
          "fixed inset-y-0 left-0 z-40 hidden flex-col bg-moss py-5 transition-[width,padding] duration-200 lg:flex " +
          (collapsed ? "w-20 px-2" : "w-64 px-4")
        }
      >
        <BrandMark compact={collapsed} />
        <div className={(collapsed ? "mt-8" : "mt-5") + " flex-1"}>
          <AdminNavigation collapsed={collapsed} />
        </div>
        <div className="border-t border-white/15 pt-3">
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className={
              "flex h-10 w-full items-center rounded-md text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white " +
              (collapsed ? "justify-center px-2" : "gap-3 px-3")
            }
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
            {!collapsed && <span>Thu gọn</span>}
          </button>
        </div>
        <div className="mt-3 border-t border-white/15 pt-3">
          {!collapsed && (
            <p className="truncate px-3 text-xs font-semibold text-white/70">{userLabel}</p>
          )}
          <button
            type="button"
            onClick={signOut}
            className={
              "mt-2 flex h-10 w-full items-center rounded-md text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white " +
              (collapsed ? "justify-center px-2" : "gap-3 px-3")
            }
            aria-label="Đăng xuất"
            title={collapsed ? "Đăng xuất" : undefined}
          >
            <LogOut className="size-4" aria-hidden="true" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-moss/10 bg-white px-4 lg:hidden">
        <BrandMark compact />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Mở menu quản trị">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-0 bg-moss text-white">
            <div className="mt-2">
              <BrandMark />
            </div>
            <div className="mt-8">
              <AdminNavigation />
            </div>
            <button
              type="button"
              onClick={signOut}
              className="mt-8 flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-white/75 hover:bg-white/10"
            >
              <LogOut className="size-4" />
              Đăng xuất
            </button>
          </SheetContent>
        </Sheet>
      </header>

      <div className={"transition-[padding] duration-200 " + (collapsed ? "lg:pl-20" : "lg:pl-64")}>
        <div className="border-b border-moss/10 bg-white">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3 lg:px-8">
            <p className="text-xs font-semibold text-ink/55">
              Không gian vận hành nội bộ · Dữ liệu đóng góp tài chính đang ở chế độ mô phỏng
            </p>
            <Link
              to="/"
              className="hidden items-center gap-2 text-xs font-bold text-moss hover:text-leaf sm:flex"
            >
              Xem website
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
        <main className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-moss/10 pb-5">
      <div>
        <p className="text-xs font-bold uppercase text-clay">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-moss lg:text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/60">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AdminEmptyState({
  icon: Icon = Leaf,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-dashed border-moss/25 bg-white px-6 py-12 text-center">
      <Icon className="mx-auto size-7 text-leaf" />
      <h2 className="mt-3 text-sm font-bold text-moss">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink/55">{description}</p>
    </div>
  );
}
