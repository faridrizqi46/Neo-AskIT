export interface Employee {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  department: string;
  role: 'employee' | 'support' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  id: string;
  employeeId: string;
  title: string;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  intent?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  content: string;
  messageType: 'user' | 'assistant' | 'system';
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface Policy {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
  embedding?: number[];
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  employeeId: string;
  context: Record<string, unknown>;
  lastIntent?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface IntentClassification {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
  suggestedActions: string[];
}

export interface ChatResponse {
  type: 'message' | 'intent' | 'action' | 'error';
  content: string;
  intent?: string;
  confidence?: number;
  actions?: Action[];
  requestId?: string;
  escalate?: boolean;
}

export interface Action {
  type: 'form' | 'redirect' | 'ticket' | 'notification' | 'escalate';
  fields?: FormField[];
  url?: string;
  payload?: Record<string, unknown>;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}