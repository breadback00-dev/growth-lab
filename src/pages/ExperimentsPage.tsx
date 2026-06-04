import { useState } from "react";
import { classifyExperiment, groupExperimentsByAction, progressToTarget } from "../domain/experiments";
import { formatMoney } from "../domain/growth";
import type {
  AudienceSegment,
  ChannelType,
  Confidence,
  CreativeAsset,
  Experiment,
  ExperimentStatus,
  NextAction
} from "../types";

interface ExperimentsPageProps {
  audiences: AudienceSegment[];
  creativeAssets: CreativeAsset[];
  experiments: Experiment[];
  onSaveExperiment: (experiment: Experiment) => void;
}

const actionOrder: NextAction[] = ["scale", "iterate", "launch", "stop"];
const channels: ChannelType[] = ["organic", "paid", "email", "retail"];
const statuses: ExperimentStatus[] = ["planned", "running", "complete"];
const confidenceLevels: Confidence[] = ["low", "medium", "high"];

function createDraft(audiences: AudienceSegment[], creativeAssets: CreativeAsset[]): Experiment {
  return {
    id: "",
    title: "New experiment",
    hypothesis: "This test will reveal which message deserves the next weekly slot.",
    audienceId: audiences[0]?.id ?? "",
    channel: "organic",
    creativeAssetId: creativeAssets[0]?.id ?? "",
    spend: 0,
    metricName: "Primary signal",
    metricValue: 0,
    targetValue: 50,
    status: "planned",
    confidence: "low",
    nextAction: "launch",
    resultNote: "Capture the learning after the first review."
  };
}

export default function ExperimentsPage({
  audiences,
  creativeAssets,
  experiments,
  onSaveExperiment
}: ExperimentsPageProps) {
  const [draft, setDraft] = useState<Experiment>(() => createDraft(audiences, creativeAssets));
  const groups = groupExperimentsByAction(experiments);

  const updateDraft = <Key extends keyof Experiment>(key: Key, value: Experiment[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const saveDraft = () => {
    const nextAction = classifyExperiment(draft);
    onSaveExperiment({ ...draft, nextAction });
    setDraft(createDraft(audiences, creativeAssets));
  };

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
        <div className="header-panel">
          <span>Form mode</span>
          <strong>{draft.id ? "Editing experiment" : "New experiment"}</strong>
          <small>Next action is derived from status, confidence, and result.</small>
        </div>
      </header>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Experiment editor</p>
            <h2>{draft.id ? draft.title : "Create a test"}</h2>
          </div>
          <div className="button-row">
            <button
              className="secondary-button"
              onClick={() => setDraft(createDraft(audiences, creativeAssets))}
              type="button"
            >
              Clear
            </button>
            <button className="primary-button" onClick={saveDraft} type="button">
              Save experiment
            </button>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Title
            <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} />
          </label>
          <label>
            Audience
            <select
              value={draft.audienceId}
              onChange={(event) => updateDraft("audienceId", event.target.value)}
            >
              {audiences.map((audience) => (
                <option key={audience.id} value={audience.id}>
                  {audience.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Channel
            <select
              value={draft.channel}
              onChange={(event) => updateDraft("channel", event.target.value as ChannelType)}
            >
              {channels.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </label>
          <label>
            Creative
            <select
              value={draft.creativeAssetId}
              onChange={(event) => updateDraft("creativeAssetId", event.target.value)}
            >
              {creativeAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.title}
                </option>
              ))}
            </select>
          </label>
          <label className="wide-field">
            Hypothesis
            <textarea
              value={draft.hypothesis}
              onChange={(event) => updateDraft("hypothesis", event.target.value)}
            />
          </label>
          <label>
            Spend
            <input
              min="0"
              type="number"
              value={draft.spend}
              onChange={(event) => updateDraft("spend", Number(event.target.value))}
            />
          </label>
          <label>
            Metric name
            <input
              value={draft.metricName}
              onChange={(event) => updateDraft("metricName", event.target.value)}
            />
          </label>
          <label>
            Metric value
            <input
              type="number"
              value={draft.metricValue}
              onChange={(event) => updateDraft("metricValue", Number(event.target.value))}
            />
          </label>
          <label>
            Target value
            <input
              min="0"
              type="number"
              value={draft.targetValue}
              onChange={(event) => updateDraft("targetValue", Number(event.target.value))}
            />
          </label>
          <label>
            Status
            <select
              value={draft.status}
              onChange={(event) => updateDraft("status", event.target.value as ExperimentStatus)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Confidence
            <select
              value={draft.confidence}
              onChange={(event) => updateDraft("confidence", event.target.value as Confidence)}
            >
              {confidenceLevels.map((confidence) => (
                <option key={confidence} value={confidence}>
                  {confidence}
                </option>
              ))}
            </select>
          </label>
          <label className="wide-field">
            Result note
            <textarea
              value={draft.resultNote}
              onChange={(event) => updateDraft("resultNote", event.target.value)}
            />
          </label>
        </div>
      </section>

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
                  <div className="button-row">
                    <span className={`status-pill ${classifyExperiment(experiment)}`}>
                      {classifyExperiment(experiment)}
                    </span>
                    <button
                      className="secondary-button"
                      onClick={() => setDraft(experiment)}
                      type="button"
                    >
                      Edit
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </section>
    </div>
  );
}
