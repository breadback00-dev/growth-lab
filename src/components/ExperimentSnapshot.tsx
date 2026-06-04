import { classifyExperiment, progressToTarget } from "../domain/experiments";
import type { Experiment } from "../types";

interface ExperimentSnapshotProps {
  experiments: Experiment[];
}

export default function ExperimentSnapshot({ experiments }: ExperimentSnapshotProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Experiment pulse</p>
          <h2>What to decide</h2>
        </div>
      </div>

      <div className="snapshot-list">
        {experiments.slice(0, 4).map((experiment) => {
          const action = classifyExperiment(experiment);
          const progress = Math.round(progressToTarget(experiment) * 100);

          return (
            <article className="snapshot-row" key={experiment.id}>
              <div>
                <strong>{experiment.title}</strong>
                <span>{experiment.metricName}</span>
              </div>
              <div className="progress-bar" aria-label={`${progress} percent to target`}>
                <span style={{ width: `${Math.min(progress, 130)}%` }} />
              </div>
              <span className={`decision ${action}`}>{action}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
