# 🚀 TaskManager API

API RESTful para gerenciamento de tarefas pessoais, desenvolvida com Node.js, Fastify, TypeScript, Prisma ORM e PostgreSQL rodando via Docker.

## 🛠️ Tecnologias Utilizadas

- **Node.js** & **TypeScript**
- **Fastify** (framework web de alta performance)
- **Prisma ORM** (integração e migrations com banco de dados)
- **PostgreSQL** & **Docker / Docker Compose**
- **Zod** (validação de esquemas e variáveis de ambiente)
- **JWT (`@fastify/jwt`)** & **bcryptjs** (autenticação e hash de senhas)

## 📌 Funcionalidades

- [x] Cadastro de usuários com hash de senha seguro
- [x] Autenticação via JWT (`POST /sessions`)
- [x] CRUD completo de Tarefas (exige autenticação)
- [x] Busca e Paginação de tarefas (`GET /tasks?query=...&page=1`)
- [x] Alternância do status de conclusão (`PATCH /tasks/:id/toggle`)

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+)
- Docker e Docker Compose

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/taskmanager-api.git](https://github.com/SEU_USUARIO/taskmanager-api.git)
   cd taskmanager-api
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o `.env`:**
   ```bash
   cp .env.example .env
   ```

4. **Suba o banco de dados via Docker:**
   ```bash
   docker compose up -d
   ```

5. **Execute as Migrations do Prisma:**
   ```bash
   npx prisma migrate dev
   ```

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

A API estará disponível em `http://localhost:3333`.