import type {
  AudienceSegment,
  BrandProfile,
  Campaign,
  CreativeAsset,
  Experiment,
  MonthlySales,
  PlanMonth
} from "../types";

export const brandProfile: BrandProfile = {
  name: "Stokes Croft China",
  mission: "Fine bone china with a Bristol community pulse.",
  followers: 13200,
  physicalVsOnlineSalesRatio: 3,
  monthlyPaidBudget: 300,
  tone: ["local", "mischievous", "crafted", "community-minded"],
  constraints: [
    "One operator day per week",
    "Month 1 is audit and organic only",
    "Paid budget starts at GBP 300/month from month 2",
    "No heavy approval chain"
  ]
};

export const monthlySales: MonthlySales[] = [
  { month: "January", monthIndex: 1, previousYearRevenue: 900, currentRevenue: 1050, isSeasonalPeak: false },
  { month: "February", monthIndex: 2, previousYearRevenue: 760, currentRevenue: 880, isSeasonalPeak: false },
  { month: "March", monthIndex: 3, previousYearRevenue: 820, currentRevenue: 990, isSeasonalPeak: false },
  { month: "April", monthIndex: 4, previousYearRevenue: 740, currentRevenue: 930, isSeasonalPeak: false },
  { month: "May", monthIndex: 5, previousYearRevenue: 810, currentRevenue: 980, isSeasonalPeak: false },
  { month: "June", monthIndex: 6, previousYearRevenue: 800, currentRevenue: 1180, isSeasonalPeak: false },
  { month: "December", monthIndex: 12, previousYearRevenue: 6200, currentRevenue: 7100, isSeasonalPeak: true }
];

export const planMonths: PlanMonth[] = [
  {
    month: "June",
    phase: "Month 1",
    focus: "Audit analytics, map content assets, and identify first organic tests.",
    budget: 0,
    deliverables: ["Analytics baseline", "Audience map", "Organic test backlog"]
  },
  {
    month: "July",
    phase: "Month 2",
    focus: "Launch small paid tests against gift buyers and Bristol locals.",
    budget: 300,
    deliverables: ["Paid test setup", "First channel comparison", "Weekly result review"]
  },
  {
    month: "August",
    phase: "Month 3",
    focus: "Compare channels and decide whether the growth program is credible.",
    budget: 300,
    deliverables: ["Channel scorecard", "Stop or scale decisions", "3-month checkpoint"],
    checkpoint: "3-month review"
  },
  {
    month: "September",
    phase: "Month 4",
    focus: "Double down on the best audience and start autumn gift positioning.",
    budget: 300,
    deliverables: ["Scaled winner", "Autumn bundle test", "Email capture push"]
  },
  {
    month: "October",
    phase: "Month 5",
    focus: "Prepare seasonal creative and validate Christmas lead indicators.",
    budget: 300,
    deliverables: ["Seasonal creative set", "Gift guide test", "Retargeting audience"]
  },
  {
    month: "November",
    phase: "Month 6",
    focus: "Make the keep, scale, or pause decision before December demand.",
    budget: 300,
    deliverables: ["6-month report", "Scale recommendation", "December action queue"],
    checkpoint: "6-month decision"
  }
];

export const audiences: AudienceSegment[] = [
  {
    id: "aud-local",
    name: "Bristol locals",
    motivation: "They want objects that feel rooted in the city rather than anonymous homeware.",
    messageAngle: "Own a piece of Bristol that still works on the breakfast table.",
    channels: ["organic", "paid", "email"],
    proofPoints: ["Local identity", "Community interest company", "Shop discovery"]
  },
  {
    id: "aud-gift",
    name: "Gift buyers",
    motivation: "They need a memorable present with a story and a fast decision path.",
    messageAngle: "A useful gift with a better story than another bottle of wine.",
    channels: ["paid", "email"],
    proofPoints: ["Fine bone china", "Giftable price points", "Seasonal December strength"]
  },
  {
    id: "aud-collector",
    name: "Collectors",
    motivation: "They care about limited runs, makers, and completing a set over time.",
    messageAngle: "Build the shelf slowly; each piece carries its own bit of city lore.",
    channels: ["organic", "email"],
    proofPoints: ["Distinct designs", "Range depth", "Repeat purchases"]
  },
  {
    id: "aud-design",
    name: "Design and homeware shoppers",
    motivation: "They want home objects that feel distinctive but not novelty-only.",
    messageAngle: "Fine china for rooms that do not want to look like everyone else's.",
    channels: ["paid", "organic"],
    proofPoints: ["Visual library", "Product craft", "Home styling"]
  },
  {
    id: "aud-tourist",
    name: "Visitors and tourists",
    motivation: "They want a portable memory of Bristol that is not a throwaway souvenir.",
    messageAngle: "Take home something that survives the suitcase and the years.",
    channels: ["paid", "retail"],
    proofPoints: ["Physical shop", "Local place attachment", "Memorable object"]
  }
];

