import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

interface RouterContext {
  queryClient: QueryClient;
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
