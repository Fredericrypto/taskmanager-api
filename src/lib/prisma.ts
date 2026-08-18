import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Exibe as queries SQL no terminal (excelente para aprendizado)
});