import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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
import { getMySession, submitCampaign } from "@backend/campaigns.functions";

const CATEGORIES = ["Rau hữu cơ", "Chăn nuôi sinh thái", "Lúa nước", "Trồng trọt khác", "Khác"];

export const Route = createFileRoute("/_authenticated/nop-ho-so")({
  beforeLoad: async () => {
    const session = await getMySession();
    if (!session.isPartner) throw redirect({ to: "/chien-dich" });
  },
  head: () => ({
    meta: [
      { title: "Nộp hồ sơ chiến dịch — Góp Xanh" },
      {
        name: "description",
        content:
          "Chủ dự án / Đối tác nộp hồ sơ chiến dịch gây quỹ để Quản trị viên Góp Xanh xét duyệt theo Bộ lọc xanh.",
      },
      { property: "og:title", content: "Nộp hồ sơ chiến dịch Góp Xanh" },
      {
        property: "og:description",
        content: "Đề xuất mô hình sinh kế nông nghiệp xanh của bạn lên nền tảng Góp Xanh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubmitCampaignPage,
});

function SubmitCampaignPage() {
  const navigate = useNavigate();
  const send = useServerFn(submitCampaign);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");
  const [method, setMethod] = useState("");
  const [impact, setImpact] = useState("");
  const [goalText, setGoalText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const goal = Number(goalText.replace(/[.,\s]/g, ""));
    if (!Number.isFinite(goal)) {
      setError("Mục tiêu gây quỹ chưa hợp lệ.");
      return;
    }
    setSending(true);
    try {
      await send({ data: { name, category, district, summary, story, method, impact, goal } });
      navigate({ to: "/ho-so-cua-toi" });
    } catch (err) {
      let msg = err instanceof Error ? err.message : "Thông tin chưa hợp lệ, vui lòng kiểm tra lại.";
      try {
        const parsed = JSON.parse(msg);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].message) {
          msg = parsed.map((issue: any) => "• " + issue.message).join("\n");
        }
      } catch (e) {
        // Not JSON, keep original message
      }
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-xs uppercase tracking-[0.15em] text-clay font-bold">
        Vai trò: Chủ dự án / Đối tác
      </p>
      <h1 className="font-display text-5xl text-moss mt-2">Nộp hồ sơ chiến dịch</h1>
      <p className="text-ink/65 mt-3 leading-relaxed">
        Hồ sơ của bạn sẽ được Ban quản trị xét duyệt theo Bộ lọc xanh: tính khả thi, mức độ minh
        bạch và tác động xanh. Hãy mô tả càng cụ thể càng tốt.
      </p>

      <form onSubmit={onSubmit} className="bg-card rounded-3xl p-6 ring-1 ring-moss/10 mt-8">
        <div>
          <Label htmlFor="name" className="text-sm font-bold text-ink/80">
            Tên chiến dịch *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 rounded-xl"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <Label className="text-sm font-bold text-ink/80">Nhóm mô hình *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-2 rounded-xl w-full">
                <SelectValue placeholder="Chọn nhóm" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="district" className="text-sm font-bold text-ink/80">
              Quận / huyện *
            </Label>
            <Input
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-2 rounded-xl"
              placeholder="VD: Ba Vì"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="goal" className="text-sm font-bold text-ink/80">
            Mục tiêu gây quỹ (đồng) *
          </Label>
          <Input
            id="goal"
            inputMode="numeric"
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            className="mt-2 rounded-xl"
            placeholder="VD: 250000000"
            required
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="summary" className="text-sm font-bold text-ink/80">
            Tóm tắt ngắn *
          </Label>
          <Textarea
            id="summary"
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="mt-2 rounded-xl"
            required
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="story" className="text-sm font-bold text-ink/80">
            Câu chuyện & khó khăn hiện tại *
          </Label>
          <Textarea
            id="story"
            rows={5}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="mt-2 rounded-xl"
            required
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="method" className="text-sm font-bold text-ink/80">
            Phương thức canh tác xanh *
          </Label>
          <Textarea
            id="method"
            rows={3}
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-2 rounded-xl"
            required
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="impact" className="text-sm font-bold text-ink/80">
            Tác động kỳ vọng *
          </Label>
          <Textarea
            id="impact"
            rows={3}
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            className="mt-2 rounded-xl"
            placeholder="VD: 3 ha đất phục hồi, giảm 2 tấn phân hóa học mỗi năm..."
            required
          />
        </div>

        {error && <p className="text-sm text-destructive mt-4 whitespace-pre-line">{error}</p>}

        <Button
          type="submit"
          size="lg"
          disabled={sending || !category}
          className="w-full rounded-full font-bold mt-6"
        >
          {sending ? "Đang gửi hồ sơ..." : "Gửi hồ sơ xét duyệt"}
        </Button>
      </form>
    </div>
  );
}
