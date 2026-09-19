import dotenv from 'dotenv';

// Load .env configuration
dotenv.config();

export interface ServerEnv {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  geminiApiKey?: string;
  openaiApiKey?: string;
  aiModel: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
}

export const env: ServerEnv = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY?.trim() || undefined,
  openaiApiKey: process.env.OPENAI_API_KEY?.trim() || undefined,
  aiModel: process.env.AI_MODEL?.trim() || 'gemini-2.5-flash',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
};

export interface AiProviderStatus {
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

/**
 * Returns safe public AI status without leaking private API keys to the client.
 */
export function getAiProviderStatus(): AiProviderStatus {
  let activeProvider: 'gemini' | 'openai' | 'pedagogical-engine' = 'pedagogical-engine';
  let model = 'pedagogical-rules-v1';

  if (env.geminiApiKey) {
    activeProvider = 'gemini';
    model = env.aiModel || 'gemini-2.5-flash';
  } else if (env.openaiApiKey) {
    activeProvider = 'openai';
    model = env.aiModel.includes('gpt') ? env.aiModel : 'gpt-4o-mini';
  }

  return {
    activeProvider,
    model,
    isExternalConfigured: Boolean(env.geminiApiKey || env.openaiApiKey),
    features: {
      incrementalHints: true,
      codeExplanation: true,
      errorReview: true,
      interactiveChat: true,
    },
  };
}
