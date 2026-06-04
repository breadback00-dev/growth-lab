import type { Recommendation } from "../types";

interface WeeklyActionsProps {
  recommendations: Recommendation[];
}

export default function WeeklyActions({ recommendations }: WeeklyActionsProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">This week</p>
          <h2>Operator queue</h2>
        </div>
      </div>

      <div className="action-stack">
        {recommendations.map((recommendation) => (
          <article className="action-item" key={recommendation.id}>
            <span className={`priority ${recommendation.priority}`}>
              {recommendation.priority}
            </span>
            <div>
              <strong>{recommendation.title}</strong>
              <p>{recommendation.nextStep}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
