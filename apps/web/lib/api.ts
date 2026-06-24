const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function api<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
  }

  return response.json();
}

export const auth = {
  login: (employeeId: string, password: string) =>
    api<{ token: string; user: any }>('/api/v1/auth/login', {
      method: 'POST',
      body: { employeeId, password },
    }),

  logout: () =>
    api('/api/v1/auth/logout', { method: 'POST' }),

  me: () =>
    api<{ user: any }>('/api/v1/auth/me'),
};

export const chat = {
  sendMessage: (content: string, sessionId?: string) =>
    api<any>('/api/v1/chat/message', {
      method: 'POST',
      body: { content, sessionId },
    }),

  classifyIntent: (content: string, history?: string[]) =>
    api<any>('/api/v1/chat/intent/classify', {
      method: 'POST',
      body: { content, history },
    }),

  getHistory: (sessionId: string) =>
    api<{ messages: any[] }>(`/api/v1/chat/history/${sessionId}`),
};

export const requests = {
  list: () => api<{ requests: any[] }>('/api/v1/requests'),
  get: (id: string) => api<any>(`/api/v1/requests/${id}`),
  create: (data: any) => api<any>('/api/v1/requests', { method: 'POST', body: data }),
  update: (id: string, data: any) => api<any>(`/api/v1/requests/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => api(`/api/v1/requests/${id}`, { method: 'DELETE' }),
  submitForm: (requestId: string, formData: Record<string, string>) =>
    api<any>(`/api/v1/requests/${requestId}/submit`, { method: 'POST', body: formData }),
};

export const policies = {
  list: () => api<{ policies: any[] }>('/api/v1/policies'),
  get: (id: string) => api<any>(`/api/v1/policies/${id}`),
  search: (q: string) => api<{ policies: any[] }>(`/api/v1/policies/search?q=${encodeURIComponent(q)}`),
  create: (data: any) => api<any>('/api/v1/policies', { method: 'POST', body: data }),
};