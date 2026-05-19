import { PrismaClient, EmployeeRole, RequestStatus, Priority, MessageType, ActionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const employee = await prisma.employee.upsert({
    where: { employeeId: 'demo' },
    update: {},
    create: {
      employeeId: 'demo',
      email: 'demo@company.com',
      name: 'Demo User',
      department: 'Engineering',
      role: EmployeeRole.employee,
      passwordHash: 'demo123',
    },
  });

  console.log('Created employee:', employee.name);

  const policy = await prisma.policy.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Password Reset Policy',
      content: 'To reset your password: 1) Go to the self-service portal. 2) Click "Forgot Password". 3) Follow the email link. 4) Create a new password (min 12 chars, 1 uppercase, 1 number).',
      category: 'security',
      keywords: ['password', 'reset', 'security', 'account'],
      isActive: true,
    },
  });

  console.log('Created policy:', policy.title);

  const request = await prisma.request.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      employeeId: employee.id,
      title: 'Password Reset Request',
      status: RequestStatus.open,
      priority: Priority.medium,
      category: 'account',
      intent: 'password_reset',
    },
  });

  console.log('Created request:', request.title);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });