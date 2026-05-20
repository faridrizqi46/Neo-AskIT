import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/logger';

interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}

const store: RateLimitStore = {};

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

function cleanupExpired() {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  }
}

export function rateLimit(request: FastifyRequest, reply: FastifyReply, next: () => void) {
  cleanupExpired();

  const ip = request.ip;
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / WINDOW_MS)}`;

  if (!store[key]) {
    store[key] = { count: 0, resetAt: now + WINDOW_MS };
  }

  store[key].count++;

  if (store[key].count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((store[key].resetAt - now) / 1000);
    reply.header('Retry-After', retryAfter);
    reply.header('X-RateLimit-Limit', MAX_REQUESTS);
    reply.header('X-RateLimit-Remaining', 0);
    throw new AppError(429, 'Too many requests', 'RATE_LIMITED');
  }

  reply.header('X-RateLimit-Limit', MAX_REQUESTS);
  reply.header('X-RateLimit-Remaining', MAX_REQUESTS - store[key].count);
  next();
}