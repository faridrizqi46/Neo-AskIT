import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SessionData {
  id: string;
  employeeId: string;
  context: Record<string, unknown>;
  lastIntent: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export const sessionRepo = {
  async create(data: {
    employeeId: string;
    context?: Record<string, unknown>;
  }): Promise<SessionData> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return prisma.session.create({
      data: {
        employeeId: data.employeeId,
        context: data.context || {},
        expiresAt,
      },
    });
  },

  async findById(id: string): Promise<SessionData | null> {
    return prisma.session.findUnique({
      where: { id },
    });
  },

  async findByEmployeeId(employeeId: string): Promise<SessionData[]> {
    return prisma.session.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateContext(id: string, context: Record<string, unknown>): Promise<SessionData> {
    return prisma.session.update({
      where: { id },
      data: {
        context,
        updatedAt: new Date(),
      },
    });
  },

  async updateLastIntent(id: string, intent: string): Promise<SessionData> {
    return prisma.session.update({
      where: { id },
      data: {
        lastIntent: intent,
        updatedAt: new Date(),
      },
    });
  },

  async delete(id: string): Promise<SessionData> {
    return prisma.session.delete({
      where: { id },
    });
  },

  async deleteExpired(): Promise<{ count: number }> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    return { count: result.count };
  },
};