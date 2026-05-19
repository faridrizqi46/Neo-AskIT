import { create } from 'zustand';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant' | 'system';
  createdAt: Date;
  intent?: string;
  confidence?: number;
}

interface ChatState {
  messages: ChatMessage[];
  sessionId: string | null;
  isLoading: boolean;
  currentIntent: string | null;
  addMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setSessionId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setCurrentIntent: (intent: string | null) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  currentIntent: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        },
      ],
    })),

  setMessages: (messages) => set({ messages }),

  setSessionId: (sessionId) => set({ sessionId }),

  setLoading: (isLoading) => set({ isLoading }),

  setCurrentIntent: (currentIntent) => set({ currentIntent }),

  clear: () =>
    set({
      messages: [],
      sessionId: null,
      isLoading: false,
      currentIntent: null,
    }),
}));