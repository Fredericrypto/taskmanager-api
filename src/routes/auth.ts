import { FastifyInstance } from 'fastify';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function authRoutes(app: FastifyInstance) {
  app.post('/sessions', async (request, reply) => {
    // 1. Valida o corpo da requisição
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    // 2. Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(400).send({ message: 'Credenciais inválidas.' });
    }

    // 3. Compara a senha enviada com o hash salvo no banco
    const doesPasswordMatch = await compare(password, user.password);

    if (!doesPasswordMatch) {
      return reply.status(400).send({ message: 'Credenciais inválidas.' });
    }

    // 4. Gera o token JWT guardando o ID do usuário como sub (subject)
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // Token válido por 7 dias
        },
      }
    );

    return reply.status(200).send({ token });
  });
}