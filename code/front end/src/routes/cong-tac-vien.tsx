import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";

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
import { campaigns } from "@/lib/data";
import { submitVolunteer } from "@backend/gopxanh.functions";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ campaign: z.string().optional() });

export const Route = createFileRoute("/cong-tac-vien")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Trở thành cộng tác viên — Góp Xanh" },
      {
        name: "description",
        content:
          "Góp chuyên môn, thời gian và kết nối cho nông hộ xanh: mentor, truyền thông, thiết kế, công nghệ, logistics.",
      },
      { property: "og:title", content: "Trở thành cộng tác viên Góp Xanh" },
      {
        property: "og:description",
        content: "Đăng ký hỗ trợ nông hộ bằng chuyên môn của bạn, không cần đóng góp tài chính.",
      },
    ],
  }),
  component: VolunteerPage,
});

function VolunteerPage() {
  const search = Route.useSearch();
  const send = useServerFn(submitVolunteer);

  const [campaignSlug, setCampaignSlug] = useState(search.campaign ?? campaigns[0]!.slug);
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const selected = campaigns.find((c) => c.slug === campaignSlug) ?? campaigns[0]!;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!role) {
      setError("Vui lòng chọn vai trò bạn muốn hỗ trợ.");
      return;
    }
    setSending(true);
    try {
      // Lấy userId nếu đang đăng nhập để liên kết đơn với tài khoản
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      await send({ data: { fullName, email, phone, campaignSlug, role, experience, userId } });
      setDone(true);
    } catch {
      setError("Thông tin chưa hợp lệ, vui lòng kiểm tra lại các trường bắt buộc.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-5xl text-moss">Trở thành cộng tác viên</h1>
      <p className="text-ink/65 mt-3 max-w-2xl leading-relaxed">
        Bạn không nhất thiết phải góp tiền. Một buổi mentor tài chính, một bộ ảnh chụp vụ mùa hay
        một mối quan hệ với cửa hàng nội thành cũng là nguồn lực quý cho nông hộ.
      </p>

      {done ? (
        <div className="bg-card rounded-3xl p-8 ring-1 ring-moss/10 mt-10">
          <h2 className="font-display text-3xl text-moss">Đã nhận đăng ký của bạn!</h2>
          <p className="text-ink/70 mt-3 leading-relaxed">
            Ban điều hành Góp Xanh sẽ liên hệ qua email trong vòng 3 ngày làm việc để kết nối bạn
            với chiến dịch {selected.name}.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 mt-10">
          <form
            onSubmit={onSubmit}
            className="lg:col-span-7 bg-card rounded-3xl p-6 ring-1 ring-moss/10"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-bold text-ink/80">
                  Họ và tên *
                </Label>
                <Input
                  id="name"
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
                Số điện thoại *
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 rounded-xl"
                required
              />
            </div>

            <div className="mt-4">
              <Label className="text-sm font-bold text-ink/80">Chiến dịch muốn hỗ trợ *</Label>
              <Select
                value={campaignSlug}
                onValueChange={(v) => {
                  setCampaignSlug(v);
                  setRole("");
                }}
              >
                <SelectTrigger className="mt-2 rounded-xl w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label className="text-sm font-bold text-ink/80">Vai trò mong muốn *</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-2 rounded-xl w-full">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {selected.roles.map((r) => (
                    <SelectItem key={r.title} value={r.title}>
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label htmlFor="exp" className="text-sm font-bold text-ink/80">
                Kinh nghiệm / kỹ năng của bạn *
              </Label>
              <Textarea
                id="exp"
                rows={4}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="mt-2 rounded-xl"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive mt-4">{error}</p>}

            <Button
              type="submit"
              size="lg"
              disabled={sending}
              className="w-full rounded-full font-bold mt-6"
            >
              {sending ? "Đang gửi..." : "Gửi đăng ký"}
            </Button>
          </form>

          <aside className="lg:col-span-5">
            <div className="bg-card rounded-3xl p-6 ring-1 ring-moss/10">
              <p className="text-xs uppercase tracking-[0.15em] text-clay font-bold">
                Vai trò đang cần cho {selected.name}
              </p>
              <ul className="mt-4 space-y-4">
                {selected.roles.map((r) => (
                  <li key={r.title}>
                    <p className="font-display text-lg text-moss">{r.title}</p>
                    <p className="text-sm text-ink/60 leading-relaxed">{r.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
