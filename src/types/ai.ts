export interface HintResponse {
  hintLevel: number;
  title: string;
  nudge: string;
  guidingQuestion: string;
  funAnalogy?: string;
  targetedArea?: string;
  pseudocodeClue?: string;
}

export interface ExplainResponse {
  summary: string;
  breakdown: Array<{
    codeSnippet: string;
    explanation: string;
    arcadeAnalogy?: string;
  }>;
  mentalModel: string;
  keyTakeaway: string;
}

export interface ReviewResponse {
  overallStatus: 'ready_to_clear' | 'needs_tweak' | 'stuck';
  praise: string;
  issues: Array<{
    severity: 'info' | 'warning' | 'error';
    description: string;
    lineHint?: string;
    suggestedInvestigation: string;
  }>;
  encouragingClosing: string;
}

export interface ChatResponse {
  message: string;
  quickPrompts: string[];
  mood: 'supportive' | 'celebratory' | 'curious' | 'brainstorming';
}

export interface AiStatus {
  activeProvider: 'gemini' | 'openai' | 'pedagogical-engine';
  model: string;
  isExternalConfigured: boolean;
  features: {
    incrementalHints: boolean;
    codeExplanation: boolean;
    errorReview: boolean;
    interactiveChat: boolean;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: number;
  mood?: 'supportive' | 'celebratory' | 'curious' | 'brainstorming';
}
