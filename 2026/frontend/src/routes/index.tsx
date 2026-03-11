import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { TeamSelectPage } from "@/pages/TeamSelectPage";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: TeamSelectPage,
});
