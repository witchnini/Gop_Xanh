import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — Góp Xanh" },
      {
        name: "description",
        content:
          "Đăng nhập hoặc tạo tài khoản Góp Xanh để nộp hồ sơ chiến dịch và quản trị nền tảng.",
      },
      { property: "og:title", content: "Đăng nhập Góp Xanh" },
      {
        property: "og:description",
        content: "Tài khoản cho người đóng góp, chủ dự án / đối tác và quản trị viên Góp Xanh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [accountRole, setAccountRole] = useState("contributor");
  const [entityType, setEntityType] = useState("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              organization: accountRole === "partner" ? organization : null,
              account_role: accountRole,
              entity_type: accountRole === "partner" ? entityType : null,
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setNotice(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/chien-dich" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function signInGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError("Đăng nhập Google không thành công, vui lòng thử lại.");
  }

  return (
    <div className="max-w-md mx-auto px-6 py-14">
      <h1 className="font-display text-4xl text-moss text-center">
        {mode === "signin" ? "Đăng nhập" : "Tạo tài khoản"}
      </h1>
      <p className="text-sm text-ink/60 text-center mt-3 leading-relaxed">
        Cộng đồng đóng góp, chủ dự án và đối tác Góp Xanh.
      </p>

      <div className="flex bg-moss/10 rounded-full p-1 mt-8">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setNotice(null);
            }}
            className={`flex-1 rounded-full py-2 text-sm font-bold transition ${
              mode === m ? "bg-moss text-cream" : "text-moss"
            }`}
          >
            {m === "signin" ? "Đăng nhập" : "Đăng ký"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="bg-card rounded-3xl p-6 ring-1 ring-moss/10 mt-6">
        {mode === "signup" && (
          <>
            <div className="mb-4">
              <Label htmlFor="account-role">Vai trò</Label>
              <select
                id="account-role"
                value={accountRole}
                onChange={(e) => setAccountRole(e.target.value)}
                className="mt-2 w-full border border-input bg-background p-2 rounded-md"
              >
                <option value="contributor">Người đóng góp</option>
                <option value="partner">Chủ dự án / Đối tác</option>
              </select>
            </div>
            {accountRole === "partner" && (
              <div className="mb-4">
                <Label htmlFor="entity-type">Loại chủ thể</Label>
                <select
                  id="entity-type"
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="mt-2 w-full border border-input bg-background p-2 rounded-md"
                >
                  <option value="farmer">Nông hộ</option>
                  <option value="cooperative">Hợp tác xã</option>
                  <option value="enterprise">Doanh nghiệp CSR/ESG</option>
                </select>
              </div>
            )}
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
            {accountRole === "partner" && (
              <div className="mt-4">
                <Label htmlFor="org" className="text-sm font-bold text-ink/80">
                  Tên nông hộ / hợp tác xã / doanh nghiệp
                </Label>
                <Input
                  id="org"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="mt-2 rounded-xl"
                  placeholder="VD: HTX Rau An Toàn Thanh Trì"
                />
              </div>
            )}
          </>
        )}
        <div className={mode === "signup" ? "mt-4" : ""}>
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
          <Label htmlFor="password" className="text-sm font-bold text-ink/80">
            Mật khẩu *
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 rounded-xl"
            minLength={6}
            required
          />
        </div>

        {error && <p className="text-sm text-destructive mt-4">{error}</p>}
        {notice && <p className="text-sm text-pine mt-4">{notice}</p>}

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full rounded-full font-bold mt-6"
        >
          {loading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Đăng ký"}
        </Button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-moss/15" />
          <span className="text-xs text-ink/45">hoặc</span>
          <div className="h-px flex-1 bg-moss/15" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={signInGoogle}
          className="w-full rounded-full font-bold"
        >
          Tiếp tục với Google
        </Button>
      </form>

      <p className="text-xs text-ink/50 text-center mt-5 leading-relaxed">
        Tài khoản Google mới có vai trò Người đóng góp. Quyền Quản trị viên do đội ngũ Góp Xanh cấp.
      </p>
    </div>
  );
}
