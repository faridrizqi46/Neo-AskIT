# AskIT - Intelligent IT Self-Service Assistant

## Technical Sprint Plan & Blueprint

---

## 1. Concept Overview

**AskIT** is an interactive, chat-based assistant that enables employees to access IT services through natural language conversations. The system leverages AI for intent classification, policy-aware response generation, and automated ticket resolution.

### Target Users
- **Employees**: Submit requests, get instant IT support, track resolutions
- **IT Support Staff**: Manage tickets, update knowledge base, handle escalations
- **IT Administrators**: Manage policies, view analytics, configure AI behavior

---

## 2. Tech Stack Recommendation

### Frontend
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | **Next.js 14** (App Router) | Server components, RSC, API routes |
| UI Library | **Shadcn/ui** + Radix | Accessible, customizable components |
| State | **Zustand** | Lightweight, TypeScript-first |
| Forms | **React Hook Form** + Zod | Schema validation |
| Chat | **Vercel AI SDK** | AI streaming integration |
| Styling | **Tailwind CSS** | Utility-first, consistent design |

### Backend
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Runtime | **Node.js 20 LTS** | Async performance, mature ecosystem |
| Framework | **Fastify** | Fast, low overhead, TypeScript support |
| ORM | **Prisma** | Type-safe queries, migrations, IDE support |
| Validation | **Zod** | Runtime schema validation |
| Auth | **Jose** (JWT) | Edge-ready, fast JWT operations |

### Database & Infrastructure
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Primary DB | **PostgreSQL 16** | Relational integrity, JSON support |
| Cache | **Redis** | Session, vector cache, rate limiting |
| AI Runtime | **MiniMax-M2.7 API** | Intent classification, response generation |
| Search | **PostgreSQL pg_vector** | Semantic policy search |
| Deployment | **Docker** | Consistent environments |

---

## 3. Database Schema

### Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Employee   │────<│  Request   │>────│   Policy    │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │
      │            ┌──────┴──────┐            │
      │            │             │            │
      │      ┌─────┴─────┐ ┌─────┴─────┐      │
      │      │  Message  │ │  Action   │      │
      │      └───────────┘ └───────────┘      │
      │                                       │
      │     ┌─────────────┐                   │
      └────>│  Session    │<──────────────────┘
            └─────────────┘
```

### Tables

#### `employees`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() |
| employee_id | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| name | VARCHAR(255) | NOT NULL |
| department | VARCHAR(100) | NOT NULL |
| role | ENUM('employee', 'support', 'admin') | DEFAULT 'employee' |
| created_at | TIMESTAMP | DEFAULT now() |
| updated_at | TIMESTAMP | DEFAULT now() |

#### `requests`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| employee_id | UUID | FK → employees.id |
| title | VARCHAR(500) | NOT NULL |
| status | ENUM | DEFAULT 'open' |
| priority | ENUM | DEFAULT 'medium' |
| category | VARCHAR(100) | NOT NULL |
| intent | VARCHAR(100) | NULLABLE |
| resolution | TEXT | NULLABLE |
| created_at | TIMESTAMP | DEFAULT now() |
| updated_at | TIMESTAMP | DEFAULT now() |
| resolved_at | TIMESTAMP | NULLABLE |

#### `messages`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| request_id | UUID | FK → requests.id |
| sender_id | UUID | FK → employees.id |
| content | TEXT | NOT NULL |
| message_type | ENUM('user', 'assistant', 'system') | NOT NULL |
| metadata | JSONB | DEFAULT '{}' |
| created_at | TIMESTAMP | DEFAULT now() |

#### `policies`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| title | VARCHAR(255) | NOT NULL |
| content | TEXT | NOT NULL |
| category | VARCHAR(100) | NOT NULL |
| keywords | VARCHAR[] | DEFAULT '{}' |
| embedding | VECTOR(1536) | NULLABLE |
| version | INT | DEFAULT 1 |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | DEFAULT now() |
| updated_at | TIMESTAMP | DEFAULT now() |

#### `actions`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| request_id | UUID | FK → requests.id |
| action_type | ENUM | NOT NULL |
| payload | JSONB | DEFAULT '{}' |
| executed_at | TIMESTAMP | DEFAULT now() |

#### `sessions`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| employee_id | UUID | FK → employees.id |
| context | JSONB | DEFAULT '{}' |
| last_intent | VARCHAR(100) | NULLABLE |
| created_at | TIMESTAMP | DEFAULT now() |
| updated_at | TIMESTAMP | DEFAULT now() |
| expires_at | TIMESTAMP | NOT NULL |

---

## 4. API Architecture (REST)

### Base URL Structure
```
/api/v1
├── /auth
│   ├── POST   /login
│   ├── POST   /logout
│   └── GET    /me
├── /chat
│   ├── POST   /message
│   ├── GET    /history/:sessionId
│   └── POST   /intent/classify
├── /requests
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /
│   ├── PATCH  /:id
│   └── DELETE /:id
├── /policies
│   ├── GET    /
│   ├── GET    /:id
│   ├── GET    /search
│   └── POST   /sync
├── /admin
│   ├── /employees
│   ├── /analytics
│   └── /config
└── /webhooks
    └── /internal
