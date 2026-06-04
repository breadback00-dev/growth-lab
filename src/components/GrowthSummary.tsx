import { calculateGrowth, formatMoney, summarizeSales } from "../domain/growth";
import type { MonthlySales } from "../types";
import MetricTile from "./MetricTile";

interface GrowthSummaryProps {
  selectedMonth: MonthlySales;
  sales: MonthlySales[];
}

export default function GrowthSummary({ selectedMonth, sales }: GrowthSummaryProps) {
  const summary = summarizeSales(sales);
  const latest = selectedMonth;
  const growth = calculateGrowth(latest);
  const december = sales.find((month) => month.isSeasonalPeak);
  const decemberGrowth = december ? calculateGrowth(december) : null;

  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Sales position</p>
          <h2>{latest.month} growth math</h2>
        </div>
        <span className={growth.isAboveThreshold ? "status-pill good" : "status-pill warn"}>
          {growth.isAboveThreshold ? "Above threshold" : "Below threshold"}
        </span>
      </div>

      <div className="metric-grid">
        <MetricTile
          detail={`${formatMoney(latest.previousYearRevenue)} same month last year`}
          label="Current online sales"
          tone="neutral"
          value={formatMoney(latest.currentRevenue)}
        />
        <MetricTile
          detail="25 percent growth line"
          label="Reward threshold"
          tone="warn"
          value={formatMoney(growth.thresholdRevenue)}
        />
        <MetricTile
          detail="Revenue above threshold"
          label="Commissionable"
          tone={growth.isAboveThreshold ? "good" : "warn"}
          value={formatMoney(growth.commissionableRevenue)}
        />
        <MetricTile
          detail="15 percent of commissionable revenue"
          label="Reward"
          tone={growth.reward > 0 ? "good" : "neutral"}
          value={formatMoney(growth.reward)}
        />
      </div>

      {december && decemberGrowth ? (
        <div className="season-note">
          <strong>Seasonal contrast:</strong> December demo sales sit at{" "}
          {formatMoney(december.currentRevenue)}, which is why the product keeps a separate
          seasonal context instead of averaging the whole year into one bland target.
        </div>
      ) : null}
    </section>
  );
}
