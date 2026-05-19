'use client';

import { useState } from 'react';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant' | 'system';
  createdAt: Date;
}

interface ChatWindowProps {
  sessionId?: string;
}

export function ChatWindow({ sessionId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      type: 'user',
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, content: input }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.content,
        type: 'assistant',
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border p-3"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}