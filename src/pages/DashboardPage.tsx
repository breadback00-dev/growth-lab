import ExperimentSnapshot from "../components/ExperimentSnapshot";
import GrowthSummary from "../components/GrowthSummary";
import MonthComparison from "../components/MonthComparison";
import WeeklyActions from "../components/WeeklyActions";
import type { BrandProfile, Campaign, Experiment, MonthlySales, Recommendation } from "../types";

interface DashboardPageProps {
  brand: BrandProfile;
  sales: MonthlySales[];
  campaigns: Campaign[];
  experiments: Experiment[];
  recommendations: Recommendation[];
}

export default function DashboardPage({
  brand,
  sales,
  campaigns,
  experiments,
  recommendations
}: DashboardPageProps) {
  const activeCampaign = campaigns.find((campaign) => campaign.status === "active");

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Command center</p>
          <h2>Online growth cockpit</h2>
          <p>
            {brand.followers.toLocaleString("en-GB")} followers, a strong shop baseline, and a
            six-month window to prove which online channels deserve more energy.
          </p>
        </div>
        <div className="header-panel">
          <span>Active campaign</span>
          <strong>{activeCampaign?.name ?? "No active campaign"}</strong>
          <small>{activeCampaign?.goal ?? "Start with the month 1 audit."}</small>
        </div>
      </header>

      <GrowthSummary sales={sales} />

      <div className="two-column">
        <ExperimentSnapshot experiments={experiments} />
        <WeeklyActions recommendations={recommendations} />
      </div>

      <MonthComparison sales={sales} />
    </div>
  );
}
