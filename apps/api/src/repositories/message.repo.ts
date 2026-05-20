import { PrismaClient, MessageType } from '@prisma/client';

const prisma = new PrismaClient();

interface MessageData {
  id: string;
  requestId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  metadata: any;
  createdAt: Date;
}

export const messageRepo = {
  async create(data: {
    requestId: string;
    senderId: string;
    content: string;
    messageType: MessageType;
    metadata?: Record<string, unknown>;
  }): Promise<MessageData> {
    return prisma.message.create({
      data: {
        requestId: data.requestId,
        senderId: data.senderId,
        content: data.content,
        messageType: data.messageType,
        metadata: (data.metadata || {}) as any,
      },
    });
  },

  async findById(id: string): Promise<MessageData | null> {
    return prisma.message.findUnique({
      where: { id },
    });
  },

  async findByRequestId(requestId: string): Promise<MessageData[]> {
    return prisma.message.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' },
    });
  },

  async findBySenderId(senderId: string): Promise<MessageData[]> {
    return prisma.message.findMany({
      where: { senderId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async update(id: string, data: { content?: string; metadata?: any }): Promise<MessageData> {
    return prisma.message.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<MessageData> {
    return prisma.message.delete({
      where: { id },
    });
  },

  async deleteByRequestId(requestId: string): Promise<{ count: number }> {
    const result = await prisma.message.deleteMany({
      where: { requestId },
    });
    return { count: result.count };
  },
};