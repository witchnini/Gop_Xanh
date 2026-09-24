import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronDown, CircleAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { AdminEmptyState, AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminStatusBadge } from "@/components/admin/admin-ui";
import { formatAdminDate, formatAdminMoney } from "@/lib/admin-utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminListPending, adminReviewCampaign } from "@backend/campaigns.functions";

export const Route = createFileRoute("/admin/ho-so")({
  head: () => ({
    meta: [
      { title: "Duyệt hồ sơ · Góp Xanh Admin" },
      {
        name: "description",
        content: "Sàng lọc hồ sơ chiến dịch theo tính khả thi, minh bạch và tác động.",
      },
    ],
  }),
  component: AdminReviewPage,
});

type ReviewStatus = "dang_gay_quy" | "can_bo_sung" | "tu_choi";
type CriteriaState = Record<
  string,
  { feasibility: boolean; transparency: boolean; impact: boolean }
>;

const criteriaLabels = [
  {
    key: "feasibility" as const,
    title: "Tính khả thi",
    description: "Mô hình, kế hoạch triển khai và mục tiêu nguồn lực có cơ sở thực hiện.",
  },
  {
    key: "transparency" as const,
    title: "Mức độ minh bạch",
    description: "Nhu cầu, cách sử dụng nguồn lực và thông tin chủ thể được trình bày rõ.",
  },
  {
    key: "impact" as const,
    title: "Tác động xanh",
    description: "Có tác động tích cực dự kiến đối với môi trường hoặc cộng đồng.",
  },
];

