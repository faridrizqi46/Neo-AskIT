import { FastifyInstance } from 'fastify';

export async function policiesRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    return reply.send({
      policies: [
        {
          id: '1',
          title: 'Password Policy',
          content: 'Password must be at least 12 characters...',
          category: 'security',
          keywords: ['password', 'security'],
          isActive: true,
        },
      ],
    });
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    return reply.send({
      id,
      title: 'Password Policy',
      content: 'Password must be at least 12 characters...',
      category: 'security',
      keywords: ['password', 'security'],
      version: 1,
      isActive: true,
    });
  });

  fastify.get('/search', async (request, reply) => {
    const { q } = request.query as { q?: string };
    return reply.send({
      policies: q ? [{ id: '1', title: 'Password Policy', relevance: 0.95 }] : [],
    });
  });

  fastify.post('/', async (request, reply) => {
    const data = request.body as { title?: string; content?: string; category?: string; keywords?: string[] };
    if (!data.title || !data.content || !data.category) {
      return reply.status(400).send({ error: 'title, content, and category are required' });
    }
    return reply.status(201).send({
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      category: data.category,
      keywords: data.keywords || [],
      version: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  });

  fastify.post('/sync', async (request, reply) => {
    return reply.send({ synced: 0, total: 0 });
  });
}