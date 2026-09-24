import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { HandCoins, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminEmptyState, AdminPageHeader } from "@/components/admin/admin-shell";
import { formatAdminDate, formatAdminMoney } from "@/lib/admin-utils";
import { Input } from "@/components/ui/input";
import { adminListDonations } from "@backend/campaigns.functions";
import { campaigns } from "@/lib/data";

function slugToName(slug: string) {
  return campaigns.find((c) => c.slug === slug)?.name ?? slug;
}

export const Route = createFileRoute("/admin/dong-gop")({
  head: () => ({
    meta: [
      { title: "Đóng góp · Góp Xanh Admin" },
      {
        name: "description",
        content: "Theo dõi các khoản đóng góp tài chính mô phỏng trên Góp Xanh.",
      },
    ],
  }),
  component: AdminDonationsPage,
});

function AdminDonationsPage() {
  const fetchDonations = useServerFn(adminListDonations);
  const {
    data: donations = [],
    isLoading,
    error,
  } = useQuery({ queryKey: ["admin-donations"], queryFn: fetchDonations });
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    if (!normalized) return donations;
    return donations.filter((item) =>
      [item.full_name, item.email, item.campaign_slug]
        .join(" ")
        .toLocaleLowerCase("vi")
        .includes(normalized),
    );
  }, [donations, query]);
  const total = donations.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Nguồn lực tài chính"
        title="Đóng góp"
        description="Theo dõi các khoản đóng góp tài chính trong bản MVP. Đây là dữ liệu mô phỏng, chưa phải giao dịch thanh toán hoặc giải ngân."
      />
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Tổng giá trị demo", formatAdminMoney(total)],
          ["Lượt đóng góp", donations.length],
          ["Đóng góp ẩn danh", donations.filter((item) => item.anonymous).length],
        ].map(([label, value]) => (
          <div key={String(label)} className="border border-moss/10 bg-white p-4">
            <p className="text-xs font-bold uppercase text-ink/40">{label}</p>
            <p className="mt-2 text-xl font-extrabold text-moss">{value}</p>
          </div>
        ))}
      </section>
      <div className="relative mt-5 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-ink/35" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm người góp, email hoặc chiến dịch..."
          className="bg-white pl-9"
        />
      </div>
      {error && (
        <p className="mt-4 border-l-4 border-destructive bg-white px-4 py-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Không tải được dữ liệu đóng góp."}
        </p>
      )}
      {!isLoading && filtered.length === 0 ? (
        <div className="mt-5">
          <AdminEmptyState
            icon={HandCoins}
            title="Chưa có đóng góp phù hợp"
            description="Bản ghi đóng góp mô phỏng sẽ xuất hiện tại đây."
          />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto border border-moss/10 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-moss/10 bg-[#f8faf6] text-xs uppercase text-ink/45">
              <tr>
                <th className="px-4 py-3">Người đóng góp</th>
                <th className="px-4 py-3">Chiến dịch</th>
                <th className="px-4 py-3">Số tiền</th>
                <th className="px-4 py-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-moss/5 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-bold text-ink">
                      {item.anonymous ? "Người đóng góp ẩn danh" : item.full_name}
                    </p>
                    <p className="mt-1 text-xs text-ink/45">{item.email}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-moss">{slugToName(item.campaign_slug)}</td>
                  <td className="px-4 py-3 font-extrabold text-moss">
                    {formatAdminMoney(Number(item.amount))}
                  </td>
                  <td className="px-4 py-3 text-ink/55">{formatAdminDate(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
