import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { supabase } from "@/integrations/supabase/client";
import { getMySession } from "@backend/campaigns.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    const session = await getMySession();
    if (!session.isAdmin) throw redirect({ to: "/" });
    return { session };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { session } = Route.useRouteContext();
  return (
    <AdminShell userLabel={session.fullName || session.email || "Quản trị viên"}>
      <Outlet />
    </AdminShell>
  );
}
