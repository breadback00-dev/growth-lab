import type { AudienceSegment, BrandProfile, CopyOutputType, CreativeAsset } from "../types";

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

export function generateCopyVariants(input: {
  audience: AudienceSegment;
  asset: CreativeAsset;
  brand: BrandProfile;
  outputType: CopyOutputType;
}): Array<{ text: string; rationale: string }> {
  const { audience, asset, brand, outputType } = input;
  const base = generateCopySet({ audience, asset, brand });
  const groundedIn = `Grounded in ${audience.name}, ${asset.title}, and ${asset.theme}.`;

  const variants: Record<CopyOutputType, string[]> = {
    caption: [
      base.caption,
      `${brand.name} made ${asset.product.toLowerCase()} for people who care about ${audience.proofPoints[0].toLowerCase()}.`,
      `${audience.messageAngle} ${asset.reuseNote}`
    ],
    emailSubject: [
      base.emailSubject,
      `${audience.name}: ${asset.theme}`,
      `${asset.product} with a Bristol story`
    ],
    paidHook: [
      base.paidHook,
      `${asset.product} for ${audience.name.toLowerCase()} who want more than generic homeware.`,
      `A ${brand.tone[0]} ${asset.product.toLowerCase()} test for ${audience.name.toLowerCase()}.`
    ],
    bundleIdea: [
      `Pair ${asset.product} with a handwritten Bristol note for ${audience.name.toLowerCase()}.`,
      `Bundle ${asset.title} with a small discount and the message: ${audience.messageAngle}`,
      `Create a ${asset.theme.toLowerCase()} gift set aimed at ${audience.name.toLowerCase()}.`
    ]
  };

  return variants[outputType].map((text) => ({
    text,
    rationale: groundedIn
  }));
}
