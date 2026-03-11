import { rootRoute } from "./routes/__root";
import { indexRoute } from "./routes/index";
import { teamDashboardRoute } from "./routes/teams.$teamId";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  teamDashboardRoute,
]);
