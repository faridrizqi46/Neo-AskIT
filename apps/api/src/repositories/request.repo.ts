import { PrismaClient, RequestStatus, Priority } from '@prisma/client';

const prisma = new PrismaClient();

interface RequestData {
  id: string;
  employeeId: string;
  title: string;
  status: RequestStatus;
  priority: Priority;
  category: string;
  intent: string | null;
  resolution: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
}

export const requestRepo = {
  async create(data: {
    employeeId: string;
    title: string;
    category: string;
    priority?: Priority;
    intent?: string;
  }): Promise<RequestData> {
    return prisma.request.create({
      data: {
        employeeId: data.employeeId,
        title: data.title,
        category: data.category,
        priority: data.priority || 'medium',
        intent: data.intent,
        status: 'open',
      },
    });
  },

  async findById(id: string): Promise<RequestData | null> {
    return prisma.request.findUnique({
      where: { id },
    });
  },

  async findByEmployeeId(employeeId: string): Promise<RequestData[]> {
    return prisma.request.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByIntent(intent: string): Promise<RequestData[]> {
    return prisma.request.findMany({
      where: { intent },
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: string, data: Partial<Pick<RequestData, 'status' | 'priority' | 'title' | 'resolution'>>): Promise<RequestData> {
    const updateData: Record<string, unknown> = { ...data };
    if (data.status === 'resolved' || data.status === 'closed') {
      updateData.resolvedAt = new Date();
    }
    return prisma.request.update({
      where: { id },
      data: updateData,
    });
  },

  async updateStatus(id: string, status: RequestStatus): Promise<RequestData> {
    const updateData: Record<string, unknown> = { status };
    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = new Date();
    }
    return prisma.request.update({
      where: { id },
      data: updateData,
    });
  },

  async addResolution(id: string, resolution: string): Promise<RequestData> {
    return prisma.request.update({
      where: { id },
      data: {
        resolution,
        status: 'resolved',
        resolvedAt: new Date(),
      },
    });
  },

  async delete(id: string): Promise<RequestData> {
    return prisma.request.delete({
      where: { id },
    });
  },

  async list(status?: RequestStatus): Promise<RequestData[]> {
    return prisma.request.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  },

  async countByStatus(): Promise<Record<RequestStatus, number>> {
    const counts = await prisma.request.groupBy({
      by: ['status'],
      _count: true,
    });
    return counts.reduce((acc, curr) => {
      acc[curr.status] = curr._count;
      return acc;
    }, {} as Record<RequestStatus, number>);
  },

  async getAnalytics(): Promise<{
    totalRequests: number;
    openRequests: number;
    avgResolutionTime: number | null;
    topIntents: { intent: string; count: number }[];
  }> {
    const [totalRequests, statusCounts, resolvedRequests] = await Promise.all([
      prisma.request.count(),
      this.countByStatus(),
      prisma.request.findMany({
        where: { resolvedAt: { not: null } },
        select: { createdAt: true, resolvedAt: true },
      }),
    ]);

    let avgResolutionTime: number | null = null;
    if (resolvedRequests.length > 0) {
      const totalMs = resolvedRequests.reduce((acc, r) => {
        return acc + (r.resolvedAt!.getTime() - r.createdAt.getTime());
      }, 0);
      avgResolutionTime = Math.round(totalMs / resolvedRequests.length / (1000 * 60 * 60) * 10) / 10;
    }

    const intentCounts = await prisma.request.groupBy({
      by: ['intent'],
      where: { intent: { not: null } },
      _count: true,
      orderBy: { _count: { intent: 'desc' } },
      take: 10,
    });

    const topIntents = intentCounts
      .filter((ic) => ic.intent !== null)
      .map((ic) => ({ intent: ic.intent!, count: ic._count }));

    return {
      totalRequests,
      openRequests: statusCounts.open || 0,
      avgResolutionTime,
      topIntents,
    };
  },

  async findEscalated(): Promise<RequestData[]> {
    return prisma.request.findMany({
      where: {
        OR: [
          { status: 'pending' },
          { intent: 'escalate' },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async assignToSupport(requestId: string, supportId: string): Promise<RequestData> {
    return prisma.request.update({
      where: { id: requestId },
      data: {
        status: 'in_progress',
      },
    });
  },
};