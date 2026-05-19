import { z } from 'zod';

export const loginSchema = {
  body: z.object({
    employeeId: z.string().min(1),
    password: z.string().min(1),
  }),
  response: {
    200: z.object({
      token: z.string(),
      user: z.object({
        employeeId: z.string(),
        email: z.string(),
        name: z.string(),
        department: z.string(),
        role: z.enum(['employee', 'support', 'admin']),
      }),
    }),
  },
};

export const logoutSchema = {
  response: {
    200: z.object({
      success: z.boolean(),
    }),
  },
};

export const meSchema = {
  response: {
    200: z.object({
      user: z.object({
        sub: z.string(),
        role: z.string(),
      }),
    }),
  },
};