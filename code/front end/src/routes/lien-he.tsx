import { createFileRoute } from "@tanstack/react-router";
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
import { submitContact } from "@backend/gopxanh.functions";

export const Route = createFileRoute("/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ & Đăng ký hợp tác — Góp Xanh" },
      {
        name: "description",
        content:
          "Liên hệ nhóm dự án Góp Xanh: nhà tài trợ, đối tác dịch vụ và nông hộ muốn mở chiến dịch gây quỹ.",
      },
      { property: "og:title", content: "Liên hệ & Đăng ký hợp tác — Góp Xanh" },
      {
        property: "og:description",
        content: "Gửi yêu cầu hợp tác tới nhóm dự án Shark Xanh — Học viện Ngân hàng.",
      },
    ],
  }),
  component: ContactPage,
});

const topics = [
  "Nhà tài trợ / doanh nghiệp",
  "Nông hộ muốn mở chiến dịch",
  "Đối tác dịch vụ",
  "Báo chí, truyền thông",
  "Nội dung khác",
];

function ContactPage() {
  const send = useServerFn(submitContact);
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!topic) {
      setError("Vui lòng chọn nội dung liên hệ.");
      return;
    }
    setSending(true);
    try {
      await send({ data: { fullName, organization, email, topic, content } });
      setDone(true);
    } catch {
      setError("Thông tin chưa hợp lệ, vui lòng kiểm tra lại các trường bắt buộc.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-5xl text-moss">Liên hệ & đăng ký hợp tác</h1>
      <p className="text-ink/65 mt-3 max-w-2xl leading-relaxed">
        Nhóm dự án Shark Xanh luôn sẵn sàng trao đổi với nhà tài trợ, đối tác dịch vụ và các nông hộ muốn
        mở chiến dịch trên nền tảng.
      </p>

      <div className="grid lg:grid-cols-12 gap-8 mt-10">
        <div className="lg:col-span-7">
          {done ? (
            <div className="bg-card rounded-3xl p-8 ring-1 ring-moss/10">
              <h2 className="font-display text-3xl text-moss">Cảm ơn bạn đã liên hệ!</h2>
              <p className="text-ink/70 mt-3 leading-relaxed">
                Chúng tôi đã nhận được yêu cầu và sẽ phản hồi qua email trong vòng 3 ngày làm việc.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-card rounded-3xl p-6 ring-1 ring-moss/10">
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
                  <Label htmlFor="org" className="text-sm font-bold text-ink/80">
                    Tổ chức
                  </Label>
                  <Input
                    id="org"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="mt-2 rounded-xl"
                  />
                </div>
              </div>

              <div className="mt-4">
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

              <div className="mt-4">
                <Label className="text-sm font-bold text-ink/80">Nội dung liên hệ *</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger className="mt-2 rounded-xl w-full">
                    <SelectValue placeholder="Chọn nội dung" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <Label htmlFor="content" className="text-sm font-bold text-ink/80">
                  Lời nhắn *
                </Label>
                <Textarea
                  id="content"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                {sending ? "Đang gửi..." : "Gửi liên hệ"}
              </Button>
            </form>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-moss text-cream rounded-3xl p-8">
            <h2 className="font-display text-3xl">Nhóm dự án Shark Xanh</h2>
            <ul className="mt-5 space-y-3 text-sm text-cream/80">
              <li>Email: hello@gopxanh.vn</li>
              <li>Điện thoại: (024) 3200 0000</li>
              <li>Địa chỉ: Học viện Ngân hàng, Q. Đống Đa, Hà Nội</li>
              <li>Fanpage: facebook.com/gopxanh.vn</li>
            </ul>
            <p className="text-sm text-cream/60 mt-6 leading-relaxed">
              Đây là bản demo phục vụ cuộc thi Sinh viên thế hệ mới 2026. Dữ liệu chiến dịch và
              thanh toán đều là mô phỏng.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