```

### Key Endpoints

#### `POST /api/v1/chat/message`
```json
Request:
{
  "sessionId": "uuid",
  "content": "I need to reset my password",
  "metadata": { "channel": "web" }
}

Response (Streaming):
{
  "type": "message",
  "content": "I'll help you reset your password...",
  "intent": "password_reset",
  "confidence": 0.94,
  "actions": [{ "type": "form", "fields": [...] }],
  "requestId": "uuid" | null
}
```

#### `POST /api/v1/chat/intent/classify`
```json
Request:
{
  "content": "I can't access my email",
  "history": ["I forgot my password"]
}

Response:
{
  "intent": "email_access_issue",
  "confidence": 0.87,
  "entities": { "service": "email" },
  "suggestedActions": ["reset_password", "check_account_status"]
}
```

---

## 5. AI Integration Strategy

### MiniMax-M2.7 Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Message                              │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Intent Classification Pipeline                  │
│  1. Preprocess: Normalize, extract entities                  │
│  2. Classify: MiniMax-M2.7 → Intent + Confidence             │
│  3. Route: Based on intent confidence thresholds             │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Response Generation Pipeline                     │
│                                                              │
│  High Confidence (>0.85):                                   │
│    → Direct response with action                            │
│                                                              │
│  Medium Confidence (0.60-0.85):                             │
│    → RAG: Search policies → Generate contextual response      │
│                                                              │
│  Low Confidence (<0.60):                                    │
│    → Escalate to human + create ticket                       │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Response Output                           │
│  { text, actions[], suggestedRequests[], escalte? }          │
└─────────────────────────────────────────────────────────────┘
```

### Intent Taxonomy (Initial)
| Category | Intents |
|----------|---------|
| Account | `password_reset`, `email_access`, `account_locked`, `profile_update` |
| Hardware | `laptop_issue`, `peripheral_setup`, `hardware_request` |
| Software | `software_install`, `license_request`, `update_request` |
| Network | `vpn_setup`, `wifi_issue`, `network_access` |
| Security | `security_incident`, `phishing_report`, `permission_request` |
| General | `faq`, `policy_inquiry`, `escalation` |

### Response Generation Prompts
- System prompt: Role-based IT assistant persona
- Context injection: Relevant policies, user history, recent tickets
- Output format: Structured JSON with text + actions

---

## 6. Development Sprints

### Sprint 1: Foundation (Week 1-2)
**Goal**: Core infrastructure and authentication

| Deliverable | Description |
|-------------|-------------|
| D1.1 | Project scaffolding with Next.js + Fastify + PostgreSQL |
| D1.2 | Employee authentication (JWT, login/logout) |
| D1.3 | Database schema + Prisma migrations |
| D1.4 | REST API shell with Fastify routes |
| D1.5 | Basic session management |
| D1.6 | Employee CRUD for admin |

**Definition of Done**:
- [ ] User can register/login
- [ ] Protected routes work
- [ ] Database migrations run successfully

---

### Sprint 2: Chat Core (Week 3-4)
**Goal**: Interactive chat interface and basic AI intent

| Deliverable | Description |
|-------------|-------------|
| D2.1 | Chat UI component with message history |
| D2.2 | Chat API endpoint (send/receive messages) |
| D2.3 | MiniMax-M2.7 intent classification integration |
| D2.4 | Request entity creation on intent match |
| D2.5 | Message persistence and history retrieval |
| D2.6 | Basic error handling and loading states |

**Definition of Done**:
- [ ] User can send messages and receive responses
- [ ] Intent is classified and logged
- [ ] Messages persist in database

---

### Sprint 3: Knowledge & Actions (Week 5-6)
**Goal**: Policy knowledge base and automated actions

