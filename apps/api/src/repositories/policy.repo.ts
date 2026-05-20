import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PolicyData {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const policyRepo = {
  async create(data: {
    title: string;
    content: string;
    category: string;
    keywords?: string[];
  }): Promise<PolicyData> {
    return prisma.policy.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        keywords: data.keywords || [],
      },
    });
  },

  async findById(id: string): Promise<PolicyData | null> {
    return prisma.policy.findUnique({
      where: { id },
    });
  },

  async findByCategory(category: string): Promise<PolicyData[]> {
    return prisma.policy.findMany({
      where: { category, isActive: true },
      orderBy: { version: 'desc' },
    });
  },

  async findActive(): Promise<PolicyData[]> {
    return prisma.policy.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async searchByKeywords(keywords: string[]): Promise<PolicyData[]> {
    return prisma.policy.findMany({
      where: {
        isActive: true,
        OR: keywords.map((kw) => ({
          keywords: { has: kw.toLowerCase() },
        })),
      },
    });
  },

  async update(
    id: string,
    data: Partial<Pick<PolicyData, 'title' | 'content' | 'category' | 'keywords' | 'isActive'>>
  ): Promise<PolicyData | null> {
    const policy = await prisma.policy.findUnique({ where: { id } });
    if (!policy) return null;

    return prisma.policy.update({
      where: { id },
      data: {
        ...data,
        version: policy.version + 1,
      },
    });
  },

  async delete(id: string): Promise<PolicyData | null> {
    try {
      return await prisma.policy.delete({
        where: { id },
      });
    } catch {
      return null;
    }
  },

  async softDelete(id: string): Promise<PolicyData | null> {
    return prisma.policy.update({
      where: { id },
      data: { isActive: false },
    });
  },

  async list(includeInactive = false): Promise<PolicyData[]> {
    return prisma.policy.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async countByCategory(): Promise<Record<string, number>> {
    const counts = await prisma.policy.groupBy({
      by: ['category'],
      _count: true,
      where: { isActive: true },
    });
    return counts.reduce((acc, curr) => {
      acc[curr.category] = curr._count;
      return acc;
    }, {} as Record<string, number>);
  },
};