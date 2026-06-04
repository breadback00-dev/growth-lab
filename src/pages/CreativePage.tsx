import { generateCopySet } from "../services/copyAssistant";
import type { AudienceSegment, BrandProfile, CreativeAsset } from "../types";

interface CreativePageProps {
  assets: CreativeAsset[];
  audiences: AudienceSegment[];
  brand: BrandProfile;
}

export default function CreativePage({ assets, audiences, brand }: CreativePageProps) {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Creative library</p>
          <h2>Reuse the visual archive</h2>
          <p>
            Product imagery, captions, bundles, and email concepts are attached to audience
            strategy so the assistant cannot drift into generic copy.
          </p>
        </div>
      </header>

      <section className="creative-grid">
        {assets.map((asset) => {
          const audience = audiences.find((item) => asset.audienceFit.includes(item.id)) ?? audiences[0];
          const copy = generateCopySet({ audience, asset, brand });

          return (
            <article className="creative-card" key={asset.id}>
              <div className="asset-preview">
                <span>{asset.format}</span>
                <strong>{asset.theme}</strong>
              </div>
              <div className="creative-body">
                <span className="inline-tag">{asset.product}</span>
                <h3>{asset.title}</h3>
                <p>{asset.reuseNote}</p>
                <div className="copy-box">
                  <strong>Assistant draft</strong>
                  <p>{copy.caption}</p>
                  <small>{copy.rationale}</small>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
