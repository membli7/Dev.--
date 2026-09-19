import { z } from 'zod';

// =============================================================================
// AI TUTOR REQUEST SCHEMAS
// =============================================================================

export const HintRequestSchema = z.object({
  lessonId: z.string().min(1),
  lessonTitle: z.string().min(1),
  userCode: z.string(),
  instructions: z.string().min(1),
  currentHintLevel: z.number().int().min(1).max(3).default(1),
  failedTest: z.string().optional(),
  consoleLogs: z.array(z.string()).optional(),
});

export type HintRequest = z.infer<typeof HintRequestSchema>;

export const ExplainRequestSchema = z.object({
  lessonId: z.string().min(1),
  lessonTitle: z.string().min(1),
  userCode: z.string().min(1, 'Please write some code before asking for an explanation!'),
  focusArea: z.string().optional(),
});

export type ExplainRequest = z.infer<typeof ExplainRequestSchema>;

export const ReviewRequestSchema = z.object({
  lessonId: z.string().min(1),
  lessonTitle: z.string().min(1),
  userCode: z.string(),
  instructions: z.string().min(1),
  testResults: z.array(
    z.object({
      name: z.string(),
      passed: z.boolean(),
      expected: z.string().optional(),
      actual: z.string().optional(),
      error: z.string().optional(),
    })
  ).optional(),
  errorMessage: z.string().optional(),
});

export type ReviewRequest = z.infer<typeof ReviewRequestSchema>;

export const ChatRequestSchema = z.object({
  lessonId: z.string().min(1),
  lessonTitle: z.string().min(1),
  userCode: z.string(),
  userMessage: z.string().min(1, 'Message cannot be empty'),
  conversationHistory: z.array(
    z.object({
      sender: z.enum(['user', 'tutor']),
      text: z.string(),
    })
  ).optional().default([]),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// =============================================================================
// AI TUTOR RESPONSE SCHEMAS (STRICT OUTPUT PARSING)
// =============================================================================

export const HintResponseSchema = z.object({
  hintLevel: z.number().int().min(1).max(3),
  title: z.string(),
  nudge: z.string(),
  guidingQuestion: z.string(),
  funAnalogy: z.string().optional(),
  targetedArea: z.string().optional(),
  pseudocodeClue: z.string().optional(),
});

export type HintResponse = z.infer<typeof HintResponseSchema>;

export const ExplainResponseSchema = z.object({
  summary: z.string(),
  breakdown: z.array(
    z.object({
      codeSnippet: z.string(),
      explanation: z.string(),
      arcadeAnalogy: z.string().optional(),
    })
  ),
  mentalModel: z.string(),
  keyTakeaway: z.string(),
});

export type ExplainResponse = z.infer<typeof ExplainResponseSchema>;

export const ReviewResponseSchema = z.object({
  overallStatus: z.enum(['ready_to_clear', 'needs_tweak', 'stuck']),
  praise: z.string(),
  issues: z.array(
    z.object({
      severity: z.enum(['info', 'warning', 'error']),
      description: z.string(),
      lineHint: z.string().optional(),
      suggestedInvestigation: z.string(),
    })
  ),
  encouragingClosing: z.string(),
});

export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;

export const ChatResponseSchema = z.object({
  message: z.string(),
  quickPrompts: z.array(z.string()),
  mood: z.enum(['supportive', 'celebratory', 'curious', 'brainstorming']),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
