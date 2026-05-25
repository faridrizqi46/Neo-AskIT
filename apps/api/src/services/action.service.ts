import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ActionType = 'form' | 'redirect' | 'ticket' | 'notification' | 'escalate';

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
          label: '📝 Reset Password Form',
          payload: {
            form: {
              fields: [
                { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'your.email@company.com' },
                { name: 'employeeId', label: 'Employee ID', type: 'text', required: true, placeholder: 'EMP-0000' },
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
      software_request: [
        {
          type: 'form',
          label: '📄 Software Request Form',
          payload: {
            form: {
              fields: [
                { name: 'software_name', label: 'Software Name', type: 'text', required: true, placeholder: 'e.g., Adobe Creative Cloud' },
                { name: 'purpose', label: 'Purpose', type: 'select', required: true, options: ['Design', 'Development', '数据分析', 'Project Management', 'Lainnya'] },
                { name: 'manager', label: 'Manager Approval', type: 'text', required: true, placeholder: 'Nama manager Anda' },
                { name: 'justification', label: 'Business Justification', type: 'text', required: false, placeholder: 'Jelaskan kebutuhan bisnis...' },
              ],
              submitLabel: 'Send Request',
            },
          },
        },
      ],
      software_install: [
        {
          type: 'form',
          label: 'Software Installation Request',
          payload: {
            form: {
              fields: [
                { name: 'software_name', label: 'Software Name', type: 'text', required: true },
                { name: 'version', label: 'Version', type: 'text', required: false },
                { name: 'license_key', label: 'License Key (optional)', type: 'text', required: false },
              ],
              submitLabel: 'Submit Request',
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
      wifi_issue: [
        {
          type: 'ticket',
          label: '✅ Buat Tiket Support',
          payload: {
            ticket: {
              title: 'WiFi Connection Issue',
              description: 'User reported slow WiFi connection',
              priority: 'medium',
              category: 'network',
            },
          },
        },
      ],
      general_inquiry: [
        {
          type: 'ticket',
          label: '✅ Buat Tiket Support',
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