function AdminReviewPage() {
  const fetchPending = useServerFn(adminListPending);
  const reviewCampaign = useServerFn(adminReviewCampaign);
  const queryClient = useQueryClient();
  const {
    data: pending = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["admin-pending"],
    queryFn: fetchPending,
  });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [criteria, setCriteria] = useState<CriteriaState>({});
  const [acting, setActing] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function campaignCriteria(campaignId: string) {
    return criteria[campaignId] ?? { feasibility: false, transparency: false, impact: false };
  }

  function setCriterion(
    campaignId: string,
    key: "feasibility" | "transparency" | "impact",
    checked: boolean,
  ) {
    setCriteria((current) => ({
      ...current,
      [campaignId]: { ...campaignCriteria(campaignId), [key]: checked },
    }));
  }

  async function act(campaignId: string, status: ReviewStatus) {
    setActionError(null);
    setActing(campaignId + status);
    try {
      await reviewCampaign({
        data: { campaignId, status, note: notes[campaignId]?.trim() || undefined },
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-pending"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] }),
      ]);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Không cập nhật được hồ sơ.");
    } finally {
      setActing(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Bộ lọc xanh"
        title="Duyệt hồ sơ"
        description="Đánh giá từng hồ sơ theo ba nhóm tiêu chí cốt lõi trước khi mở gây quỹ. Ghi chú được gửi lại cho Chủ dự án / Đối tác."
      />

      {(queryError || actionError) && (
        <p className="mt-5 border-l-4 border-destructive bg-white px-4 py-3 text-sm text-destructive">
          {actionError ||
            (queryError instanceof Error ? queryError.message : "Không tải được hồ sơ.")}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between border-b border-moss/10 pb-3">
        <p className="text-sm font-bold text-moss">
          {isLoading ? "Đang tải hồ sơ..." : pending.length + " hồ sơ cần xử lý"}
        </p>
        <p className="hidden text-xs text-ink/45 sm:block">Sắp xếp từ cũ đến mới</p>
      </div>

      {!isLoading && pending.length === 0 ? (
        <div className="mt-5">
          <AdminEmptyState
            icon={ShieldCheck}
            title="Hàng chờ đã được xử lý"
            description="Hồ sơ mới hoặc hồ sơ được yêu cầu bổ sung sẽ xuất hiện tại đây."
          />
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {pending.map((campaign) => {
            const campaignReview = campaignCriteria(campaign.id);
            const readyToApprove =
              campaignReview.feasibility && campaignReview.transparency && campaignReview.impact;
            return (
              <article key={campaign.id} className="border border-moss/10 bg-white">
                <div className="grid gap-5 border-b border-moss/10 p-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <AdminStatusBadge status={campaign.status} />
                      <span className="text-xs text-ink/45">
                        Gửi {formatAdminDate(campaign.created_at)}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-moss">
                      {campaign.name}
                    </h2>
                    <p className="mt-1 text-sm text-ink/55">
                      {campaign.ownerName} · {campaign.category} · {campaign.district}
                    </p>
                  </div>
                  <div className="lg:text-right">
                    <p className="text-xs font-bold uppercase text-ink/40">Mục tiêu nguồn lực</p>
                    <p className="mt-1 text-lg font-extrabold text-moss">
                      {formatAdminMoney(Number(campaign.goal))}
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1.2fr_0.9fr]">
                  <div className="border-b border-moss/10 p-5 lg:border-b-0 lg:border-r">
                    <p className="text-sm leading-6 text-ink/70">{campaign.summary}</p>
                    <details className="group mt-4 border-t border-moss/10 pt-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-moss">
                        Chi tiết hồ sơ{" "}
                        <ChevronDown className="size-4 transition group-open:rotate-180" />
                      </summary>
                      <div className="mt-4 space-y-4 text-sm leading-6 text-ink/65">
                        <div>
                          <p className="font-bold text-ink">Câu chuyện và nhu cầu</p>
                          <p className="mt-1">{campaign.story}</p>
                        </div>
                        <div>
                          <p className="font-bold text-ink">Phương thức sản xuất xanh</p>
                          <p className="mt-1">{campaign.method}</p>
                        </div>
                        <div>
                          <p className="font-bold text-ink">Tác động kỳ vọng</p>
                          <p className="mt-1">{campaign.impact}</p>
                        </div>
                      </div>
                    </details>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-5 text-leaf" />
                      <h3 className="text-sm font-extrabold text-moss">Checklist Green Filter</h3>
                    </div>
                    <div className="mt-4 divide-y divide-moss/10 border-y border-moss/10">
                      {criteriaLabels.map((criterion) => (
                        <label
                          key={criterion.key}
                          className="flex cursor-pointer items-start gap-3 py-3"
                        >
                          <input
                            type="checkbox"
                            checked={campaignReview[criterion.key]}
                            onChange={(event) =>
                              setCriterion(campaign.id, criterion.key, event.target.checked)
                            }
                            className="mt-1 size-4 accent-[#0d530e]"
                          />
                          <span>
                            <span className="block text-sm font-bold text-ink">
                              {criterion.title}
                            </span>
                            <span className="mt-0.5 block text-xs leading-5 text-ink/50">
                              {criterion.description}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Label
                        htmlFor={"note-" + campaign.id}
                        className="text-xs font-bold text-ink/65"
                      >
                        Ghi chú phản hồi
                      </Label>
                      <Textarea
                        id={"note-" + campaign.id}
                        rows={3}
                        value={notes[campaign.id] ?? ""}
                        onChange={(event) =>
                          setNotes((current) => ({ ...current, [campaign.id]: event.target.value }))
                        }
                        className="mt-2"
                        placeholder="Nội dung cần bổ sung hoặc lý do ra quyết định..."
                      />
                    </div>
                  </div>
                </div>

                {!readyToApprove && (
                  <div className="flex items-start gap-2 border-t border-moss/10 bg-[#fffaf0] px-5 py-3 text-xs text-[#8a4f0e]">
                    <CircleAlert className="mt-0.5 size-4 shrink-0" />
                    Đánh dấu đủ ba tiêu chí trước khi duyệt mở gây quỹ.
                  </div>
                )}

                <div className="flex flex-wrap gap-2 border-t border-moss/10 px-5 py-4">
                  <Button
                    size="sm"
                    disabled={acting !== null || !readyToApprove}
                    onClick={() => act(campaign.id, "dang_gay_quy")}
                    className="font-bold"
                  >
                    <Check className="size-4" />
                    Duyệt & mở gây quỹ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={acting !== null}
                    onClick={() => act(campaign.id, "can_bo_sung")}
                    className="font-bold"
                  >
                    Yêu cầu bổ sung
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={acting !== null}
                    onClick={() => act(campaign.id, "tu_choi")}
                    className="border-destructive/30 font-bold text-destructive hover:bg-destructive/5"
                  >
                    Từ chối
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
