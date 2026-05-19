import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      sub: string;
      employeeId: string;
      role: string;
    };
  }
}