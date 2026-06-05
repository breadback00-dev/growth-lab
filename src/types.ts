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
export type PairingState = "winning" | "needsIteration" | "stopped" | "planned" | "untested";

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

export interface ExperimentDecision {
  id: string;
  experimentId: string;
  decision: NextAction;
  decidedAt: string;
  reasoning: string;
  nextExperimentIdea: string;
}

export interface AudienceCreativePairing {
  audienceId: string;
  creativeAssetId: string;
  state: PairingState;
  experiments: Experiment[];
  primaryExperiment?: Experiment;
  summary: string;
  nextStep: string;
}

export interface AudienceCreativeMatrixRow {
  audience: AudienceSegment;
  pairings: AudienceCreativePairing[];
}

export type BudgetScenarioStrategy = "evidence" | "learning";

export interface BudgetCandidateScore {
  experimentId: string;
  decision: NextAction;
  score: number;
  rationale: string;
}

export interface BudgetAllocation {
  experimentId: string;
  amount: number;
  score: number;
  estimatedContribution: number;
  rationale: string;
}

export interface BudgetScenario {
  id: BudgetScenarioStrategy;
  name: string;
  summary: string;
  budget: number;
  estimatedContribution: number;
  allocations: BudgetAllocation[];
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

export type CheckpointRecommendation = "scale" | "iterate" | "pause";

export interface CheckpointScorecard {
  phase: string;
  checkpoint: string;
  salesMonth: string;
  thresholdProgressPercent: number;
  currentRevenue: number;
  thresholdRevenue: number;
  organicSpend: number;
  paidSpend: number;
  organicExperiments: number;
  paidExperiments: number;
  decisionCounts: Record<NextAction, number>;
  recommendation: CheckpointRecommendation;
  summary: string;
}

export interface GrowthLabState {
  monthlySales: MonthlySales[];
  planMonths: PlanMonth[];
  experiments: Experiment[];
  experimentDecisions: ExperimentDecision[];
  weeklyActions: WeeklyAction[];
}
