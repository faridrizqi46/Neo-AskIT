'use client';

import { useEffect, useState } from 'react';
import { requests as requestsApi } from '../../lib/api';

interface Request {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Requests</h1>
          <a href="/chat" className="text-sm text-primary hover:underline">
            New Request
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No requests yet</p>
            <a href="/chat" className="text-primary hover:underline">
              Start a conversation
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-card rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{request.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {request.category} • Created {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}