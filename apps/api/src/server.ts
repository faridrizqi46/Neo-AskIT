import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { app } from './app';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

async function start() {
  await server.register(cors, {
    origin: process.env.WEB_URL || 'http://localhost:3000',
    credentials: true,
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
  });

  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await server.register(app);

  await server.listen({
    port: 3001,
    host: '0.0.0.0',
  });

  console.log('AskIT API running at http://localhost:3001');
}

start().catch((err) => {
  server.log.error(err);
  process.exit(1);
});