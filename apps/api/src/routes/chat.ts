import { FastifyInstance } from 'fastify';
import { intentService } from '../services/intent.service';
import { aiService } from '../services/ai.service';
import { actionService } from '../services/action.service';
import { sessionRepo } from '../repositories/session.repo';
import { messageRepo } from '../repositories/message.repo';
import { requestRepo } from '../repositories/request.repo';
import { authMiddleware } from './auth';

interface AuthUser {
  sub: string;
  employeeId: string;
  role: string;
}

const HIGH_CONFIDENCE_THRESHOLD = 0.85;

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.post('/message', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { content, sessionId } = request.body as { content: string; sessionId?: string };
    const user = request.user as AuthUser;

    let activeSessionId: string;
    let activeRequestId: string | null = null;

    if (!sessionId) {
      const session = await sessionRepo.create({
        employeeId: user.sub,
        context: {},
      });
      activeSessionId = session.id;
    } else {
      const existingSession = await sessionRepo.findById(sessionId);
      if (!existingSession) {
        return reply.status(404).send({ error: 'Session not found' });
      }
      activeSessionId = sessionId;
    }

    const classification = await intentService.classify(content);
    await sessionRepo.updateLastIntent(activeSessionId, classification.intent);

    if (classification.confidence >= HIGH_CONFIDENCE_THRESHOLD && !activeRequestId) {
      const categoryMap: Record<string, string> = {
        password_reset: 'account',
        email_access: 'account',
        email_password: 'account',
        account_locked: 'account',
        vpn_setup: 'network',
        vpn_issue: 'network',
        wifi_issue: 'network',
        laptop_slow: 'hardware',
        laptop_wont_start: 'hardware',
        software_request: 'software',
        software_install: 'software',
        security_incident: 'security',
        permission_request: 'access',
      };

      const category = categoryMap[classification.intent] || 'general';

      const newRequest = await requestRepo.create({
        employeeId: user.sub,
        title: `${classification.intent.replace(/_/g, ' ')} - ${content.substring(0, 50)}`,
        category,
        priority: classification.intent === 'security_incident' ? 'urgent' : 'medium',
        intent: classification.intent,
      });
      activeRequestId = newRequest.id;
    }

    const suggestedActions = intentService.getSuggestedActions(classification.intent);
    const responseData = await aiService.generateResponse(classification.intent, { ...classification.entities, query: content });
    const { text: responseText, policies } = responseData;

    const actions = actionService.getActionsForIntent(classification.intent);

    if (activeRequestId) {
      await messageRepo.create({
        requestId: activeRequestId,
        senderId: user.sub,
        content,
        messageType: 'user',
        metadata: { intent: classification.intent, confidence: classification.confidence },
      });

      await messageRepo.create({
        requestId: activeRequestId,
        senderId: user.sub,
        content: responseText,
        messageType: 'assistant',
        metadata: { intent: classification.intent, confidence: classification.confidence, policies },
      });
    }

    return reply.send({
      type: 'message',
      content: responseText,
      intent: classification.intent,
      confidence: classification.confidence,
      sessionId: activeSessionId,
      requestId: activeRequestId,
      actions,
      policies,
      entities: classification.entities,
    });
  });

  fastify.post('/intent/classify', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { content, history } = request.body as { content: string; history?: string[] };

    const classification = await intentService.classify(content, history);

    return reply.send({
      intent: classification.intent,
      confidence: classification.confidence,
      entities: classification.entities,
      suggestedActions: intentService.getSuggestedActions(classification.intent),
    });
  });

  fastify.get('/history/:sessionId', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const user = request.user as AuthUser;

    const session = await sessionRepo.findById(sessionId);
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }

    if (session.employeeId !== user.sub && user.role === 'employee') {
      return reply.status(403).send({ error: 'Access denied' });
    }

    return reply.send({
      sessionId,
      lastIntent: session.lastIntent,
      context: session.context,
      createdAt: session.createdAt,
      messages: [],
    });
  });

  fastify.delete('/session/:sessionId', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const user = request.user as AuthUser;

    const session = await sessionRepo.findById(sessionId);
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }

    if (session.employeeId !== user.sub && user.role === 'employee') {
      return reply.status(403).send({ error: 'Access denied' });
    }

    await sessionRepo.delete(sessionId);
    return reply.send({ success: true });
  });
}