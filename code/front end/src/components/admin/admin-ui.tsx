import { ADMIN_STATUS_LABELS, ADMIN_STATUS_STYLES } from "@/lib/admin-utils";

export function AdminStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold " +
        (ADMIN_STATUS_STYLES[status] ?? "bg-muted text-muted-foreground")
      }
    >
      {ADMIN_STATUS_LABELS[status] ?? status}
    </span>
  );
}
