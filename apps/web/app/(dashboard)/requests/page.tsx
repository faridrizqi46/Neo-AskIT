'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { requests as requestsApi } from '../../../lib/api';
import { AppShell } from '../../../components/layout/AppShell';

interface Request {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
  pending: { label: 'Pending', color: 'bg-slate-100 text-slate-600' },
  resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700' },
  closed: { label: 'Closed', color: 'bg-slate-100 text-slate-500' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'High', color: 'bg-amber-100 text-amber-700' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  useEffect(() => {
    async function load() {
      try {
        const data = await requestsApi.list();
        setRequests(data.requests || []);
      } catch (error) {
        console.error('Failed to load requests:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'open') return ['open', 'in_progress', 'pending'].includes(r.status);
    if (filter === 'resolved') return ['resolved', 'closed'].includes(r.status);
    return true;
  });

  const openCount = requests.filter((r) => ['open', 'in_progress', 'pending'].includes(r.status)).length;
  const resolvedCount = requests.filter((r) => ['resolved', 'closed'].includes(r.status)).length;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Requests</h1>
            <p className="text-sm text-slate-500 mt-1">Track and manage your IT support requests</p>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 active:scale-[0.98] transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl border bg-white p-4 text-left transition-all duration-200 ${
              filter === 'all' ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500">Total</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
          </button>

          <button
            onClick={() => setFilter('open')}
            className={`rounded-xl border bg-white p-4 text-left transition-all duration-200 ${
              filter === 'open' ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500">Open</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{openCount}</p>
          </button>

          <button
            onClick={() => setFilter('resolved')}
            className={`rounded-xl border bg-white p-4 text-left transition-all duration-200 ${
              filter === 'resolved' ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500">Resolved</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{resolvedCount}</p>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No requests found</h3>
              <p className="text-sm text-slate-500 text-center mb-4">
                {filter === 'all'
                  ? "You haven't created any requests yet."
                  : `No ${filter === 'open' ? 'open' : 'resolved'} requests at the moment.`}
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Start a conversation
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRequests.map((request, index) => (
                <div
                  key={request.id}
                  className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 mb-1">{request.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{request.category}</span>
                        <span className="text-slate-300">•</span>
                        <span>{new Date(request.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityConfig[request.priority]?.color || 'bg-slate-100 text-slate-600'}`}>
                        {priorityConfig[request.priority]?.label || request.priority}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[request.status]?.color || 'bg-slate-100 text-slate-600'}`}>
                        {statusConfig[request.status]?.label || request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}