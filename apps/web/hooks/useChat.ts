import { useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import { chat as chatApi, requests as requestsApi } from '../lib/api';

interface ActionButton {
  type: string;
  label: string;
  payload: {
    form?: {
      fields: Array<{
        name: string;
        label: string;
        type: string;
        required?: boolean;
        options?: string[];
        placeholder?: string;
      }>;
      submitLabel?: string;
    };
    ticket?: {
      title: string;
      description: string;
      priority: string;
      category: string;
    };
    escalate?: {
      reason: string;
    };
  };
}

export function useChat() {
  const {
    messages,
    sessionId,
    isLoading,
    currentIntent,
    pendingActions,
    activeForm,
    activeRequestId,
    currentTicketId,
    addMessage,
    setSessionId,
    setLoading,
    setCurrentIntent,
    setPendingActions,
    setActiveForm,
    setActiveRequestId,
    setCurrentTicketId,
    clear,
  } = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      addMessage({ content, type: 'user' });
      setLoading(true);

      try {
        const response = await chatApi.sendMessage(content, sessionId || undefined);

        if (response.sessionId && !sessionId) {
          setSessionId(response.sessionId);
        }

        addMessage({
          content: response.content,
          type: 'assistant',
          intent: response.intent,
          confidence: response.confidence,
        });
        
        // Set actions from response - add fallback for password_reset
        let actions = response.actions;
        if ((!actions || actions.length === 0) && response.intent === 'password_reset') {
          actions = [
            {
              type: 'form',
              label: '📝 Reset Password Form',
              payload: {
                form: {
                  fields: [
                    { name: 'email', label: 'Email Address', type: 'email', required: true },
                    { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
                  ],
                  submitLabel: 'Send Reset Link',
                },
              },
            },
          ];
        }
        
        if (actions && actions.length > 0) {
          setPendingActions(actions);
        }

        if (response.requestId) {
          setActiveRequestId(response.requestId);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        addMessage({
          content: `Sorry, I encountered an error: ${errorMessage}`,
          type: 'system',
        });
      } finally {
        setLoading(false);
      }
    },
    [sessionId, addMessage, setLoading, setSessionId, setCurrentIntent, setActiveForm, setActiveRequestId, setPendingActions]
  );

  const handleActionClick = useCallback(
    async (action: ActionButton) => {
      if (action.type === 'form' && action.payload.form) {
        setActiveForm(action.payload.form);
      } else if (action.type === 'ticket') {
        setLoading(true);
        try {
          const ticketData = action.payload.ticket;
          const newRequest = await requestsApi.create({
            title: ticketData.title,
            description: ticketData.description || '',
            priority: ticketData.priority as 'low' | 'medium' | 'high' | 'urgent',
            category: ticketData.category,
          });
          
          setActiveRequestId(newRequest.id);
          setCurrentTicketId(newRequest.id);
          
          const ticketNumber = newRequest.id.includes('-') 
            ? newRequest.id.split('-').pop() 
            : newRequest.id;
            
          addMessage({
            content: `Tiket #${ticketNumber} telah dibuat.\n\nJudul: ${ticketData.title}\nStatus: Open\n\nTim IT Support akan menghubungi Anda segera.`,
            type: 'assistant',
            intent: 'ticket_created',
            confidence: 1,
          });
        } catch (error) {
          console.error('Failed to create ticket:', error);
          addMessage({
            content: 'Gagal membuat tiket. Silakan coba lagi.',
            type: 'system',
          });
        } finally {
          setLoading(false);
        }
      }
    },
    [setLoading, setActiveForm, setActiveRequestId, setCurrentTicketId, addMessage]
  );

  const submitForm = useCallback(
    async (formData: Record<string, string>) => {
      if (!activeForm || !activeRequestId) return;

      setLoading(true);
      try {
        const result = await requestsApi.submitForm(activeRequestId, formData);
        
        const requestNumber = activeRequestId.includes('-') 
          ? activeRequestId.split('-').pop() 
          : activeRequestId;
          
        const eta = activeForm.fields.some(f => f.name === 'software_name') 
          ? '1-2 hari kerja' 
          : '15 menit';
          
        addMessage({
          content: `Permintaan berhasil dikirim!\n\nRequest ID: #${requestNumber}\nStatus: Diproses\nETA: ${eta}\n\nAnda akan menerima notifikasi melalui email.`,
          type: 'assistant',
          intent: 'request_submitted',
          confidence: 1,
        });

        setActiveForm(null);
      } catch (error) {
        console.error('Failed to submit form:', error);
        addMessage({
          content: 'Gagal mengirim permintaan. Silakan coba lagi.',
          type: 'system',
        });
      } finally {
        setLoading(false);
      }
    },
    [activeForm, activeRequestId, setLoading, addMessage, setActiveForm]
  );

  const resetChat = useCallback(() => {
    clear();
    setPendingActions([]);
  }, [clear]);

  return {
    messages,
    isLoading,
    currentIntent,
    pendingActions,
    activeForm,
    activeRequestId,
    currentTicketId,
    sendMessage,
    handleActionClick,
    submitForm,
    resetChat,
  };
}