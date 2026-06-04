import { classifyExperiment, groupExperimentsByAction, progressToTarget } from "../domain/experiments";
import { formatMoney } from "../domain/growth";
import type { AudienceSegment, CreativeAsset, Experiment, NextAction } from "../types";

interface ExperimentsPageProps {
  audiences: AudienceSegment[];
  creativeAssets: CreativeAsset[];
  experiments: Experiment[];
}

const actionOrder: NextAction[] = ["scale", "iterate", "launch", "stop"];

export default function ExperimentsPage({
  audiences,
  creativeAssets,
  experiments
}: ExperimentsPageProps) {
  const groups = groupExperimentsByAction(experiments);

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Experiment board</p>
          <h2>Hypothesis to decision</h2>
          <p>
            Every row has an audience, creative, spend, target, result, and next action. The
            board is built for one weekly decision pass.
          </p>
        </div>
      </header>

      <section className="kanban">
        {actionOrder.map((action) => (
          <div className="kanban-column" key={action}>
            <div className="column-heading">
              <span className={`decision ${action}`}>{action}</span>
              <strong>{groups[action].length}</strong>
            </div>
            {groups[action].map((experiment) => {
              const audience = audiences.find((item) => item.id === experiment.audienceId);
              const asset = creativeAssets.find((item) => item.id === experiment.creativeAssetId);
              const progress = Math.round(progressToTarget(experiment) * 100);

              return (
                <article className="experiment-card" key={experiment.id}>
                  <h3>{experiment.title}</h3>
                  <p>{experiment.hypothesis}</p>
                  <dl>
                    <div>
                      <dt>Audience</dt>
                      <dd>{audience?.name}</dd>
                    </div>
                    <div>
                      <dt>Creative</dt>
                      <dd>{asset?.title}</dd>
                    </div>
                    <div>
                      <dt>Spend</dt>
                      <dd>{formatMoney(experiment.spend)}</dd>
                    </div>
                    <div>
                      <dt>Signal</dt>
                      <dd>{progress}%</dd>
                    </div>
                  </dl>
                  <p className="result-note">{experiment.resultNote}</p>
                  <span className={`status-pill ${classifyExperiment(experiment)}`}>
                    {classifyExperiment(experiment)}
                  </span>
                </article>
              );
            })}
          </div>
        ))}
      </section>
    </div>
  );
}
