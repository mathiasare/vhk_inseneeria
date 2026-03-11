import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { TeamDashboardPage } from "@/pages/TeamDashboardPage";

export const teamDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teams/$teamId",
  component: TeamDashboardPage,
});