export const creativeAssets: CreativeAsset[] = [
  {
    id: "asset-mug-wall",
    title: "Stacked mug wall",
    product: "Fine bone china mugs",
    theme: "Bristol shelf energy",
    format: "photo",
    audienceFit: ["aud-local", "aud-design"],
    reuseNote: "Strong for grid posts, paid carousel covers, and email hero crops."
  },
  {
    id: "asset-gift-bundle",
    title: "Two mug gift bundle",
    product: "Gift bundle",
    theme: "Useful present with a local story",
    format: "bundle",
    audienceFit: ["aud-gift", "aud-tourist"],
    reuseNote: "Use for gift-buyer ads and pre-Christmas email capture."
  },
  {
    id: "asset-maker-caption",
    title: "Maker story caption",
    product: "China range",
    theme: "Made with civic mischief",
    format: "caption",
    audienceFit: ["aud-collector", "aud-local"],
    reuseNote: "Best for organic posts that deepen brand memory."
  },
  {
    id: "asset-gift-guide",
    title: "Bristol gift guide email",
    product: "Seasonal collection",
    theme: "December without panic",
    format: "email",
    audienceFit: ["aud-gift", "aud-tourist", "aud-design"],
    reuseNote: "Repurpose into paid captions and shop signage."
  }
];

export const campaigns: Campaign[] = [
  {
    id: "camp-audit",
    name: "Baseline and organic reset",
    month: "June",
    goal: "Find the strongest non-paid audience and content pattern.",
    channels: ["organic", "email"],
    audienceId: "aud-local",
    budget: 0,
    status: "active"
  },
  {
    id: "camp-gift",
    name: "Gift buyer paid test",
    month: "July",
    goal: "Measure whether paid social can convert gift intent outside December.",
    channels: ["paid", "email"],
    audienceId: "aud-gift",
    budget: 180,
    status: "planned"
  },
  {
    id: "camp-design",
    name: "Design shopper carousel",
    month: "August",
    goal: "Test whether styling-led creative pulls higher product page visits.",
    channels: ["paid", "organic"],
    audienceId: "aud-design",
    budget: 120,
    status: "review",
    checkpoint: "3-month review"
  }
];

export const experiments: Experiment[] = [
  {
    id: "exp-local-caption",
    title: "Local story caption sequence",
    hypothesis: "Posts that frame the products as Bristol objects will lift profile-to-shop clicks.",
    audienceId: "aud-local",
    channel: "organic",
    creativeAssetId: "asset-maker-caption",
    spend: 0,
    metricName: "Profile-to-shop clicks",
    metricValue: 68,
    targetValue: 55,
    status: "complete",
    confidence: "high",
    nextAction: "scale",
    resultNote: "Best organic response came from posts naming place and purpose."
  },
  {
    id: "exp-gift-bundle",
    title: "Two mug gift bundle",
    hypothesis: "A bundle with a clear gift frame will beat single-product ads.",
    audienceId: "aud-gift",
    channel: "paid",
    creativeAssetId: "asset-gift-bundle",
    spend: 96,
    metricName: "Add-to-cart rate",
    metricValue: 3.8,
    targetValue: 4.5,
    status: "running",
    confidence: "medium",
    nextAction: "iterate",
    resultNote: "Creative is attractive, but the offer needs a sharper price or occasion."
  },
  {
    id: "exp-design-carousel",
    title: "Home styling carousel",
    hypothesis: "Room-context product photography will convert design shoppers better than product-only shots.",
    audienceId: "aud-design",
    channel: "paid",
    creativeAssetId: "asset-mug-wall",
    spend: 74,
    metricName: "Product page visits",
    metricValue: 41,
    targetValue: 80,
    status: "complete",
    confidence: "low",
    nextAction: "stop",
    resultNote: "Weak click-through suggests the audience or first frame is wrong."
  },
  {
    id: "exp-tourist",
    title: "Visitor souvenir copy",
    hypothesis: "Tourist-facing copy can turn shop visitors into later online buyers.",
    audienceId: "aud-tourist",
    channel: "organic",
    creativeAssetId: "asset-gift-guide",
    spend: 0,
    metricName: "Email signups",
    metricValue: 0,
    targetValue: 40,
    status: "planned",
    confidence: "low",
    nextAction: "launch",
    resultNote: "Needs a simple QR/email capture path before it can be measured."
  }
];
