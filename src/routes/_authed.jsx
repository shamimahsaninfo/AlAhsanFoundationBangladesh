import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGateError, requireSignedIn } from "@/components/auth/AuthGate";
import AdminLayout from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/_authed")({
  ssr: false,
  beforeLoad: requireSignedIn,
  errorComponent: AuthGateError,
  component: AdminGate,
});

function AdminGate() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}