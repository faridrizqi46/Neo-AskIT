import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import { chat as chatApi } from '../lib/api';

export function useChat() {
  const {
    messages,
    sessionId,
    isLoading,
    currentIntent,
    addMessage,
    setSessionId,
    setLoading,
    setCurrentIntent,
    clear,
  } = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      addMessage({ content, type: 'user' });
      setLoading(true);

      try {
        const response = await chatApi.sendMessage(content, sessionId || undefined);

        if (response.requestId && !sessionId) {
          setSessionId(response.requestId);
        }

        addMessage({
          content: response.content,
          type: 'assistant',
          intent: response.intent,
          confidence: response.confidence,
        });

        if (response.intent) {
          setCurrentIntent(response.intent);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        addMessage({
          content: 'Sorry, I encountered an error. Please try again.',
          type: 'system',
        });
      } finally {
        setLoading(false);
      }
    },
    [sessionId, addMessage, setLoading, setSessionId, setCurrentIntent]
  );

  const resetChat = useCallback(() => {
    clear();
  }, [clear]);

  return {
    messages,
    isLoading,
    currentIntent,
    sendMessage,
    resetChat,
  };
}