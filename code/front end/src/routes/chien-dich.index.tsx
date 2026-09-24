import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import { CampaignCard } from "@/components/campaign-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listApprovedCampaigns } from "@backend/campaigns.functions";
import { campaigns, categories, mapDbCampaign, progressOf } from "@/lib/data";

export const Route = createFileRoute("/chien-dich/")({
  head: () => ({
    meta: [
      { title: "Danh sách chiến dịch xanh — Góp Xanh" },
      {
        name: "description",
        content:
          "Khám phá các chiến dịch nông nghiệp xanh đã qua bộ lọc xanh: rau hữu cơ, chăn nuôi sinh thái, lúa nước quanh Hà Nội.",
      },
      { property: "og:title", content: "Danh sách chiến dịch xanh — Góp Xanh" },
      {
        property: "og:description",
        content: "Chọn chiến dịch nông nghiệp xanh phù hợp và góp từ 50.000đ.",
      },
    ],
  }),
  component: CampaignList,
});

function CampaignList() {
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort] = useState("progress");
  const fetchApproved = useServerFn(listApprovedCampaigns);

  const { data: dbCampaigns = [] } = useQuery({
    queryKey: ["approved-campaigns"],
    queryFn: fetchApproved,
  });

  const all = useMemo(() => {
    const mockSlugs = new Set(campaigns.map((c) => c.slug));
    const real = dbCampaigns.filter((r) => !mockSlugs.has(r.slug)).map(mapDbCampaign);
    return [...campaigns, ...real];
  }, [dbCampaigns]);

  const list = useMemo(() => {
    const filtered = all.filter((c) => category === "Tất cả" || c.category === category);
    return [...filtered].sort((a, b) =>
      sort === "progress" ? progressOf(b) - progressOf(a) : a.daysLeft - b.daysLeft,
    );
  }, [all, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-5xl text-moss">Danh sách chiến dịch</h1>
      <p className="text-ink/60 mt-2 max-w-2xl">
        Toàn bộ chiến dịch dưới đây đã đi qua bộ lọc xanh — chọn theo loại hình sản xuất hoặc mức độ
        hoàn thành.
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-8">
        <span className="text-xs font-bold uppercase tracking-wider text-ink/40">Bộ lọc:</span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={
              c === category
                ? "text-sm font-semibold bg-moss text-cream px-4 py-2 rounded-full"
                : "text-sm font-semibold border border-moss/20 px-4 py-2 rounded-full hover:bg-moss/5 transition"
            }
          >
            {c}
          </button>
        ))}
        <div className="ml-auto">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="rounded-full w-56 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">Mức độ hoàn thành cao nhất</SelectItem>
              <SelectItem value="days">Sắp hết hạn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {list.map((c) => (
          <CampaignCard key={c.slug} campaign={c} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-ink/60 mt-10">Chưa có chiến dịch nào thuộc nhóm này.</p>
      )}
    </div>
  );
}
