# AI Trainer Dashboard

AI Trainer Dashboard is a multi-tenant Next.js application for building, training, and evaluating AI agents with OpenAI integrations.

## Features

- Agent builder with versioning and OpenAI tool configuration
- Dataset uploads (JSONL) and fine-tuning job tracking via BullMQ
- Chat with streaming responses and image generation
- Eval orchestration with basic scoring strategies
- Workspace-level usage analytics, settings, and audit logs
- Supabase authentication scaffolding and Prisma ORM with Postgres
- Internationalization (English and Persian) and dark mode
- Vitest unit tests and Playwright smoke test
- Dockerfile and docker-compose for local deployment

## Getting Started

1. Copy `.env.example` to `.env.local` and populate credentials for Supabase, Postgres, Redis, and OpenAI.
2. Install dependencies and generate the Prisma client:

```bash
npm install
npm run db:push
```

3. Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Testing

- `npm run lint`
- `npm run test`
- `npm run e2e`

## Deployment

The project targets Vercel. Ensure environment variables are configured and Supabase Row Level Security policies are applied as outlined in `prisma/schema.prisma`.
