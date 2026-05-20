'use client';

import { ChatWindow } from '../../../components/chat/ChatWindow';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">AskIT Assistant</h1>
          <a href="/requests" className="text-sm text-muted-foreground hover:text-foreground">
            My Requests
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-card rounded-xl shadow-sm border h-[calc(100vh-12rem)]">
          <ChatWindow />
        </div>
      </main>
    </div>
  );
}