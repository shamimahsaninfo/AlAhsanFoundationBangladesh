import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGateError, requireSignedIn } from "@/components/auth/AuthGate";
import SiteShell from "@/components/site/SiteShell";

export const Route = createFileRoute("/_donor")({
  ssr: false,
  beforeLoad: requireSignedIn,
  errorComponent: AuthGateError,
  component: DonorLayout,
});

function DonorLayout() {
  return (
    <SiteShell>
      <Outlet />
    </SiteShell>
  );
}