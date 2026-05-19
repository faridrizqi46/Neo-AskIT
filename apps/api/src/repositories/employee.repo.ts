import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type EmployeeRole = 'employee' | 'support' | 'admin';

interface EmployeeData {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  department: string;
  role: EmployeeRole;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const employeeRepo = {
  async findByEmployeeId(employeeId: string): Promise<EmployeeData | null> {
    return prisma.employee.findUnique({
      where: { employeeId },
    });
  },

  async findById(id: string): Promise<EmployeeData | null> {
    return prisma.employee.findUnique({
      where: { id },
    });
  },

  async findByEmail(email: string): Promise<EmployeeData | null> {
    return prisma.employee.findUnique({
      where: { email },
    });
  },

  async create(data: {
    employeeId: string;
    email: string;
    name: string;
    department: string;
    passwordHash: string;
    role?: 'employee' | 'support' | 'admin';
  }): Promise<EmployeeData> {
    return prisma.employee.create({
      data: {
        employeeId: data.employeeId,
        email: data.email,
        name: data.name,
        department: data.department,
        passwordHash: data.passwordHash,
        role: data.role || 'employee',
      },
    });
  },

  async update(id: string, data: Partial<Omit<EmployeeData, 'id' | 'createdAt'>>): Promise<EmployeeData> {
    return prisma.employee.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<EmployeeData> {
    return prisma.employee.delete({
      where: { id },
    });
  },

  async list(): Promise<EmployeeData[]> {
    return prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async verifyPassword(employee: EmployeeData, password: string): Promise<boolean> {
    return employee.passwordHash === password;
  },
};