import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyJwt } from '../middlewares/verify-jwt';
import nodeHttp = require('node:http');

export async function taskRoutes(app: FastifyInstance) {
  // Exige token autenticado em todas as rotas deste plugin
  app.addHook('onRequest', verifyJwt);

  // 1. Criar Tarefa
  app.post('/tasks', async (request, reply) => {
    const createTaskSchema = z.object({
      title: z.string().min(1, 'O título é obrigatório'),
      description: z.string().optional(),
    });

    const { title, description } = createTaskSchema.parse(request.body);
    const userId = request.user.sub;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return reply.status(201).send(task);
  });

    // 2. Listar Tarefas com Busca e Paginação
  app.get("/tasks", async (request, reply) => {
    const getTasksQuerySchema = z.object({
        query: z.string().optional(),
        page: z.coerce.number().min(1).default(1),
    });

    const { query, page } = getTasksQuerySchema.parse(request.query);
    const userId = request.user.sub;

    const tasks = await prisma.task.findMany({
        where: {
            userId,
            title: query ? { contains: query, mode: "insensitive" } : undefined,
        },
        take: 20,
        skip: (page - 1) * 20,
        orderBy: { createdAt: "desc" },
    });

    return reply.send({ tasks, page });
  });

  // 3. Alternar Status de Concluída / Não Concluída
  app.patch('/tasks/:id/toggle', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);
    const userId = request.user.sub;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return reply.status(404).send({ message: 'Tarefa não encontrada.' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });

    return reply.send(updatedTask);
  });

  // 4. Deletar Tarefa
  app.delete('/tasks/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);
    const userId = request.user.sub;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return reply.status(404).send({ message: 'Tarefa não encontrada.' });
    }

    await prisma.task.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
}