import { useMemo } from "react";
import AudienceCreativeMatrix from "../components/AudienceCreativeMatrix";
import { buildAudienceCreativeMatrix } from "../domain/experiments";
import type { AudienceSegment, CreativeAsset, Experiment } from "../types";

interface AudiencesPageProps {
  audiences: AudienceSegment[];
  assets: CreativeAsset[];
  experiments: Experiment[];
}

export default function AudiencesPage({ audiences, assets, experiments }: AudiencesPageProps) {
  const matrixRows = useMemo(
    () => buildAudienceCreativeMatrix({ audiences, creativeAssets: assets, experiments }),
    [assets, audiences, experiments]
  );

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Audience strategy</p>
          <h2>Segments with a reason to buy</h2>
          <p>
            The app treats audiences as working hypotheses: motivation, message angle, channel
            fit, and proof points.
          </p>
        </div>
      </header>

      <AudienceCreativeMatrix assets={assets} rows={matrixRows} />

      <section className="audience-grid">
        {audiences.map((audience) => (
          <article className="audience-card" key={audience.id}>
            <span className="inline-tag">{audience.channels.join(" + ")}</span>
            <h3>{audience.name}</h3>
            <p>{audience.motivation}</p>
            <blockquote>{audience.messageAngle}</blockquote>
            <ul>
              {audience.proofPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
