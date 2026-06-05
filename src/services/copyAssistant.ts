import { pairingStateLabels } from "../domain/experiments";
import type {
  AudienceCreativePairing,
  AudienceSegment,
  BrandProfile,
  CopyOutputType,
  CreativeAsset
} from "../types";

function getPairingRationale(pairing?: AudienceCreativePairing) {
  if (!pairing) {
    return "";
  }

  if (pairing.state === "untested") {
    return " This is an untested audience and creative gap, so use the copy as a learning test.";
  }

  return ` Pairing signal: ${pairingStateLabels[pairing.state].toLowerCase()} based on ${pairing.primaryExperiment?.title ?? "linked experiment evidence"}.`;
}

export function generateCopySet(input: {
  audience: AudienceSegment;
  asset: CreativeAsset;
  brand: BrandProfile;
  pairing?: AudienceCreativePairing;
}) {
  const { audience, asset, brand, pairing } = input;
  const tone = brand.tone.slice(0, 2).join(" and ");

  return {
    caption: `${asset.product} for ${audience.name.toLowerCase()}: ${audience.messageAngle}`,
    emailSubject: `${asset.theme}: a ${tone} note from ${brand.name}`,
    paidHook: `For ${audience.name.toLowerCase()} who want ${audience.proofPoints[0].toLowerCase()}, start with ${asset.title}.`,
    rationale: `Grounded in ${audience.name}, ${asset.title}, and the ${asset.theme} creative theme.${getPairingRationale(pairing)}`
  };
}

export function generateCopyVariants(input: {
  audience: AudienceSegment;
  asset: CreativeAsset;
  brand: BrandProfile;
  outputType: CopyOutputType;
  pairing?: AudienceCreativePairing;
}): Array<{ text: string; rationale: string }> {
  const { audience, asset, brand, outputType, pairing } = input;
  const base = generateCopySet({ audience, asset, brand, pairing });
  const groundedIn = `Grounded in ${audience.name}, ${asset.title}, and ${asset.theme}.${getPairingRationale(pairing)}`;
  const gapLead =
    pairing?.state === "untested"
      ? `Test the gap: ${audience.messageAngle}`
      : base.caption;

  const variants: Record<CopyOutputType, string[]> = {
    caption: [
      gapLead,
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
