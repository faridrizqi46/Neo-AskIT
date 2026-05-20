import { FastifyInstance } from 'fastify';
import { authRoutes } from './routes/auth';
import { chatRoutes } from './routes/chat';
import { requestsRoutes } from './routes/requests';
import { policiesRoutes } from './routes/policies';
import { adminRoutes } from './routes/admin';
import { rateLimit } from './middleware/rateLimit.middleware';

export async function app(fastify: FastifyInstance) {
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  fastify.addHook('preHandler', rateLimit);

  fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  fastify.register(chatRoutes, { prefix: '/api/v1/chat' });
  fastify.register(requestsRoutes, { prefix: '/api/v1/requests' });
  fastify.register(policiesRoutes, { prefix: '/api/v1/policies' });
  fastify.register(adminRoutes, { prefix: '/api/v1/admin' });
}