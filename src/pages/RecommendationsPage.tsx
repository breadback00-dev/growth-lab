import { Check, Clock3, RotateCcw } from "lucide-react";
import type { WeeklyAction, WeeklyActionStatus } from "../types";

interface RecommendationsPageProps {
  weeklyActions: WeeklyAction[];
  onSetWeeklyActionStatus: (action: WeeklyAction, status: WeeklyActionStatus) => void;
}

function statusLabel(status: WeeklyActionStatus): string {
  if (status === "snoozed") {
    return "carried over";
  }

  return status;
}

export default function RecommendationsPage({
  weeklyActions,
  onSetWeeklyActionStatus
}: RecommendationsPageProps) {
  const activeActions = weeklyActions.filter((action) => action.status === "todo");
  const snoozedActions = weeklyActions.filter((action) => action.status === "snoozed");
  const doneActions = weeklyActions.filter((action) => action.status === "done");

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
        <div className="header-panel">
          <span>Weekly state</span>
          <strong>{activeActions.length} active actions</strong>
          <small>
            {snoozedActions.length} carried over, {doneActions.length} completed
          </small>
        </div>
      </header>

      <section className="recommendation-list">
        {weeklyActions.map((action, index) => (
          <article className={`recommendation-row ${action.status}`} key={action.id}>
            <span className="rank">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <div className="action-title-row">
                <span className={`priority ${action.priority}`}>{action.priority}</span>
                <span className={`status-pill ${action.status}`}>
                  {statusLabel(action.status)}
                </span>
              </div>
              <h3>{action.title}</h3>
              <p>{action.rationale}</p>
              <strong>{action.nextStep}</strong>
              <div className="button-row action-controls">
                {action.status !== "done" ? (
                  <button
                    className="secondary-button icon-button"
                    onClick={() => onSetWeeklyActionStatus(action, "done")}
                    title="Mark done"
                    type="button"
                  >
                    <Check size={16} aria-hidden="true" />
                    Done
                  </button>
                ) : null}
                {action.status !== "snoozed" ? (
                  <button
                    className="secondary-button icon-button"
                    onClick={() => onSetWeeklyActionStatus(action, "snoozed")}
                    title="Snooze"
                    type="button"
                  >
                    <Clock3 size={16} aria-hidden="true" />
                    Snooze
                  </button>
                ) : null}
                {action.status !== "todo" ? (
                  <button
                    className="secondary-button icon-button"
                    onClick={() => onSetWeeklyActionStatus(action, "todo")}
                    title="Return to this week"
                    type="button"
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                    Reopen
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
