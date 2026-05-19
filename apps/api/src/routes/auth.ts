import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { employeeRepo } from '../repositories/employee.repo';
import { AppError } from '../utils/logger';

interface LoginBody {
  employeeId: string;
  password: string;
}

interface RegisterBody {
  employeeId: string;
  email: string;
  name: string;
  department: string;
  password: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    const { employeeId, password } = request.body;

    const employee = await employeeRepo.findByEmployeeId(employeeId);
    if (!employee) {
      throw new AppError(401, 'Invalid credentials', 'AUTH_FAILED');
    }

    const isValid = await employeeRepo.verifyPassword(employee, password);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials', 'AUTH_FAILED');
    }

    const token = fastify.jwt.sign(
      {
        sub: employee.id,
        employeeId: employee.employeeId,
        email: employee.email,
        role: employee.role,
      },
      { expiresIn: '7d' }
    );

    return reply.send({
      token,
      user: {
        id: employee.id,
        employeeId: employee.employeeId,
        email: employee.email,
        name: employee.name,
        department: employee.department,
        role: employee.role,
      },
    });
  });

  fastify.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    const { employeeId, email, name, department, password } = request.body;

    const existing = await employeeRepo.findByEmployeeId(employeeId);
    if (existing) {
      throw new AppError(409, 'Employee ID already exists', 'DUPLICATE');
    }

    const existingEmail = await employeeRepo.findByEmail(email);
    if (existingEmail) {
      throw new AppError(409, 'Email already exists', 'DUPLICATE');
    }

    const employee = await employeeRepo.create({
      employeeId,
      email,
      name,
      department,
      passwordHash: password,
      role: 'employee',
    });

    return reply.status(201).send({
      id: employee.id,
      employeeId: employee.employeeId,
      email: employee.email,
      name: employee.name,
      department: employee.department,
      role: employee.role,
    });
  });

  fastify.post('/logout', async (request, reply) => {
    return reply.send({ success: true });
  });

  fastify.get('/me', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided', 'NO_TOKEN');
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = fastify.jwt.verify(token) as {
        sub: string;
        employeeId: string;
        email: string;
        role: string;
      };

      const employee = await employeeRepo.findById(decoded.sub);
      if (!employee) {
        throw new AppError(404, 'User not found', 'NOT_FOUND');
      }

      return reply.send({
        user: {
          id: employee.id,
          employeeId: employee.employeeId,
          email: employee.email,
          name: employee.name,
          department: employee.department,
          role: employee.role,
        },
      });
    } catch (err) {
      throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
    }
  });
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = request.server.jwt.verify(token) as {
      sub: string;
      employeeId: string;
      role: string;
    };
    request.user = decoded;
  } catch {
    throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
  }
}