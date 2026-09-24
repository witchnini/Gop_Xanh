import { Link } from "@tanstack/react-router";

import { formatShort, progressOf, type Campaign } from "@/lib/data";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const percent = progressOf(campaign);

  return (
    <article className="group bg-card rounded-3xl overflow-hidden ring-1 ring-moss/10 hover:-translate-y-1 transition">
      <Link
        to="/chien-dich/$slug"
        params={{ slug: campaign.slug }}
        className="block w-full aspect-[16/10] overflow-hidden"
      >
        <img
          src={campaign.image}
          alt={`Hình ảnh chiến dịch ${campaign.name}`}
          loading="lazy"
          width={1024}
          height={640}
          className="size-full object-cover"
        />
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="bg-leaf/15 text-pine px-3 py-1 rounded-full">{campaign.category}</span>
          <span className="text-ink/40">{campaign.district}</span>
        </div>
        <h3 className="font-display text-xl text-moss mt-3">
          <Link to="/chien-dich/$slug" params={{ slug: campaign.slug }}>
            {campaign.name}
          </Link>
        </h3>
        <p className="text-sm text-ink/60 mt-2 leading-relaxed">{campaign.summary}</p>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold text-moss">{formatShort(campaign.raised)} đ</span>
            <span className="text-ink/45">mục tiêu {formatShort(campaign.goal)}</span>
          </div>
          <div className="h-2 rounded-full bg-moss/10 overflow-hidden">
            <div className="h-full bg-leaf rounded-full" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <span className="text-xs text-ink/50">{campaign.supporters} người đã góp</span>
          <Link
            to="/dong-gop/$slug"
            params={{ slug: campaign.slug }}
            className="text-sm font-bold text-clay hover:underline"
          >
            Góp ngay →
          </Link>
        </div>
      </div>
    </article>
  );
}
