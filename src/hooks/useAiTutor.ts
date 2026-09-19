import { useState, useEffect, useCallback } from 'react';
import { aiApi } from '../api/ai.api';
import {
  HintResponse,
  ExplainResponse,
  ReviewResponse,
  ChatMessage,
  AiStatus,
} from '../types/ai';
import { soundEffects } from '../utils/soundEffects';

export function useAiTutor(currentLessonId: string) {
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const [unlockedHints, setUnlockedHints] = useState<Record<string, HintResponse[]>>({});
  const [currentLevelMap, setCurrentLevelMap] = useState<Record<string, number>>({});
  const [explanation, setExplanation] = useState<ExplainResponse | null>(null);
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'tutor',
      text: `Greetings, Adventurer! I am Pixel, your Arcade AI Tutor. 👾 Stuck on a bug, need an analogy, or want a hint? Click an action above or send me a message!`,
      timestamp: Date.now(),
      mood: 'supportive',
    },
  ]);

  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [isLoadingExplain, setIsLoadingExplain] = useState<boolean>(false);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(false);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [tutorError, setTutorError] = useState<string | null>(null);

  // Fetch AI status on boot
  useEffect(() => {
    aiApi
      .getStatus()
      .then(status => setAiStatus(status))
      .catch(() => {
        // Fallback default
        setAiStatus({
          activeProvider: 'pedagogical-engine',
          model: 'pedagogical-rules-v1',
          isExternalConfigured: false,
          features: {
            incrementalHints: true,
            codeExplanation: true,
            errorReview: true,
            interactiveChat: true,
          },
        });
      });
  }, []);

  const activeHints = unlockedHints[currentLessonId] || [];
  const currentHintLevel = currentLevelMap[currentLessonId] || 1;

  const requestNextHint = useCallback(
    async (params: {
      lessonId: string;
      lessonTitle: string;
      userCode: string;
      instructions: string;
      failedTest?: string;
      consoleLogs?: string[];
    }) => {
      setIsLoadingHint(true);
      setTutorError(null);
      soundEffects.playClick();

      try {
        const targetLevel = Math.min(3, activeHints.length + 1);
        const hint = await aiApi.getHint({
          ...params,
          currentHintLevel: targetLevel,
        });

        setUnlockedHints(prev => {
          const list = prev[params.lessonId] ? [...prev[params.lessonId]] : [];
          // Replace or push
          const existingIdx = list.findIndex(h => h.hintLevel === hint.hintLevel);
          if (existingIdx >= 0) {
            list[existingIdx] = hint;
          } else {
            list.push(hint);
          }
          return { ...prev, [params.lessonId]: list };
        });

        setCurrentLevelMap(prev => ({
          ...prev,
          [params.lessonId]: Math.min(3, targetLevel + 1),
        }));

        soundEffects.playCoin();
      } catch (err) {
        setTutorError((err as Error).message);
      } finally {
        setIsLoadingHint(false);
      }
    },
    [activeHints.length]
  );

  const requestExplanation = useCallback(
    async (params: {
      lessonId: string;
      lessonTitle: string;
      userCode: string;
      focusArea?: string;
    }) => {
      setIsLoadingExplain(true);
      setTutorError(null);
      soundEffects.playClick();

      try {
        const response = await aiApi.explainCode(params);
        setExplanation(response);
        soundEffects.playCoin();
      } catch (err) {
        setTutorError((err as Error).message);
      } finally {
        setIsLoadingExplain(false);
      }
    },
    []
  );

  const requestReview = useCallback(
    async (params: {
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
    }) => {
      setIsLoadingReview(true);
      setTutorError(null);
      soundEffects.playClick();

      try {
        const response = await aiApi.reviewCode(params);
        setReview(response);
        soundEffects.playCoin();
      } catch (err) {
        setTutorError((err as Error).message);
      } finally {
        setIsLoadingReview(false);
      }
    },
    []
  );

  const sendChatMessage = useCallback(
    async (
      userText: string,
      context: {
        lessonId: string;
        lessonTitle: string;
        userCode: string;
      }
    ) => {
      if (!userText.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userText.trim(),
        timestamp: Date.now(),
      };

      setChatMessages(prev => [...prev, userMsg]);
      setIsLoadingChat(true);
      setTutorError(null);
      soundEffects.playClick();

      try {
        const history = chatMessages.slice(-4).map(m => ({
          sender: m.sender,
          text: m.text,
        }));

        const response = await aiApi.chat({
          lessonId: context.lessonId,
          lessonTitle: context.lessonTitle,
          userCode: context.userCode,
          userMessage: userText.trim(),
          conversationHistory: history,
        });

        const tutorMsg: ChatMessage = {
          id: `tutor-${Date.now()}`,
          sender: 'tutor',
          text: response.message,
          timestamp: Date.now(),
          mood: response.mood,
        };

        setChatMessages(prev => [...prev, tutorMsg]);
        soundEffects.playCoin();
      } catch (err) {
        setTutorError((err as Error).message);
      } finally {
        setIsLoadingChat(false);
      }
    },
    [chatMessages]
  );

  const clearChat = useCallback(() => {
    setChatMessages([
      {
        id: 'welcome-reset',
        sender: 'tutor',
        text: 'Chat history cleared. What are you hacking on now?',
        timestamp: Date.now(),
        mood: 'supportive',
      },
    ]);
  }, []);

  return {
    aiStatus,
    activeHints,
    currentHintLevel,
    explanation,
    review,
    chatMessages,
    isLoadingHint,
    isLoadingExplain,
    isLoadingReview,
    isLoadingChat,
    tutorError,
    requestNextHint,
    requestExplanation,
    requestReview,
    sendChatMessage,
    clearChat,
  };
}
