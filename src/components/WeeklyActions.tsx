import { Check, Clock3, RotateCcw } from "lucide-react";
import type { WeeklyAction, WeeklyActionStatus } from "../types";

interface WeeklyActionsProps {
  actions: WeeklyAction[];
  onSetStatus: (action: WeeklyAction, status: WeeklyActionStatus) => void;
}

function ActionRow({
  action,
  onSetStatus
}: {
  action: WeeklyAction;
  onSetStatus: (action: WeeklyAction, status: WeeklyActionStatus) => void;
}) {
  return (
    <article className={`action-item ${action.status}`} key={action.id}>
      <span className={`priority ${action.priority}`}>{action.priority}</span>
      <div>
        <div className="action-title-row">
          <strong>{action.title}</strong>
          <span className={`status-pill ${action.status}`}>{action.status}</span>
        </div>
        <p>{action.nextStep}</p>
        <div className="button-row action-controls">
          {action.status !== "done" ? (
            <button
              className="secondary-button icon-button"
              onClick={() => onSetStatus(action, "done")}
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
              onClick={() => onSetStatus(action, "snoozed")}
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
              onClick={() => onSetStatus(action, "todo")}
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
  );
}

export default function WeeklyActions({ actions, onSetStatus }: WeeklyActionsProps) {
  const activeActions = actions.filter((action) => action.status === "todo");
  const snoozedActions = actions.filter((action) => action.status === "snoozed");
  const doneActions = actions.filter((action) => action.status === "done");

  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">This week</p>
          <h2>Operator queue</h2>
        </div>
      </div>

      <div className="agenda-summary">
        <span>{activeActions.length} active</span>
        <span>{snoozedActions.length} carried over</span>
        <span>{doneActions.length} done</span>
      </div>

      <div className="action-stack">
        <div className="agenda-group">
          <span className="agenda-label">Active</span>
          {activeActions.map((action) => (
            <ActionRow action={action} key={action.id} onSetStatus={onSetStatus} />
          ))}
        </div>

        {snoozedActions.length > 0 ? (
          <div className="agenda-group">
            <span className="agenda-label">Carried over</span>
            {snoozedActions.map((action) => (
              <ActionRow action={action} key={action.id} onSetStatus={onSetStatus} />
            ))}
          </div>
        ) : null}

        {doneActions.length > 0 ? (
          <div className="agenda-group">
            <span className="agenda-label">Completed</span>
            {doneActions.map((action) => (
              <ActionRow action={action} key={action.id} onSetStatus={onSetStatus} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
