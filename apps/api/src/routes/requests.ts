import { FastifyInstance } from 'fastify';
import { requestRepo } from '../repositories/request.repo';
import { messageRepo } from '../repositories/message.repo';
import { actionService } from '../services/action.service';
import { authMiddleware } from './auth';
import { ActionType } from '@prisma/client';

interface AuthUser {
  sub: string;
  employeeId: string;
  role: string;
}

export async function requestsRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [authMiddleware] }, async (request, reply) => {
    const user = request.user as AuthUser;
    const { status, category } = request.query as { status?: string; category?: string };

    let requests;
    if (user.role === 'employee') {
      requests = await requestRepo.findByEmployeeId(user.sub);
    } else {
      requests = await requestRepo.list(status as any);
    }

    if (category) {
      requests = requests.filter((r) => r.category === category);
    }

    return reply.send({ requests });
  });

  fastify.get('/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as AuthUser;

    const requestData = await requestRepo.findById(id);
    if (!requestData) {
      return reply.status(404).send({ error: 'Request not found' });
    }

    if (user.role === 'employee' && requestData.employeeId !== user.sub) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    const messages = await messageRepo.findByRequestId(id);
    const actions = await actionService.findByRequestId(id);

    return reply.send({
      ...requestData,
      messages,
      actions,
    });
  });

  fastify.post('/', { preHandler: [authMiddleware] }, async (request, reply) => {
    const user = request.user as AuthUser;
    const data = request.body as {
      title?: string;
      category?: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      description?: string;
      intent?: string;
    };

    if (!data.title || !data.category) {
      return reply.status(400).send({ error: 'title and category are required' });
    }

    const newRequest = await requestRepo.create({
      employeeId: user.sub,
      title: data.title,
      category: data.category,
      priority: data.priority || 'medium',
      intent: data.intent,
    });

    if (data.description) {
      await messageRepo.create({
        requestId: newRequest.id,
        senderId: user.sub,
        content: data.description,
        messageType: 'user',
        metadata: {},
      });
    }

    return reply.status(201).send(newRequest);
  });

  fastify.patch('/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as AuthUser;
    const updates = request.body as {
      status?: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      resolution?: string;
      title?: string;
    };

    const existingRequest = await requestRepo.findById(id);
    if (!existingRequest) {
      return reply.status(404).send({ error: 'Request not found' });
    }

    if (user.role === 'employee' && existingRequest.employeeId !== user.sub) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    const updated = await requestRepo.update(id, {
      status: updates.status,
      priority: updates.priority,
      resolution: updates.resolution,
      title: updates.title,
    });

    return reply.send(updated);
  });

  fastify.post('/:id/submit', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as AuthUser;
    const formData = request.body as Record<string, string>;

    const existingRequest = await requestRepo.findById(id);
    if (!existingRequest) {
      return reply.status(404).send({ error: 'Request not found' });
    }

    if (user.role === 'employee' && existingRequest.employeeId !== user.sub) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    await messageRepo.create({
      requestId: id,
      senderId: user.sub,
      content: `Form submitted: ${JSON.stringify(formData)}`,
      messageType: 'user',
      metadata: { formData },
    });

    await requestRepo.update(id, { status: 'pending' });

    return reply.send({ success: true, message: 'Form submitted successfully' });
  });

  fastify.post('/:id/actions', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as AuthUser;
    const data = request.body as {
      actionType: ActionType;
      payload: Record<string, unknown>;
    };

    const existingRequest = await requestRepo.findById(id);
    if (!existingRequest) {
      return reply.status(404).send({ error: 'Request not found' });
    }

    if (user.role === 'employee' && existingRequest.employeeId !== user.sub) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    if (!data.actionType || !data.payload) {
      return reply.status(400).send({ error: 'actionType and payload are required' });
    }

    const action = await actionService.execute(id, data.actionType, data.payload as any);

    return reply.status(201).send(action);
  });

  fastify.post('/:id/resolve', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as AuthUser;
    const { resolution } = request.body as { resolution?: string };

    const existingRequest = await requestRepo.findById(id);
    if (!existingRequest) {
      return reply.status(404).send({ error: 'Request not found' });
    }

    if (user.role === 'employee' && existingRequest.employeeId !== user.sub) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    const resolved = await requestRepo.addResolution(id, resolution || '');

    return reply.send(resolved);
  });

  fastify.delete('/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user as AuthUser;

    const existingRequest = await requestRepo.findById(id);
    if (!existingRequest) {
      return reply.status(404).send({ error: 'Request not found' });
    }

    if (user.role !== 'admin' && existingRequest.employeeId !== user.sub) {
      return reply.status(403).send({ error: 'Access denied' });
    }

    await requestRepo.delete(id);
    return reply.status(204).send();
  });
}