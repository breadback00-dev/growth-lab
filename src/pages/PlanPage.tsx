import { getBudgetPosture } from "../domain/planning";
import { formatMoney } from "../domain/growth";
import type { Campaign, PlanMonth } from "../types";

interface PlanPageProps {
  campaigns: Campaign[];
  months: PlanMonth[];
}

export default function PlanPage({ campaigns, months }: PlanPageProps) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Six-month plan</p>
          <h2>Audit, test, checkpoint, scale</h2>
          <p>
            Month 1 stays organic and analytical. Paid tests start small from month 2, with
            explicit checkpoint decisions at month 3 and month 6.
          </p>
        </div>
      </header>

      <section className="timeline" aria-label="Six-month campaign timeline">
        {months.map((month) => (
          <article className="timeline-item" key={month.phase}>
            <div className="timeline-top">
              <span>{month.phase}</span>
              <strong>{month.month}</strong>
            </div>
            <h3>{month.focus}</h3>
            <p>{getBudgetPosture(month)}</p>
            <div className="budget-row">
              <span>Budget</span>
              <strong>{formatMoney(month.budget)}</strong>
            </div>
            {month.checkpoint ? <span className="status-pill warn">{month.checkpoint}</span> : null}
            <ul>
              {month.deliverables.map((deliverable) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Campaign table</p>
            <h2>Channel tests</h2>
          </div>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Month</th>
                <th>Channels</th>
                <th>Budget</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>{campaign.month}</td>
                  <td>{campaign.channels.join(", ")}</td>
                  <td>{formatMoney(campaign.budget)}</td>
                  <td>
                    <span className={`status-pill ${campaign.status}`}>{campaign.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
