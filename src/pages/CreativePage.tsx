import { useMemo, useState } from "react";
import { generateCopySet, generateCopyVariants } from "../services/copyAssistant";
import type { AudienceSegment, BrandProfile, CopyOutputType, CreativeAsset } from "../types";

interface CreativePageProps {
  assets: CreativeAsset[];
  audiences: AudienceSegment[];
  brand: BrandProfile;
}

export default function CreativePage({ assets, audiences, brand }: CreativePageProps) {
  const [selectedAudienceId, setSelectedAudienceId] = useState(audiences[0]?.id ?? "");
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id ?? "");
  const [outputType, setOutputType] = useState<CopyOutputType>("caption");
  const selectedAudience = audiences.find((audience) => audience.id === selectedAudienceId) ?? audiences[0];
  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) ?? assets[0];
  const variants = useMemo(
    () =>
      selectedAudience && selectedAsset
        ? generateCopyVariants({
            audience: selectedAudience,
            asset: selectedAsset,
            brand,
            outputType
          })
        : [],
    [brand, outputType, selectedAsset, selectedAudience]
  );

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

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Assistant controls</p>
            <h2>Generate grounded variants</h2>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Audience
            <select
              value={selectedAudienceId}
              onChange={(event) => setSelectedAudienceId(event.target.value)}
            >
              {audiences.map((audience) => (
                <option key={audience.id} value={audience.id}>
                  {audience.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Creative asset
            <select value={selectedAssetId} onChange={(event) => setSelectedAssetId(event.target.value)}>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Output type
            <select
              value={outputType}
              onChange={(event) => setOutputType(event.target.value as CopyOutputType)}
            >
              <option value="caption">Caption</option>
              <option value="emailSubject">Email subject</option>
              <option value="paidHook">Paid hook</option>
              <option value="bundleIdea">Bundle idea</option>
            </select>
          </label>
        </div>
        <div className="variant-list">
          {variants.map((variant) => (
            <article className="copy-box" key={variant.text}>
              <p>{variant.text}</p>
              <small>{variant.rationale}</small>
            </article>
          ))}
        </div>
      </section>

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
