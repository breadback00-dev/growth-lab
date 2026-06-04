import { calculateGrowth, formatMoney } from "../domain/growth";
import type { MonthlySales } from "../types";

interface MonthComparisonProps {
  sales: MonthlySales[];
}

export default function MonthComparison({ sales }: MonthComparisonProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Year over year</p>
          <h2>Monthly comparison</h2>
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Last year</th>
              <th>Current</th>
              <th>Threshold</th>
              <th>Reward</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((month) => {
              const growth = calculateGrowth(month);

              return (
                <tr key={month.month}>
                  <td>
                    {month.month}
                    {month.isSeasonalPeak ? <span className="inline-tag">Seasonal</span> : null}
                  </td>
                  <td>{formatMoney(month.previousYearRevenue)}</td>
                  <td>{formatMoney(month.currentRevenue)}</td>
                  <td>{formatMoney(growth.thresholdRevenue)}</td>
                  <td>{formatMoney(growth.reward)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
