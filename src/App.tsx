import { useMemo, useState } from "react";
import AppShell from "./components/AppShell";
import {
  audiences,
  brandProfile,
  campaigns,
  creativeAssets,
  experiments,
  monthlySales,
  planMonths
} from "./data/demoData";
import { generateWeeklyRecommendations } from "./domain/recommendations";
import AudiencesPage from "./pages/AudiencesPage";
import CreativePage from "./pages/CreativePage";
import DashboardPage from "./pages/DashboardPage";
import ExperimentsPage from "./pages/ExperimentsPage";
import PlanPage from "./pages/PlanPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import type { PageId } from "./types";

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const recommendations = useMemo(
    () =>
      generateWeeklyRecommendations({
        sales: monthlySales,
        experiments,
        campaigns,
        audiences,
        creativeAssets
      }),
    []
  );

  const pages: Record<PageId, React.ReactNode> = {
    dashboard: (
      <DashboardPage
        brand={brandProfile}
        sales={monthlySales}
        campaigns={campaigns}
        experiments={experiments}
        recommendations={recommendations}
      />
    ),
    plan: <PlanPage campaigns={campaigns} months={planMonths} />,
    experiments: (
      <ExperimentsPage
        audiences={audiences}
        creativeAssets={creativeAssets}
        experiments={experiments}
      />
    ),
    audiences: <AudiencesPage audiences={audiences} />,
    creative: (
      <CreativePage
        audiences={audiences}
        assets={creativeAssets}
        brand={brandProfile}
      />
    ),
    recommendations: <RecommendationsPage recommendations={recommendations} />
  };

  return (
    <AppShell activePage={activePage} brand={brandProfile} onNavigate={setActivePage}>
      {pages[activePage]}
    </AppShell>
  );
}
