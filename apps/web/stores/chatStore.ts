import { create } from 'zustand';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant' | 'system';
  createdAt: Date;
  intent?: string;
  confidence?: number;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

interface FormAction {
  fields: FormField[];
  submitLabel?: string;
}

interface PendingAction {
  type: string;
  label: string;
  payload: any;
}

interface ChatState {
  messages: ChatMessage[];
  sessionId: string | null;
  isLoading: boolean;
  currentIntent: string | null;
  pendingActions: PendingAction[];
  activeForm: FormAction | null;
  activeRequestId: string | null;
  currentTicketId: string | null;
  addMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setSessionId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setCurrentIntent: (intent: string | null) => void;
  setPendingActions: (actions: PendingAction[]) => void;
  setActiveForm: (form: FormAction | null) => void;
  setActiveRequestId: (id: string | null) => void;
  setCurrentTicketId: (id: string | null) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  currentIntent: null,
  pendingActions: [],
  activeForm: null,
  activeRequestId: null,
  currentTicketId: null,

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

  setPendingActions: (pendingActions) => set({ pendingActions }),

  setActiveForm: (activeForm) => set({ activeForm }),

  setActiveRequestId: (activeRequestId) => set({ activeRequestId }),

  setCurrentTicketId: (currentTicketId) => set({ currentTicketId }),

  clear: () =>
    set({
      messages: [],
      sessionId: null,
      isLoading: false,
      currentIntent: null,
      pendingActions: [],
      activeForm: null,
      activeRequestId: null,
      currentTicketId: null,
    }),
}));