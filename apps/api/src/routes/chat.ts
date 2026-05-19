import { FastifyInstance } from 'fastify';
import { intentService } from '../services/intent.service';
import { sessionRepo } from '../repositories/session.repo';
import { authMiddleware } from './auth';

interface AuthUser {
  sub: string;
  employeeId: string;
  role: string;
}

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.post('/message', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { content, sessionId } = request.body as { content: string; sessionId?: string };
    const user = request.user as AuthUser;

    let activeSessionId: string;

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

    const classification = intentService.classify(content);
    await sessionRepo.updateLastIntent(activeSessionId, classification.intent);

    const suggestedActions = intentService.getSuggestedActions(classification.intent);

    let responseText = 'I understand. How can I help you with IT support today?';

    switch (classification.intent) {
      case 'password_reset':
        responseText = 'I can help you reset your password. Please click the link below to start the password reset process.';
        break;
      case 'email_access':
        responseText = 'I can help you with your email access issue. Can you describe what happens when you try to sign in?';
        break;
      case 'vpn_setup':
        responseText = 'I can assist with VPN setup. Have you tried using the self-service VPN portal? I can guide you through the steps.';
        break;
      case 'laptop_issue':
        responseText = 'I see you\'re experiencing a laptop issue. Let me help you troubleshoot. What specific problem are you encountering?';
        break;
      case 'security_incident':
        responseText = 'This sounds like a security concern. Please provide more details so we can take appropriate action immediately.';
        break;
      default:
        responseText = 'I understand your request. Let me assist you with that.';
    }

    return reply.send({
      type: 'message',
      content: responseText,
      intent: classification.intent,
      confidence: classification.confidence,
      sessionId: activeSessionId,
      actions: suggestedActions.map((action) => ({
        type: action.includes('form') ? 'form' : 'redirect',
        label: action.replace(/_/g, ' '),
      })),
      entities: classification.entities,
    });
  });

  fastify.post('/intent/classify', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { content, history } = request.body as { content: string; history?: string[] };

    const fullContent = history ? [...history, content].join(' ') : content;
    const classification = intentService.classify(fullContent);

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