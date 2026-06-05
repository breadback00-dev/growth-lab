import { useMemo, useState } from "react";
import { buildBudgetAllocationScenarios } from "../domain/experiments";
import { calculateScenarioThresholdImpact, formatMoney } from "../domain/growth";
import type { BudgetScenario, Experiment, MonthlySales } from "../types";

interface BudgetScenarioPlannerProps {
  experiments: Experiment[];
  monthlyBudget: number;
  selectedMonth: MonthlySales;
}

export default function BudgetScenarioPlanner({
  experiments,
  monthlyBudget,
  selectedMonth
}: BudgetScenarioPlannerProps) {
  const scenarios = useMemo(
    () => buildBudgetAllocationScenarios(experiments, monthlyBudget),
    [experiments, monthlyBudget]
  );
  const [selectedScenarioId, setSelectedScenarioId] = useState<BudgetScenario["id"]>(
    scenarios[0]?.id ?? "evidence"
  );
  const selectedScenario =
    scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0];
  const selectedImpact = calculateScenarioThresholdImpact(selectedMonth, selectedScenario);
  const experimentsById = useMemo(
    () => new Map(experiments.map((experiment) => [experiment.id, experiment])),
    [experiments]
  );

  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Budget scenario planner</p>
          <h2>Where the next {formatMoney(monthlyBudget)} could go</h2>
        </div>
        <span className="status-pill planned">Proxy estimates</span>
      </div>

      <div className="scenario-grid" aria-label="Budget allocation scenarios">
        {scenarios.map((scenario) => {
          const impact = calculateScenarioThresholdImpact(selectedMonth, scenario);
          const isSelected = scenario.id === selectedScenario.id;

          return (
            <button
              aria-pressed={isSelected}
              className={`scenario-card ${isSelected ? "active" : ""}`}
              key={scenario.id}
              onClick={() => setSelectedScenarioId(scenario.id)}
              type="button"
            >
              <span>{scenario.name}</span>
              <strong>{formatMoney(scenario.estimatedContribution)}</strong>
              <small>Estimated contribution proxy</small>
              <em>{Math.round(impact.thresholdProgressPercent)}% of threshold after scenario</em>
            </button>
          );
        })}
      </div>

      <div className="scenario-detail-grid">
        <div className="scenario-summary">
          <p>{selectedScenario.summary}</p>
          <dl>
            <div>
              <dt>Current gap</dt>
              <dd>{formatMoney(selectedImpact.currentGapToThreshold)}</dd>
            </div>
            <div>
              <dt>Proxy gap after spend</dt>
              <dd>{formatMoney(selectedImpact.projectedGapToThreshold)}</dd>
            </div>
            <div>
              <dt>Threshold lift</dt>
              <dd>+{selectedImpact.thresholdProgressDelta.toFixed(1)} pts</dd>
            </div>
            <div>
              <dt>Commissionable upside proxy</dt>
              <dd>{formatMoney(selectedImpact.estimatedCommissionableRevenue)}</dd>
            </div>
          </dl>
        </div>

        <div className="allocation-list">
          {selectedScenario.allocations.map((allocation) => {
            const experiment = experimentsById.get(allocation.experimentId);

            return (
              <article className="allocation-row" key={allocation.experimentId}>
                <div>
                  <strong>{experiment?.title ?? "Unknown experiment"}</strong>
                  <span>{allocation.rationale}</span>
                </div>
                <div className="allocation-metrics">
                  <span>{formatMoney(allocation.amount)}</span>
                  <small>score {allocation.score.toFixed(2)}</small>
                  <small>{formatMoney(allocation.estimatedContribution)} proxy</small>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
