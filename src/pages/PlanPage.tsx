import { getBudgetPosture } from "../domain/planning";
import { formatMoney } from "../domain/growth";
import type { Campaign, CheckpointRecommendation, CheckpointScorecard, PlanMonth } from "../types";

interface PlanPageProps {
  campaigns: Campaign[];
  checkpointScorecards: CheckpointScorecard[];
  months: PlanMonth[];
  onUpdateMonth: (phase: string, updates: Partial<PlanMonth>) => void;
}

const recommendationLabel: Record<CheckpointRecommendation, string> = {
  scale: "Scale",
  iterate: "Iterate",
  pause: "Pause"
};

export default function PlanPage({
  campaigns,
  checkpointScorecards,
  months,
  onUpdateMonth
}: PlanPageProps) {
  const scorecardsByPhase = new Map(
    checkpointScorecards.map((scorecard) => [scorecard.phase, scorecard])
  );

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
        {months.map((month) => {
          const scorecard = scorecardsByPhase.get(month.phase);

          return (
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
              {scorecard ? (
                <section className="checkpoint-panel" aria-label={`${month.phase} scorecard`}>
                  <div className="checkpoint-topline">
                    <span className="agenda-label">Checkpoint scorecard</span>
                    <span className={`status-pill ${scorecard.recommendation}`}>
                      {recommendationLabel[scorecard.recommendation]}
                    </span>
                  </div>
                  <div className="checkpoint-metrics">
                    <div>
                      <span>Threshold</span>
                      <strong>{Math.round(scorecard.thresholdProgressPercent)}%</strong>
                    </div>
                    <div>
                      <span>Organic</span>
                      <strong>{scorecard.organicExperiments} tests</strong>
                    </div>
                    <div>
                      <span>Paid</span>
                      <strong>{scorecard.paidExperiments} tests</strong>
                    </div>
                    <div>
                      <span>Spend</span>
                      <strong>{formatMoney(scorecard.paidSpend)}</strong>
                    </div>
                  </div>
                  <dl className="decision-counts">
                    <div>
                      <dt>Scale</dt>
                      <dd>{scorecard.decisionCounts.scale}</dd>
                    </div>
                    <div>
                      <dt>Iterate</dt>
                      <dd>{scorecard.decisionCounts.iterate}</dd>
                    </div>
                    <div>
                      <dt>Launch</dt>
                      <dd>{scorecard.decisionCounts.launch}</dd>
                    </div>
                    <div>
                      <dt>Stop</dt>
                      <dd>{scorecard.decisionCounts.stop}</dd>
                    </div>
                  </dl>
                  <label className="summary-copy-label">
                    Founder summary
                    <textarea
                      className="summary-copy"
                      readOnly
                      value={scorecard.summary}
                    />
                  </label>
                </section>
              ) : null}
              <details className="inline-editor">
                <summary>Edit month</summary>
                <label>
                  Focus
                  <textarea
                    value={month.focus}
                    onChange={(event) =>
                      onUpdateMonth(month.phase, { focus: event.target.value })
                    }
                  />
                </label>
                <label>
                  Budget
                  <input
                    min="0"
                    type="number"
                    value={month.budget}
                    onChange={(event) =>
                      onUpdateMonth(month.phase, { budget: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  Checkpoint
                  <input
                    value={month.checkpoint ?? ""}
                    onChange={(event) =>
                      onUpdateMonth(month.phase, {
                        checkpoint: event.target.value || undefined
                      })
                    }
                  />
                </label>
                <label>
                  Deliverables
                  <textarea
                    value={month.deliverables.join("\n")}
                    onChange={(event) =>
                      onUpdateMonth(month.phase, {
                        deliverables: event.target.value
                          .split("\n")
                          .map((item) => item.trim())
                          .filter(Boolean)
                      })
                    }
                  />
                </label>
              </details>
            </article>
          );
        })}
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
