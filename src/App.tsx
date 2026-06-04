import { useMemo, useState } from "react";
import AppShell from "./components/AppShell";
import {
  audiences,
  brandProfile,
  campaigns,
  creativeAssets,
} from "./data/demoData";
import { generateWeeklyRecommendations } from "./domain/recommendations";
import AudiencesPage from "./pages/AudiencesPage";
import CreativePage from "./pages/CreativePage";
import DashboardPage from "./pages/DashboardPage";
import ExperimentsPage from "./pages/ExperimentsPage";
import PlanPage from "./pages/PlanPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import { useGrowthLabState } from "./state/useGrowthLabState";
import type { PageId } from "./types";

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const {
    state,
    replaceMonthlySales,
    resetToDemo,
    updatePlanMonth,
    upsertExperiment
  } = useGrowthLabState();
  const recommendations = useMemo(
    () =>
      generateWeeklyRecommendations({
        sales: state.monthlySales,
        experiments: state.experiments,
        campaigns,
        audiences,
        creativeAssets
      }),
    [state.experiments, state.monthlySales]
  );

  const pages: Record<PageId, React.ReactNode> = {
    dashboard: (
      <DashboardPage
        brand={brandProfile}
        onReplaceSales={replaceMonthlySales}
        sales={state.monthlySales}
        campaigns={campaigns}
        experiments={state.experiments}
        recommendations={recommendations}
      />
    ),
    plan: <PlanPage campaigns={campaigns} months={state.planMonths} onUpdateMonth={updatePlanMonth} />,
    experiments: (
      <ExperimentsPage
        audiences={audiences}
        creativeAssets={creativeAssets}
        experiments={state.experiments}
        onSaveExperiment={upsertExperiment}
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
    <AppShell
      activePage={activePage}
      brand={brandProfile}
      onNavigate={setActivePage}
      onReset={resetToDemo}
    >
      {pages[activePage]}
    </AppShell>
  );
}
