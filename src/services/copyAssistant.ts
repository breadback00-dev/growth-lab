import type { AudienceSegment, BrandProfile, CreativeAsset } from "../types";

export function generateCopySet(input: {
  audience: AudienceSegment;
  asset: CreativeAsset;
  brand: BrandProfile;
}) {
  const { audience, asset, brand } = input;
  const tone = brand.tone.slice(0, 2).join(" and ");

  return {
    caption: `${asset.product} for ${audience.name.toLowerCase()}: ${audience.messageAngle}`,
    emailSubject: `${asset.theme}: a ${tone} note from ${brand.name}`,
    paidHook: `For ${audience.name.toLowerCase()} who want ${audience.proofPoints[0].toLowerCase()}, start with ${asset.title}.`,
    rationale: `Grounded in ${audience.name}, ${asset.title}, and the ${asset.theme} creative theme.`
  };
}
