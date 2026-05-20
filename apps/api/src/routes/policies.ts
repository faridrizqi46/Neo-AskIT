import { FastifyInstance } from 'fastify';
import { policyService } from '../services/policy.service';
import { policyRepo } from '../repositories/policy.repo';
import { authMiddleware } from './auth';

export async function policiesRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    const { category } = request.query as { category?: string };

    const policies = category
      ? await policyRepo.findByCategory(category)
      : await policyRepo.findActive();

    return reply.send({ policies });
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const policy = await policyRepo.findById(id);
    if (!policy) {
      return reply.status(404).send({ error: 'Policy not found' });
    }

    return reply.send(policy);
  });

  fastify.get('/search', async (request, reply) => {
    const { q, intent } = request.query as { q?: string; intent?: string };

    if (!q && !intent) {
      return reply.send({ policies: [] });
    }

    const query = q || intent || '';
    const relevantPolicies = await policyService.retrieveRelevantPolicies(query, intent || 'general_inquiry');

    return reply.send({
      policies: relevantPolicies.map((p) => ({
        ...p,
        relevance: p.relevance,
      })),
    });
  });

  fastify.post('/', { preHandler: [authMiddleware] }, async (request, reply) => {
    const data = request.body as {
      title: string;
      content: string;
      category: string;
      keywords?: string[];
    };

    if (!data.title || !data.content || !data.category) {
      return reply.status(400).send({ error: 'title, content, and category are required' });
    }

    const policy = await policyService.createPolicy(data);
    return reply.status(201).send(policy);
  });

  fastify.patch('/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as Partial<{
      title: string;
      content: string;
      category: string;
      keywords: string[];
      isActive: boolean;
    }>;

    const policy = await policyService.updatePolicy(id, data);
    if (!policy) {
      return reply.status(404).send({ error: 'Policy not found' });
    }

    return reply.send(policy);
  });

  fastify.delete('/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const existing = await policyRepo.findById(id);
    if (!existing) {
      return reply.status(404).send({ error: 'Policy not found' });
    }

    await policyRepo.softDelete(id);
    return reply.status(204).send();
  });

  fastify.post('/sync', { preHandler: [authMiddleware] }, async (request, reply) => {
    const result = await policyService.syncEmbeddings();
    return reply.send(result);
  });
}