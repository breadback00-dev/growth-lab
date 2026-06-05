import { pairingStateLabels } from "../domain/experiments";
import type { AudienceCreativeMatrixRow, CreativeAsset, PairingState } from "../types";

interface AudienceCreativeMatrixProps {
  assets: CreativeAsset[];
  rows: AudienceCreativeMatrixRow[];
}

const stateOrder: PairingState[] = [
  "winning",
  "needsIteration",
  "stopped",
  "planned",
  "untested"
];

export default function AudienceCreativeMatrix({ assets, rows }: AudienceCreativeMatrixProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Performance matrix</p>
          <h2>Audience x creative evidence</h2>
        </div>
        <span className="status-pill review">Proxy signals</span>
      </div>
      <p className="helper-text">
        Scan this before the weekly decision: reuse winners, iterate weak pairings, and treat
        untested cells as backlog gaps rather than failures.
      </p>
      <div className="matrix-legend" aria-label="Matrix state legend">
        {stateOrder.map((state) => (
          <span className={`matrix-state ${state}`} key={state}>
            {pairingStateLabels[state]}
          </span>
        ))}
      </div>
      <div className="matrix-wrap">
        <table className="matrix-table">
          <thead>
            <tr>
              <th scope="col">Audience</th>
              {assets.map((asset) => (
                <th scope="col" key={asset.id}>
                  {asset.title}
                  <span>{asset.format}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.audience.id}>
                <th scope="row">
                  {row.audience.name}
                  <span>{row.audience.channels.join(" + ")}</span>
                </th>
                {row.pairings.map((pairing) => (
                  <td key={pairing.creativeAssetId}>
                    <span className={`matrix-state ${pairing.state}`}>
                      {pairingStateLabels[pairing.state]}
                    </span>
                    <strong>{pairing.primaryExperiment?.title ?? "No linked test"}</strong>
                    <small>{pairing.summary}</small>
                    <em>{pairing.nextStep}</em>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
