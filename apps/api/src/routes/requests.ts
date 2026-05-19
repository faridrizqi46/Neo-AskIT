import { FastifyInstance } from 'fastify';

export async function requestsRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    return reply.send({
      requests: [
        {
          id: '1',
          title: 'Password reset request',
          status: 'open',
          priority: 'medium',
          category: 'account',
          createdAt: new Date().toISOString(),
        },
      ],
    });
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    return reply.send({
      id,
      title: 'Password reset request',
      status: 'open',
      priority: 'medium',
      category: 'account',
      messages: [],
    });
  });

  fastify.post('/', async (request, reply) => {
    const data = request.body as { title?: string; category?: string; priority?: string; description?: string };
    if (!data.title || !data.category) {
      return reply.status(400).send({ error: 'title and category are required' });
    }
    return reply.status(201).send({
      id: crypto.randomUUID(),
      title: data.title,
      category: data.category,
      priority: data.priority || 'medium',
      description: data.description,
      status: 'open',
      createdAt: new Date().toISOString(),
    });
  });

  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as Record<string, unknown>;
    return reply.send({ id, ...updates, updatedAt: new Date().toISOString() });
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    return reply.status(204).send();
  });
}