| Deliverable | Description |
|-------------|-------------|
| D3.1 | Policies table with CRUD |
| D3.2 | Vector embeddings for semantic search |
| D3.3 | RAG pipeline: Retrieve relevant policies |
| D3.4 | Response generation with policy context |
| D3.5 | Action system: forms, redirects, tickets |
| D3.6 | Request management (view, update status) |

**Definition of Done**:
- [ ] Policies can be created/updated
- [ ] Relevant policies surface in chat
- [ ] Actions execute and create tickets

---

### Sprint 4: Polish & Admin (Week 7-8)
**Goal**: Admin dashboard, analytics, and production readiness

| Deliverable | Description |
|-------------|-------------|
| D4.1 | Admin dashboard: overview, metrics |
| D4.2 | Analytics: response times, top intents, resolutions |
| D4.3 | IT staff role: handle escalated tickets |
| D4.4 | Rate limiting and security hardening |
| D4.5 | Performance optimization (caching, indexing) |
| D4.6 | Deployment configuration (Docker, env vars) |

**Definition of Done**:
- [ ] Admin can view analytics
- [ ] IT staff can manage tickets
- [ ] System is production-configured

---

## 7. High-Risk Technical Decisions

| Risk | Impact | Mitigation |
|------|--------|------------|
| **AI Response Quality** | High | Implement confidence thresholds; always allow escalation; build feedback loop |
| **Intent Classification Accuracy** | High | Start with limited taxonomy; use RAG for edge cases; monitor and retrain |
| **Session Management at Scale** | Medium | Redis for session storage; implement TTL and cleanup |
| **Policy Search Relevance** | Medium | Use pg_vector with tuned similarity thresholds; hybrid search fallback |
| **Chat Latency** | Medium | Stream responses; cache common intents; optimize embeddings lookup |
| **Data Privacy** | High | Encrypt PII; implement data retention policies; audit logging |
| **Concurrent Request Handling** | Low | Fastify handles async well; Redis for rate limiting; connection pooling |

---

## 8. File Structure Recommendation

```
askIT/
├── apps/
│   ├── web/                      # Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/          # Auth layouts
│   │   │   │   ├── login/
│   │   │   │   └── logout/
│   │   │   ├── (dashboard)/      # Protected layouts
│   │   │   │   ├── chat/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── requests/
│   │   │   │   └── admin/
│   │   │   ├── api/              # API routes
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn components
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   └── MessageInput.tsx
│   │   │   └── admin/
│   │   ├── lib/
│   │   │   ├── api.ts           # API client
│   │   │   ├── auth.ts          # Auth utilities
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   └── useAuth.ts
│   │   ├── stores/
│   │   │   └── chatStore.ts
│   │   └── package.json
│   │
│   └── api/                      # Fastify backend
│       ├── src/
│       │   ├── app.ts           # Fastify instance
│       │   ├── server.ts        # Server entry
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── chat.ts
│       │   │   ├── requests.ts
│       │   │   ├── policies.ts
│       │   │   └── admin.ts
│       │   ├── services/
│       │   │   ├── ai.service.ts
│       │   │   ├── intent.service.ts
│       │   │   ├── policy.service.ts
│       │   │   └── action.service.ts
│       │   ├── repositories/
│       │   │   ├── employee.repo.ts
│       │   │   ├── request.repo.ts
│       │   │   └── policy.repo.ts
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   └── rateLimit.middleware.ts
│       │   ├── schemas/
│       │   │   ├── auth.schema.ts
│       │   │   ├── chat.schema.ts
│       │   │   └── index.ts
│       │   ├── types/
│       │   │   └── index.ts
│       │   └── utils/
│       │       ├── logger.ts
│       │       └── errors.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── tests/
│       └── package.json
│
├── packages/
│   ├── config/
│   │   ├── eslint/
│   │   └── typescript/
│   └── ui/                       # Shared UI components
│
├── docker/
│   ├── docker-compose.yml
│   ├── api.Dockerfile
│   └── web.Dockerfile
│
├── .env.example
├── .gitignore
├── README.md
├── turbo.json
└── package.json                  # Workspace root
```

---

## 9. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/askit

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# AI
MINIMAX_API_KEY=your-api-key
MINIMAX_MODEL=mimic-7

# App
API_URL=http://localhost:3001
WEB_URL=http://localhost:3000
NODE_ENV=development
```

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Intent Classification Accuracy | >85% |
| First-Contact Resolution | >60% |
| Average Response Time | <3 seconds |
| User Satisfaction Score | >4.0/5.0 |
| Ticket Deflection Rate | >70% |

---

*Document Version: 1.0*
*Last Updated: 2026-05-19*