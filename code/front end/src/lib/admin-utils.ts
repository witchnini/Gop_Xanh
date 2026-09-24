export const ADMIN_STATUS_LABELS: Record<string, string> = {
  cho_duyet: "Chờ duyệt",
  can_bo_sung: "Cần bổ sung",
  dang_gay_quy: "Đang gây quỹ",
  hoan_thanh: "Hoàn thành",
  tu_choi: "Từ chối",
};

export const ADMIN_STATUS_STYLES: Record<string, string> = {
  cho_duyet: "bg-[#fff0d1] text-[#8a4f0e]",
  can_bo_sung: "bg-[#fff0d1] text-[#8a4f0e]",
  dang_gay_quy: "bg-[#e5f1e2] text-[#0d530e]",
  hoan_thanh: "bg-moss text-white",
  tu_choi: "bg-[#f5e7e7] text-destructive",
};

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatAdminMoney(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}
