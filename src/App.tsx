import { useMemo, useState } from "react";
import AppShell from "./components/AppShell";
import {
  audiences,
  brandProfile,
  campaigns,
  creativeAssets,
} from "./data/demoData";
import { buildCheckpointScorecards } from "./domain/planning";
import { buildWeeklyActions, generateWeeklyRecommendations } from "./domain/recommendations";
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
    recordExperimentDecision,
    resetToDemo,
    setWeeklyActionStatus,
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
  const weeklyActions = useMemo(
    () => buildWeeklyActions(recommendations, state.weeklyActions),
    [recommendations, state.weeklyActions]
  );
  const checkpointScorecards = useMemo(
    () =>
      buildCheckpointScorecards({
        months: state.planMonths,
        campaigns,
        experiments: state.experiments,
        sales: state.monthlySales
      }),
    [state.experiments, state.monthlySales, state.planMonths]
  );

  const pages: Record<PageId, React.ReactNode> = {
    dashboard: (
      <DashboardPage
        brand={brandProfile}
        onReplaceSales={replaceMonthlySales}
        sales={state.monthlySales}
        campaigns={campaigns}
        experiments={state.experiments}
        weeklyActions={weeklyActions}
        onSetWeeklyActionStatus={setWeeklyActionStatus}
      />
    ),
    plan: (
      <PlanPage
        campaigns={campaigns}
        checkpointScorecards={checkpointScorecards}
        months={state.planMonths}
        onUpdateMonth={updatePlanMonth}
      />
    ),
    experiments: (
      <ExperimentsPage
        audiences={audiences}
        creativeAssets={creativeAssets}
        decisions={state.experimentDecisions}
        experiments={state.experiments}
        onRecordDecision={recordExperimentDecision}
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
    recommendations: (
      <RecommendationsPage
        weeklyActions={weeklyActions}
        onSetWeeklyActionStatus={setWeeklyActionStatus}
      />
    )
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
