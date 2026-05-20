import { PrismaClient, ActionType } from '@prisma/client';

const prisma = new PrismaClient();

interface ActionData {
  id: string;
  requestId: string;
  actionType: ActionType;
  payload: Record<string, unknown> | Record<string, unknown>[];
  executedAt: Date;
}

interface ActionPayload {
  form?: {
    fields: Array<{
      name: string;
      label: string;
      type: 'text' | 'email' | 'password' | 'select' | 'checkbox';
      required?: boolean;
      options?: string[];
      placeholder?: string;
    }>;
    submitLabel?: string;
  };
  redirect?: {
    url: string;
    label: string;
    newTab?: boolean;
  };
  ticket?: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
  };
  notification?: {
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
  };
  escalate?: {
    reason: string;
    assignedTo?: string;
  };
}

export const actionService = {
  async create(
    requestId: string,
    actionType: ActionType,
    payload: ActionPayload
  ): Promise<ActionData> {
    const result = await prisma.action.create({
      data: {
        requestId,
        actionType,
        payload: payload as any,
      },
    });
    return {
      ...result,
      payload: result.payload as Record<string, unknown>,
    };
  },

  async findByRequestId(requestId: string): Promise<ActionData[]> {
    const results = await prisma.action.findMany({
      where: { requestId },
      orderBy: { executedAt: 'desc' },
    });
    return results.map((r) => ({
      ...r,
      payload: r.payload as Record<string, unknown>,
    }));
  },

  async execute(
    requestId: string,
    actionType: ActionType,
    payload: ActionPayload
  ): Promise<ActionData> {
    const action = await this.create(requestId, actionType, payload);

    switch (actionType) {
      case 'ticket':
        await prisma.request.update({
          where: { id: requestId },
          data: { status: 'in_progress' },
        });
        break;
      case 'escalate':
        await prisma.request.update({
          where: { id: requestId },
          data: { priority: 'urgent' },
        });
        break;
    }

    return action;
  },

  getActionsForIntent(intent: string): Array<{ type: ActionType; label: string; payload: ActionPayload }> {
    const actionMap: Record<string, Array<{ type: ActionType; label: string; payload: ActionPayload }>> = {
      password_reset: [
        {
          type: 'form',
          label: 'Reset Password',
          payload: {
            form: {
              fields: [
                { name: 'email', label: 'Email Address', type: 'email', required: true },
                { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
              ],
              submitLabel: 'Send Reset Link',
            },
          },
        },
        {
          type: 'redirect',
          label: 'Self-Service Portal',
          payload: {
            redirect: {
              url: '/portal/password-reset',
              label: 'Go to Password Reset Portal',
              newTab: true,
            },
          },
        },
      ],
      email_access: [
        {
          type: 'form',
          label: 'Check Email Status',
          payload: {
            form: {
              fields: [
                { name: 'email', label: 'Email Address', type: 'email', required: true },
              ],
              submitLabel: 'Check Status',
            },
          },
        },
        {
          type: 'ticket',
          label: 'Create Support Ticket',
          payload: {
            ticket: {
              title: 'Email Access Issue',
              description: '',
              priority: 'medium',
              category: 'account',
            },
          },
        },
      ],
      vpn_setup: [
        {
          type: 'redirect',
          label: 'Download VPN Client',
          payload: {
            redirect: {
              url: '/downloads/vpn-client',
              label: 'Download VPN Client',
              newTab: true,
            },
          },
        },
        {
          type: 'ticket',
          label: 'Request VPN Setup Help',
          payload: {
            ticket: {
              title: 'VPN Setup Request',
              description: '',
              priority: 'medium',
              category: 'network',
            },
          },
        },
      ],
      security_incident: [
        {
          type: 'escalate',
          label: 'Report to Security Team',
          payload: {
            escalate: {
              reason: 'Security incident reported by user',
            },
          },
        },
        {
          type: 'notification',
          label: 'Security Alert',
          payload: {
            notification: {
              message: 'Please do not click any suspicious links. Our security team has been notified.',
              type: 'warning',
            },
          },
        },
      ],
      general_inquiry: [
        {
          type: 'ticket',
          label: 'Create Support Ticket',
          payload: {
            ticket: {
              title: 'General IT Inquiry',
              description: '',
              priority: 'low',
              category: 'general',
            },
          },
        },
      ],
    };

    return actionMap[intent] || [
      {
        type: 'ticket',
        label: 'Create Support Ticket',
        payload: {
          ticket: {
            title: 'IT Support Request',
            description: '',
            priority: 'medium',
            category: 'general',
          },
        },
      },
    ];
  },
};