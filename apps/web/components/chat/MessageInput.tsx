'use client';

import { useState } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
        className="flex-1 rounded-lg border bg-background px-4 py-3"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}