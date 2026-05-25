'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '../../../hooks/useChat';
import { cn } from '../../../lib/utils';

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { messages, isLoading, currentIntent, pendingActions, activeForm, sendMessage, handleActionClick, submitForm, resetChat } = useChat();
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalFields, setModalFields] = useState<FormField[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show modal when activeForm changes
  useEffect(() => {
    if (activeForm && activeForm.fields) {
      setModalFields(activeForm.fields);
      setShowModal(true);
      setFormValues({});
    }
  }, [activeForm]);

  const handleFormChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(formValues);
    setShowModal(false);
    setFormValues({});
  };

  const closeModal = () => {
    setShowModal(false);
    setFormValues({});
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const content = input.trim();
    setInput('');
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const suggestedQuestions = [
    'How do I reset my password?',
    'I have trouble with my Wi-Fi connection',
    'How do I request new software?',
    'I cannot connect to my VPN',
    'I cannot print my document',
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">AskIT Assistant</h1>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {messages.length > 0 && (
                  <button
                    onClick={resetChat}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    New Chat
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>

            {currentIntent && (
              <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                <span className="text-xs font-medium text-blue-600">
                  Detected intent: {currentIntent.replace('_', ' ')}
                </span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">How can I help you today?</h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-md">
                    I can assist with IT requests, password resets, software installations,
                    policy questions, and more.
                  </p>
                  <div className="w-full max-w-md space-y-2">
                    <p className="text-xs text-slate-400 font-medium mb-2">Try asking:</p>
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 text-sm text-slate-700 hover:text-blue-700"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex animate-fade-in',
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
                          message.type === 'user'
                            ? 'bg-blue-500 text-white rounded-tr-md'
                            : message.type === 'system'
                            ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-md'
                            : 'bg-white border border-slate-200 rounded-tl-md'
                        )}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        {message.intent && message.type === 'assistant' && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                              {message.intent.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-400">
                              {Math.round((message.confidence || 0) * 100)}% confidence
                            </span>
                          </div>
                        )}
                        <p className={cn(
                          'text-xs mt-2 opacity-60',
                          message.type === 'user' ? 'text-white/70' : 'text-slate-400'
                        )}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-sm text-slate-500">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {pendingActions.length > 0 && !isLoading && (
                    <div className="flex flex-wrap gap-2 animate-fade-in">
                      {pendingActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-11 px-5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Simple Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Fill Form</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {modalFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label}
                </label>
                  {field.type === 'select' ? (
                    <select
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm font-medium"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}