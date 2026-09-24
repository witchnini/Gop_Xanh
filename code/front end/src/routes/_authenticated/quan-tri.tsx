import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminListCampaigns,
  adminListPending,
  adminReviewCampaign,
  adminStats,
  getMySession,
} from "@backend/campaigns.functions";
import { formatShort } from "@/lib/data";
import { STATUS_LABELS } from "./ho-so-cua-toi";

export const Route = createFileRoute("/_authenticated/quan-tri")({
  head: () => ({
    meta: [
      { title: "Quản trị Góp Xanh" },
      { name: "description", content: "Xét duyệt hồ sơ chiến dịch theo Bộ lọc xanh, quản lý chiến dịch và theo dõi thống kê nền tảng." },
      { property: "og:title", content: "Quản trị Góp Xanh" },
      { property: "og:description", content: "Trang dành cho Ban quản trị Góp Xanh." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchSession = useServerFn(getMySession);
  const fetchPending = useServerFn(adminListPending);
  const fetchCampaigns = useServerFn(adminListCampaigns);
  const fetchStats = useServerFn(adminStats);
  const review = useServerFn(adminReviewCampaign);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["my-session"],
    queryFn: fetchSession,
  });
  const isAdmin = session?.isAdmin ?? false;

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
    enabled: isAdmin,
  });
  const { data: pending = [] } = useQuery({
    queryKey: ["admin-pending"],
    queryFn: fetchPending,
    enabled: isAdmin,
  });
  const { data: campaigns = [] } = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: fetchCampaigns,
    enabled: isAdmin,
  });

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && session && !session.isAdmin) {
      navigate({ to: "/ho-so-cua-toi" });
    }
  }, [session, sessionLoading, navigate]);

  async function act(campaignId: string, status: "dang_gay_quy" | "can_bo_sung" | "tu_choi" | "hoan_thanh") {
    setError(null);
    setActing(campaignId + status);
    try {
      await review({ data: { campaignId, status, note: notes[campaignId] || undefined } });
      queryClient.invalidateQueries({ queryKey: ["admin-pending"] });
      queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thực hiện được, vui lòng thử lại.");
    } finally {
      setActing(null);
    }
  }

  if (sessionLoading) {
    return <p className="max-w-5xl mx-auto px-6 py-12 text-ink/60">Đang kiểm tra quyền truy cập...</p>;
  }
  if (!isAdmin) {
    return <p className="max-w-5xl mx-auto px-6 py-12 text-ink/60">Đang chuyển hướng...</p>;
  }

  const statCards = [
    { value: String(stats?.totalCampaigns ?? 0), label: "chiến dịch" },
    { value: String(stats?.pendingCampaigns ?? 0), label: "hồ sơ chờ duyệt" },
    { value: formatShort(stats?.totalRaised ?? 0) + " đ", label: "đã huy động (thật)" },
    { value: String(stats?.totalVolunteers ?? 0), label: "cộng tác viên đăng ký" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <p className="text-xs uppercase tracking-[0.15em] text-clay font-bold">Vai trò: Ban quản trị / Bộ lọc xanh</p>
      <h1 className="font-display text-5xl text-moss mt-2">Quản trị nền tảng</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card rounded-3xl p-5 ring-1 ring-moss/10">
            <p className="font-display text-3xl text-moss">{s.value}</p>
            <p className="text-xs text-ink/55 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-3xl text-moss mt-12">Hồ sơ chờ xét duyệt ({pending.length})</h2>
      {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      {pending.length === 0 ? (
        <p className="text-sm text-ink/55 mt-4">Không có hồ sơ nào đang chờ.</p>
      ) : (
        <div className="mt-5 space-y-5">
          {pending.map((c) => (
            <article key={c.id} className="bg-card rounded-3xl p-6 ring-1 ring-moss/10">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl text-moss">{c.name}</h3>
                  <p className="text-xs text-ink/50 mt-1">
                    {c.ownerName} · {c.category} ·{" "}
                    {c.district} · Mục tiêu {formatShort(Number(c.goal))}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-clay/15 text-clay">
                  {STATUS_LABELS[c.status] ?? c.status}
                </span>
              </div>
              <p className="text-sm text-ink/70 mt-3 leading-relaxed">{c.summary}</p>
              <details className="mt-3">
                <summary className="text-sm font-bold text-pine cursor-pointer">Xem chi tiết hồ sơ</summary>
                <div className="text-sm text-ink/70 mt-3 space-y-3 leading-relaxed">
                  <p><span className="font-bold text-moss">Câu chuyện: </span>{c.story}</p>
                  <p><span className="font-bold text-moss">Phương thức: </span>{c.method}</p>
                  <p><span className="font-bold text-moss">Tác động: </span>{c.impact}</p>
                </div>
              </details>

              <div className="mt-4">
                <Label htmlFor={`note-${c.id}`} className="text-xs font-bold text-ink/70">
                  Ghi chú phản hồi cho nông hộ
                </Label>
                <Textarea
                  id={`note-${c.id}`}
                  rows={2}
                  value={notes[c.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [c.id]: e.target.value }))}
                  className="mt-2 rounded-xl"
                  placeholder="VD: Cần bổ sung kế hoạch sử dụng vốn theo hạng mục..."
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  size="sm"
                  disabled={acting !== null}
                  onClick={() => act(c.id, "dang_gay_quy")}
                  className="rounded-full font-bold"
                >
                  ✓ Duyệt & mở gây quỹ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={acting !== null}
                  onClick={() => act(c.id, "can_bo_sung")}
                  className="rounded-full font-bold"
                >
                  Yêu cầu bổ sung
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={acting !== null}
                  onClick={() => act(c.id, "tu_choi")}
                  className="rounded-full font-bold text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  Từ chối
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <h2 className="font-display text-3xl text-moss mt-12">Tất cả chiến dịch ({campaigns.length})</h2>
      {campaigns.length === 0 ? (
        <p className="text-sm text-ink/55 mt-4">Chưa có chiến dịch nào trên hệ thống.</p>
      ) : (
        <div className="mt-5 overflow-x-auto bg-card rounded-3xl ring-1 ring-moss/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/50 border-b border-moss/10">
                <th className="px-5 py-3">Chiến dịch</th>
                <th className="px-5 py-3">Khu vực</th>
                <th className="px-5 py-3">Mục tiêu</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-moss/5 last:border-0">
                  <td className="px-5 py-3 font-bold text-moss">{c.name}</td>
                  <td className="px-5 py-3 text-ink/65">{c.district}</td>
                  <td className="px-5 py-3 text-ink/65">{formatShort(Number(c.goal))}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-moss/10 text-moss whitespace-nowrap">
                      {STATUS_LABELS[c.status] ?? c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {c.status === "dang_gay_quy" && (
                      <button
                        type="button"
                        disabled={acting !== null}
                        onClick={() => act(c.id, "hoan_thanh")}
                        className="text-xs font-bold text-pine hover:underline whitespace-nowrap"
                      >
                        Đánh dấu hoàn thành
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
