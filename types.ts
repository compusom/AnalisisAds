export enum Severity {
    CRITICAL = 'CRITICAL',
    RECOMMENDED = 'RECOMMENDED',
    GOOD_TO_KNOW = 'GOOD_TO_KNOW',
}

export interface RecommendationItem {
    severity: Severity;
    message: string;
}

export interface AdvantagePlusRecommendation {
    enhancement: string;
    applicable: 'ACTIVATE' | 'CAUTION';
    justification: string;
}

export interface PlacementSpecificSummary {
    placementId: string;
    summary: string[];
}

export type ChecklistItemSeverity = 'CRITICAL' | 'ACTIONABLE' | 'POSITIVE';

export interface ChecklistItem {
    severity: ChecklistItemSeverity;
    text: string;
}

export interface OverallConclusion {
    headline: string;
    checklist: ChecklistItem[];
}

export interface AnalysisResult {
    effectivenessScore: number;
    effectivenessJustification: string;
    clarityScore: number;
    clarityJustification: string;
    textToImageRatio: number;
    textToImageRatioJustification: string;
    funnelStage: 'TOFU' | 'MOFU' | 'BOFU' | 'Error' | 'N/A';
    funnelStageJustification: string;
    recommendations: RecommendationItem[];
    advantagePlusAnalysis: AdvantagePlusRecommendation[];
    placementSummaries: PlacementSpecificSummary[];
    overallConclusion: OverallConclusion;
}

export enum PlacementId {
    FB_FEED,
    FB_VIDEO_FEED,
    FB_STORIES,
    FB_MARKETPLACE,
    FB_REELS,
    IG_FEED,
    IG_STORIES,
    IG_REELS,
    IG_EXPLORE,
    MESSENGER_INBOX,
    MESSENGER_STORIES,
    AUDIENCE_NETWORK,
}

export type UiType = 'FEED' | 'STORIES' | 'REELS' | 'MARKETPLACE' | 'MESSENGER_INBOX' | 'GENERIC';
export type FormatGroup = 'SQUARE_LIKE' | 'VERTICAL';


export interface Placement {
    id: PlacementId;
    platform: 'Facebook' | 'Instagram' | 'Messenger' | 'Audience Network';
    name: string;
    uiType: UiType;
    group: FormatGroup;
    aspectRatios: string[];
    recommendedResolution: string;
    safeZone: {
        top: string;
        bottom: string;
        left?: string;
        right?: string;
    };
}

export interface Creative {
    file: File;
    url: string;
    type: 'image' | 'video';
    width: number;
    height: number;
    format: 'square' | 'vertical';
}

export type CreativeSet = {
    square: Creative | null;
    vertical: Creative | null;
};