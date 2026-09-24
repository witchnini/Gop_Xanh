import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addCampaignUpdate, getMyCampaigns, getMySession } from "@backend/campaigns.functions";
import { formatShort } from "@/lib/data";

export const STATUS_LABELS: Record<string, string> = {
  cho_duyet: "Chờ duyệt",
  can_bo_sung: "Cần bổ sung",
  dang_gay_quy: "Đang gây quỹ",
  hoan_thanh: "Đã hoàn thành",
  tu_choi: "Từ chối",
};

const STATUS_STYLES: Record<string, string> = {
  cho_duyet: "bg-clay/15 text-clay",
  can_bo_sung: "bg-destructive/10 text-destructive",
  dang_gay_quy: "bg-leaf/15 text-pine",
  hoan_thanh: "bg-moss/10 text-moss",
  tu_choi: "bg-ink/10 text-ink/60",
};

export const Route = createFileRoute("/_authenticated/ho-so-cua-toi")({
  beforeLoad: async () => {
    const session = await getMySession();
    if (!session.isPartner) throw redirect({ to: "/chien-dich" });
  },
  head: () => ({
    meta: [
      { title: "Hồ sơ của tôi — Góp Xanh" },
      {
        name: "description",
        content:
          "Theo dõi trạng thái xét duyệt hồ sơ chiến dịch và đăng cập nhật tiến độ cho chiến dịch đã được duyệt.",
      },
      { property: "og:title", content: "Hồ sơ chiến dịch của tôi — Góp Xanh" },
      {
        property: "og:description",
        content: "Theo dõi trạng thái hồ sơ và cập nhật tiến độ chiến dịch.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyCampaignsPage,
});

function MyCampaignsPage() {
  const queryClient = useQueryClient();
  const fetchMine = useServerFn(getMyCampaigns);
  const sendUpdate = useServerFn(addCampaignUpdate);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["my-campaigns"],
    queryFn: fetchMine,
  });

  const [updateFor, setUpdateFor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const approved = campaigns.filter(
    (c) => c.status === "dang_gay_quy" || c.status === "hoan_thanh",
  );

  async function onSubmitUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!updateFor) {
      setError("Vui lòng chọn chiến dịch.");
      return;
    }
    setSending(true);
    try {
      await sendUpdate({ data: { campaignId: updateFor, title, description } });
      setNotice("Đã đăng cập nhật tiến độ.");
      setTitle("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["my-campaigns"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không gửi được cập nhật, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-clay font-bold">
            Vai trò: Nông hộ / Hợp tác xã
          </p>
          <h1 className="font-display text-5xl text-moss mt-2">Hồ sơ của tôi</h1>
        </div>
        <Button asChild className="rounded-full font-bold">
          <Link to="/nop-ho-so">+ Nộp hồ sơ mới</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-ink/60 mt-10">Đang tải hồ sơ...</p>
      ) : campaigns.length === 0 ? (
        <div className="bg-card rounded-3xl p-8 ring-1 ring-moss/10 mt-10 text-center">
          <p className="text-ink/65 leading-relaxed">
            Bạn chưa nộp hồ sơ nào. Hãy đề xuất mô hình nông nghiệp xanh của mình để Ban quản trị
            xét duyệt.
          </p>
          <Button asChild className="rounded-full font-bold mt-5">
            <Link to="/nop-ho-so">Nộp hồ sơ chiến dịch</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {campaigns.map((c) => (
            <article key={c.id} className="bg-card rounded-3xl p-6 ring-1 ring-moss/10">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-moss">{c.name}</h2>
                  <p className="text-xs text-ink/50 mt-1">
                    {c.category} · {c.district} · Mục tiêu {formatShort(Number(c.goal))} · Nộp ngày{" "}
                    {new Date(c.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[c.status] ?? ""}`}
                >
                  {STATUS_LABELS[c.status] ?? c.status}
                </span>
              </div>
              {c.review_note && (
                <p className="text-sm text-ink/70 mt-3 bg-cream rounded-xl px-4 py-3">
                  <span className="font-bold text-moss">Phản hồi từ Ban quản trị: </span>
                  {c.review_note}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="bg-card rounded-3xl p-6 ring-1 ring-moss/10 mt-12">
        <h2 className="font-display text-3xl text-moss">Đăng cập nhật tiến độ</h2>
        <p className="text-sm text-ink/60 mt-2">
          Chỉ áp dụng cho chiến dịch đã được duyệt. Cập nhật sẽ hiển thị công khai trên trang chiến
          dịch.
        </p>
        {approved.length === 0 ? (
          <p className="text-sm text-ink/50 mt-4">Bạn chưa có chiến dịch nào đang gây quỹ.</p>
        ) : (
          <form onSubmit={onSubmitUpdate} className="mt-5">
            <Label className="text-sm font-bold text-ink/80">Chiến dịch *</Label>
            <Select value={updateFor} onValueChange={setUpdateFor}>
              <SelectTrigger className="mt-2 rounded-xl w-full">
                <SelectValue placeholder="Chọn chiến dịch" />
              </SelectTrigger>
              <SelectContent>
                {approved.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4">
              <Label htmlFor="utitle" className="text-sm font-bold text-ink/80">
                Tiêu đề cập nhật *
              </Label>
              <Input
                id="utitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 rounded-xl"
                required
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="udesc" className="text-sm font-bold text-ink/80">
                Nội dung *
              </Label>
              <Textarea
                id="udesc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 rounded-xl"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive mt-4">{error}</p>}
            {notice && <p className="text-sm text-pine mt-4">{notice}</p>}

            <Button type="submit" disabled={sending} className="rounded-full font-bold mt-5">
              {sending ? "Đang đăng..." : "Đăng cập nhật"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
