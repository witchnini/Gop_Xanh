import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPublicCampaign } from "@backend/campaigns.functions";
import { formatVnd, getCampaign, mapDbCampaign, progressOf } from "@/lib/data";
import { submitDonation } from "@backend/gopxanh.functions";

const searchSchema = z.object({ amount: z.coerce.number().optional() });

export const Route = createFileRoute("/dong-gop/$slug")({
  validateSearch: searchSchema,
  loader: async ({ params }) => {
    const mock = getCampaign(params.slug);
    if (mock) return { campaign: mock };
    const db = await getPublicCampaign({ data: { slug: params.slug } });
    if (!db) throw notFound();
    return { campaign: mapDbCampaign(db) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Không tìm thấy chiến dịch — Góp Xanh" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `Đóng góp cho ${loaderData.campaign.name} — Góp Xanh` },
        {
          name: "description",
          content: `Đóng góp từ 50.000đ cho chiến dịch ${loaderData.campaign.name} của ${loaderData.campaign.owner}.`,
        },
        { property: "og:title", content: `Đóng góp cho ${loaderData.campaign.name}` },
        {
          property: "og:description",
          content: "Mỗi khoản đóng góp nhỏ đều có hướng đi minh bạch tới nông hộ.",
        },
      ],
    };
  },
  component: DonatePage,
});

const quickAmounts = [50000, 100000, 200000, 500000];

function DonatePage() {
  const { campaign } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const donate = useServerFn(submitDonation);

  const [amount, setAmount] = useState<number>(search.amount ?? 100000);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ code: string; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await donate({
        data: { campaignSlug: campaign.slug, amount, fullName, email, phone, message, anonymous },
      });
      setResult({ code: res.code, message: res.message });
    } catch (err) {
      setError(
        err instanceof Error
          ? "Thông tin chưa hợp lệ, vui lòng kiểm tra lại các trường bắt buộc."
          : "Có lỗi xảy ra, vui lòng thử lại.",
      );
    } finally {
      setSending(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-clay bg-clay/10 px-3 py-1.5 rounded-full">
          Xác nhận mô phỏng
        </span>
        <h1 className="font-display text-4xl text-moss mt-6">Cảm ơn bạn đã góp một mầm xanh!</h1>
        <p className="text-ink/70 mt-4 leading-relaxed">
          Khoản đóng góp {formatVnd(amount)} cho chiến dịch <strong>{campaign.name}</strong> đã được
          ghi nhận với mã <strong>{result.code}</strong>. {result.message}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Button asChild className="rounded-full font-bold px-6">
            <Link to="/chien-dich">Khám phá chiến dịch khác</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full font-bold px-6 border-moss/30 text-moss hover:bg-moss/5"
          >
            <Link to="/chien-dich/$slug" params={{ slug: campaign.slug }}>
              Quay lại chiến dịch
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate({ to: "/chien-dich/$slug", params: { slug: campaign.slug } })}
        className="text-sm font-semibold text-ink/50 hover:text-moss"
      >
        ← Quay lại chiến dịch
      </button>

      <div className="grid lg:grid-cols-12 gap-10 mt-6">
        <div className="lg:col-span-7">
          <h1 className="font-display text-4xl text-moss">Đóng góp cho {campaign.name}</h1>
          <p className="text-ink/60 mt-2">
            Bản demo mô phỏng thanh toán — không tích hợp cổng thanh toán thật.
          </p>

          <form onSubmit={onSubmit} className="mt-8 bg-card rounded-3xl p-6 ring-1 ring-moss/10">
            <Label className="text-sm font-bold text-ink/80">Chọn mức đóng góp</Label>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {quickAmounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmount(a)}
                  className={
                    a === amount
                      ? "text-sm font-bold py-2.5 rounded-xl bg-moss text-cream"
                      : "text-sm font-bold py-2.5 rounded-xl border border-moss/20 hover:bg-moss/5 transition"
                  }
                >
                  {Math.round(a / 1000)}k
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Label htmlFor="amount" className="text-sm font-bold text-ink/80">
                Hoặc nhập số tiền khác (đ)
              </Label>
              <Input
                id="amount"
                type="number"
                min={10000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-2 rounded-xl"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-bold text-ink/80">
                  Họ và tên *
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 rounded-xl"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-bold text-ink/80">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="phone" className="text-sm font-bold text-ink/80">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 rounded-xl"
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="message" className="text-sm font-bold text-ink/80">
                Lời nhắn gửi nông hộ
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 rounded-xl"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Checkbox
                id="anonymous"
                checked={anonymous}
                onCheckedChange={(v) => setAnonymous(v === true)}
              />
              <Label htmlFor="anonymous" className="text-sm text-ink/70">
                Ẩn danh trên trang chiến dịch
              </Label>
            </div>

            {error && <p className="text-sm text-destructive mt-4">{error}</p>}

            <Button
              type="submit"
              size="lg"
              disabled={sending}
              className="w-full rounded-full font-bold mt-6"
            >
              {sending ? "Đang gửi..." : `Đóng góp ${formatVnd(amount || 0)}`}
            </Button>
          </form>
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-card rounded-3xl p-6 ring-1 ring-moss/10 shadow-widget">
            <img
              src={campaign.image}
              alt={`Hình ảnh chiến dịch ${campaign.name}`}
              loading="lazy"
              width={1024}
              height={640}
              className="w-full aspect-[16/10] object-cover rounded-2xl"
            />
            <h2 className="font-display text-2xl text-moss mt-5">{campaign.name}</h2>
            <p className="text-sm text-ink/60 mt-1">{campaign.owner}</p>
            <div className="h-3 rounded-full bg-moss/10 mt-4 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-leaf to-moss"
                style={{ width: `${progressOf(campaign)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-ink/55 mt-3">
              <span>{formatVnd(campaign.raised)}</span>
              <span>mục tiêu {formatVnd(campaign.goal)}</span>
            </div>

            <div className="mt-6 space-y-3">
              {campaign.tiers.map((t) => (
                <button
                  key={t.amount}
                  type="button"
                  onClick={() => setAmount(t.amount)}
                  className="w-full text-left rounded-2xl border border-moss/15 p-4 hover:border-moss/40 hover:bg-moss/5 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg text-moss">{t.title}</span>
                    <span className="text-sm font-bold text-clay">{formatVnd(t.amount)}</span>
                  </div>
                  <p className="text-sm text-ink/60 mt-1 leading-relaxed">{t.reward}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
