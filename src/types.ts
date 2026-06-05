export type PageId =
  | "dashboard"
  | "plan"
  | "experiments"
  | "audiences"
  | "creative"
  | "recommendations";

export type ChannelType = "organic" | "paid" | "email" | "retail";
export type ExperimentStatus = "planned" | "running" | "complete";
export type NextAction = "launch" | "scale" | "iterate" | "stop";
export type Confidence = "low" | "medium" | "high";
export type CopyOutputType = "caption" | "emailSubject" | "paidHook" | "bundleIdea";
export type WeeklyActionStatus = "todo" | "done" | "snoozed";

export interface BrandProfile {
  name: string;
  mission: string;
  followers: number;
  physicalVsOnlineSalesRatio: number;
  monthlyPaidBudget: number;
  tone: string[];
  constraints: string[];
}

export interface MonthlySales {
  month: string;
  monthIndex: number;
  previousYearRevenue: number;
  currentRevenue: number;
  isSeasonalPeak: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  month: string;
  goal: string;
  channels: ChannelType[];
  audienceId: string;
  budget: number;
  status: "planned" | "active" | "review";
  checkpoint?: string;
}

export interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  audienceId: string;
  channel: ChannelType;
  creativeAssetId: string;
  spend: number;
  metricName: string;
  metricValue: number;
  targetValue: number;
  status: ExperimentStatus;
  confidence: Confidence;
  nextAction: NextAction;
  resultNote: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  motivation: string;
  messageAngle: string;
  channels: ChannelType[];
  proofPoints: string[];
}

export interface CreativeAsset {
  id: string;
  title: string;
  product: string;
  theme: string;
  format: "photo" | "caption" | "bundle" | "email";
  audienceFit: string[];
  reuseNote: string;
}

export interface Recommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  rationale: string;
  nextStep: string;
  linkedExperimentId?: string;
  linkedCampaignId?: string;
}

export interface WeeklyAction {
  id: string;
  recommendationId: string;
  priority: Recommendation["priority"];
  title: string;
  rationale: string;
  nextStep: string;
  status: WeeklyActionStatus;
  linkedExperimentId?: string;
  linkedCampaignId?: string;
}

export interface PlanMonth {
  month: string;
  phase: string;
  focus: string;
  budget: number;
  deliverables: string[];
  checkpoint?: string;
}

export interface GrowthLabState {
  monthlySales: MonthlySales[];
  planMonths: PlanMonth[];
  experiments: Experiment[];
  weeklyActions: WeeklyAction[];
}
