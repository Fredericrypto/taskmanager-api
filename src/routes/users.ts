import { FastifyInstance } from 'fastify';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    // 1. Esquema de validação do corpo da requisição usando Zod
    const createUserSchema = z.object({
      name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
      email: z.string().email('E-mail inválido'),
      password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    });

    // 2. Valida os dados recebidos na requisição
    const { name, email, password } = createUserSchema.parse(request.body);

    // 3. Verifica se o e-mail já está cadastrado
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      return reply.status(409).send({ message: 'E-mail já cadastrado.' });
    }

    // 4. Criptografa a senha com custo de hash (salt) igual a 6
    const passwordHash = await hash(password, 6);

    // 5. Salva o novo usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    // 6. Retorna a resposta sem expor a senha criptografada
    return reply.status(201).send({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  });
}