import ExperimentSnapshot from "../components/ExperimentSnapshot";
import GrowthSummary from "../components/GrowthSummary";
import MonthComparison from "../components/MonthComparison";
import PlatformGuide from "../components/PlatformGuide";
import WeeklyActions from "../components/WeeklyActions";
import { parseSalesCsv } from "../domain/salesImport";
import { useMemo, useState } from "react";
import type {
  BrandProfile,
  Campaign,
  Experiment,
  MonthlySales,
  WeeklyAction,
  WeeklyActionStatus
} from "../types";

interface DashboardPageProps {
  brand: BrandProfile;
  sales: MonthlySales[];
  onReplaceSales: (sales: MonthlySales[]) => void;
  campaigns: Campaign[];
  experiments: Experiment[];
  weeklyActions: WeeklyAction[];
  onSetWeeklyActionStatus: (action: WeeklyAction, status: WeeklyActionStatus) => void;
}

export default function DashboardPage({
  brand,
  sales,
  onReplaceSales,
  campaigns,
  experiments,
  weeklyActions,
  onSetWeeklyActionStatus
}: DashboardPageProps) {
  const [selectedMonthName, setSelectedMonthName] = useState(sales[sales.length - 1]?.month ?? "");
  const [csvText, setCsvText] = useState(
    "month,previousYearRevenue,currentRevenue,isSeasonalPeak\nJuly,800,1275,false\nDecember,6200,8200,true"
  );
  const csvPreview = useMemo(() => parseSalesCsv(csvText), [csvText]);
  const selectedMonth =
    sales.find((month) => month.month === selectedMonthName) ?? sales[sales.length - 1];
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
          <label htmlFor="month-select">Dashboard month</label>
          <select
            id="month-select"
            value={selectedMonth.month}
            onChange={(event) => setSelectedMonthName(event.target.value)}
          >
            {sales.map((month) => (
              <option key={month.month} value={month.month}>
                {month.month}
              </option>
            ))}
          </select>
          <span>Active campaign</span>
          <strong>{activeCampaign?.name ?? "No active campaign"}</strong>
          <small>{activeCampaign?.goal ?? "Start with the month 1 audit."}</small>
        </div>
      </header>

      <PlatformGuide />

      <GrowthSummary selectedMonth={selectedMonth} sales={sales} />

      <div className="two-column">
        <ExperimentSnapshot experiments={experiments} />
        <WeeklyActions
          actions={weeklyActions}
          onSetStatus={onSetWeeklyActionStatus}
        />
      </div>

      <MonthComparison sales={sales} />

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sales import</p>
            <h2>Mock CSV import</h2>
          </div>
          <button
            className="primary-button"
            disabled={csvPreview.errors.length > 0 || csvPreview.rows.length === 0}
            onClick={() => {
              onReplaceSales(csvPreview.rows);
              setSelectedMonthName(csvPreview.rows[csvPreview.rows.length - 1].month);
            }}
            type="button"
          >
            Apply rows
          </button>
        </div>
        <textarea
          aria-label="Sales CSV"
          className="csv-input"
          value={csvText}
          onChange={(event) => setCsvText(event.target.value)}
        />
        {csvPreview.errors.length > 0 ? (
          <ul className="error-list">
            {csvPreview.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : (
          <p className="helper-text">
            Preview ready: {csvPreview.rows.length} row
            {csvPreview.rows.length === 1 ? "" : "s"} parsed.
          </p>
        )}
      </section>
    </div>
  );
}
