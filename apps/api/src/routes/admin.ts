import { FastifyInstance } from 'fastify';
import { employeeRepo } from '../repositories/employee.repo';
import { authMiddleware } from './auth';

export async function adminRoutes(fastify: FastifyInstance) {
  fastify.get('/employees', { preHandler: [authMiddleware] }, async (request, reply) => {
    const employees = await employeeRepo.list();
    return reply.send({
      employees: employees.map((e) => ({
        id: e.id,
        employeeId: e.employeeId,
        email: e.email,
        name: e.name,
        department: e.department,
        role: e.role,
        createdAt: e.createdAt,
      })),
    });
  });

  fastify.get('/employees/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const employee = await employeeRepo.findById(id);
    if (!employee) {
      return reply.status(404).send({ error: 'Employee not found' });
    }
    return reply.send({
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        email: employee.email,
        name: employee.name,
        department: employee.department,
        role: employee.role,
        createdAt: employee.createdAt,
      },
    });
  });

  fastify.patch('/employees/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as Record<string, unknown>;

    const allowedUpdates = ['name', 'department', 'role', 'passwordHash'];
    const filteredUpdates: Record<string, unknown> = {};

    for (const key of allowedUpdates) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return reply.status(400).send({ error: 'No valid fields to update' });
    }

    const employee = await employeeRepo.update(id, filteredUpdates);
    return reply.send({
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        email: employee.email,
        name: employee.name,
        department: employee.department,
        role: employee.role,
      },
    });
  });

  fastify.delete('/employees/:id', { preHandler: [authMiddleware] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const employee = await employeeRepo.delete(id);
      return reply.send({ success: true, deleted: employee.employeeId });
    } catch {
      return reply.status(404).send({ error: 'Employee not found' });
    }
  });

  fastify.get('/analytics', { preHandler: [authMiddleware] }, async (request, reply) => {
    return reply.send({
      totalRequests: 150,
      openRequests: 23,
      avgResolutionTime: '2.5 hours',
      topIntents: [
        { intent: 'password_reset', count: 45 },
        { intent: 'email_access', count: 32 },
        { intent: 'vpn_setup', count: 18 },
      ],
    });
  });

  fastify.get('/config', { preHandler: [authMiddleware] }, async (request, reply) => {
    return reply.send({
      aiModel: process.env.MINIMAX_MODEL || 'mimic-7',
      maxIntentConfidence: 0.85,
      rateLimitPerMinute: 100,
    });
  });
}