'use client';

import { useChat } from '../../hooks/useChat';

export function ChatWindow({ sessionId }: { sessionId?: string }) {
  const { messages, isLoading, sendMessage } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const content = input.value.trim();
    if (!content || isLoading) return;

    input.value = '';
    await sendMessage(content);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="flex justify-center">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-muted-foreground">Send a message to start chatting with AskIT</p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
              {message.intent && message.type === 'assistant' && (
                <div className="mt-2 text-xs opacity-70">
                  Intent: {message.intent} ({Math.round((message.confidence || 0) * 100)}% confidence)
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-4">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            name="message"
            placeholder="Type your message..."
            className="flex-1 rounded-lg border p-3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}