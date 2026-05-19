'use client';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant' | 'system';
  createdAt: Date;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg px-4 py-2 ${
              message.type === 'user'
                ? 'bg-primary text-primary-foreground'
                : message.type === 'system'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-muted'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <span className="text-xs opacity-70">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}