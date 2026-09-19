import { env, getAiProviderStatus } from '../../config/env';
import { GeminiProvider } from './gemini.provider';
import { OpenAiProvider } from './openai.provider';
import { PedagogicalEngine } from './pedagogical.engine';
import {
  HintRequest,
  HintResponse,
  HintResponseSchema,
  ExplainRequest,
  ExplainResponse,
  ExplainResponseSchema,
  ReviewRequest,
  ReviewResponse,
  ReviewResponseSchema,
  ChatRequest,
  ChatResponse,
  ChatResponseSchema,
} from './schemas';
import {
  buildHintPrompt,
  buildExplainPrompt,
  buildReviewPrompt,
  buildChatPrompt,
} from './prompts';

export class AiService {
  private geminiProvider: GeminiProvider | null = null;
  private openaiProvider: OpenAiProvider | null = null;

  constructor() {
    if (env.geminiApiKey) {
      this.geminiProvider = new GeminiProvider(env.geminiApiKey, env.aiModel);
    }
    if (env.openaiApiKey) {
      this.openaiProvider = new OpenAiProvider(env.openaiApiKey, env.aiModel);
    }
  }

  /**
   * Request incremental Socratic hints (Levels 1, 2, or 3)
   */
  public async getHint(request: HintRequest): Promise<HintResponse> {
    const prompt = buildHintPrompt({
      lessonTitle: request.lessonTitle,
      instructions: request.instructions,
      userCode: request.userCode,
      hintLevel: request.currentHintLevel,
      failedTest: request.failedTest,
      consoleLogs: request.consoleLogs,
    });

    try {
      if (this.geminiProvider) {
        return await this.geminiProvider.generateStructured(prompt, HintResponseSchema);
      }
      if (this.openaiProvider) {
        return await this.openaiProvider.generateStructured(prompt, HintResponseSchema);
      }
    } catch (err) {
      console.warn('[AI Service] External provider failed for hint, falling back to Pedagogical Engine:', (err as Error).message);
    }

    // High-fidelity fallback
    return PedagogicalEngine.generateHint(request);
  }

  /**
   * Request step-by-step code explanation
   */
  public async explainCode(request: ExplainRequest): Promise<ExplainResponse> {
    const prompt = buildExplainPrompt({
      lessonTitle: request.lessonTitle,
      userCode: request.userCode,
      focusArea: request.focusArea,
    });

    try {
      if (this.geminiProvider) {
        return await this.geminiProvider.generateStructured(prompt, ExplainResponseSchema);
      }
      if (this.openaiProvider) {
        return await this.openaiProvider.generateStructured(prompt, ExplainResponseSchema);
      }
    } catch (err) {
      console.warn('[AI Service] External provider failed for explain, falling back to Pedagogical Engine:', (err as Error).message);
    }

    return PedagogicalEngine.explainCode(request);
  }

  /**
   * Request code review and bug diagnosis
   */
  public async reviewCode(request: ReviewRequest): Promise<ReviewResponse> {
    const prompt = buildReviewPrompt({
      lessonTitle: request.lessonTitle,
      instructions: request.instructions,
      userCode: request.userCode,
      testResults: request.testResults,
      errorMessage: request.errorMessage,
    });

    try {
      if (this.geminiProvider) {
        return await this.geminiProvider.generateStructured(prompt, ReviewResponseSchema);
      }
      if (this.openaiProvider) {
        return await this.openaiProvider.generateStructured(prompt, ReviewResponseSchema);
      }
    } catch (err) {
      console.warn('[AI Service] External provider failed for review, falling back to Pedagogical Engine:', (err as Error).message);
    }

    return PedagogicalEngine.reviewCode(request);
  }

  /**
   * Interactive chat with Pixel
   */
  public async chat(request: ChatRequest): Promise<ChatResponse> {
    const prompt = buildChatPrompt({
      lessonTitle: request.lessonTitle,
      userCode: request.userCode,
      userMessage: request.userMessage,
      conversationHistory: request.conversationHistory,
    });

    try {
      if (this.geminiProvider) {
        return await this.geminiProvider.generateStructured(prompt, ChatResponseSchema);
      }
      if (this.openaiProvider) {
        return await this.openaiProvider.generateStructured(prompt, ChatResponseSchema);
      }
    } catch (err) {
      console.warn('[AI Service] External provider failed for chat, falling back to Pedagogical Engine:', (err as Error).message);
    }

    return PedagogicalEngine.chat(request);
  }

  public getStatus() {
    return getAiProviderStatus();
  }
}

export const aiService = new AiService();
