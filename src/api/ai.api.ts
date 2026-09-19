import { apiClient } from './client';
import {
  HintResponse,
  ExplainResponse,
  ReviewResponse,
  ChatResponse,
  AiStatus,
} from '../types/ai';

export const aiApi = {
  getStatus: () => apiClient<AiStatus>('/api/ai/status'),

  getHint: (params: {
    lessonId: string;
    lessonTitle: string;
    userCode: string;
    instructions: string;
    currentHintLevel: number;
    failedTest?: string;
    consoleLogs?: string[];
  }) =>
    apiClient<HintResponse>('/api/ai/hint', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  explainCode: (params: {
    lessonId: string;
    lessonTitle: string;
    userCode: string;
    focusArea?: string;
  }) =>
    apiClient<ExplainResponse>('/api/ai/explain', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  reviewCode: (params: {
    lessonId: string;
    lessonTitle: string;
    userCode: string;
    instructions: string;
    testResults?: Array<{
      name: string;
      passed: boolean;
      expected?: string;
      actual?: string;
      error?: string;
    }>;
    errorMessage?: string;
  }) =>
    apiClient<ReviewResponse>('/api/ai/review', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  chat: (params: {
    lessonId: string;
    lessonTitle: string;
    userCode: string;
    userMessage: string;
    conversationHistory?: Array<{ sender: 'user' | 'tutor'; text: string }>;
  }) =>
    apiClient<ChatResponse>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
};
