import type { Recommendation } from "../types";

interface RecommendationsPageProps {
  recommendations: Recommendation[];
}

export default function RecommendationsPage({ recommendations }: RecommendationsPageProps) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Weekly operator view</p>
          <h2>What to do next</h2>
          <p>
            A one-day-per-week operator needs fewer vague insights and more decisions that can be
            acted on before the next check-in.
          </p>
        </div>
      </header>

      <section className="recommendation-list">
        {recommendations.map((recommendation, index) => (
          <article className="recommendation-row" key={recommendation.id}>
            <span className="rank">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <span className={`priority ${recommendation.priority}`}>
                {recommendation.priority}
              </span>
              <h3>{recommendation.title}</h3>
              <p>{recommendation.rationale}</p>
              <strong>{recommendation.nextStep}</strong>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
