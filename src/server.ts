import Fastify from 'fastify';
import { ZodError } from 'zod';
import { userRoutes } from './routes/users';
import { authRoutes } from './routes/auth';
import fastifyJwt from '@fastify/jwt';
import { taskRoutes } from './routes/tasks';
import { env } from './env';

const PORT = 3333;
const HOST = '0.0.0.0';

const app = Fastify({
  logger: true,
});

// Registra o plugin de JWT acessando a variável de ambiente
app.register(fastifyJwt, {
  secret: env.JWT_SECRET || 'secret-fallback-dev',
});

// Registra o plugin de rotas de usuários
app.register(userRoutes);
app.register(authRoutes);
app.register(taskRoutes);

app.get('/health', async (req, rep) => {
  return { status: 'ok', timeStamp: new Date().toISOString() };
});

// Handler global para tratamento de erros
app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação.',
      issues: error.format(),
    });
  }

  app.log.error(error);
  return reply.status(500).send({ message: 'Internal server error.' });
});

const start = async () => {
  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`🚀 HTTP Server running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();