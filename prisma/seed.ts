import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo',
    },
  });

  await prisma.agent.upsert({
    where: { id: 'seed-agent' },
    update: {},
    create: {
      id: 'seed-agent',
      workspaceId: workspace.id,
      name: 'Product Spec Assistant',
      description: 'Helps craft concise product requirement documents.',
      defaultModel: 'gpt-4.1-mini',
      temperature: 0.3,
      topP: 1,
      maxTokens: 1024,
      tools: ['image_generation'],
      memory: true,
      versions: {
        create: {
          system:
            'You are Product Spec Assistant, optimized for software product requirement drafting. Ask clarifying questions and output structured sections.',
          fewShots: [
            {
              role: 'user',
              content: 'Draft a feature spec for an in-app dark mode.',
              expected: '### Summary\nProvide context...'
            },
          ],
          safety: { allowedContent: ['productivity'] },
          createdBy: 'seed',
        },
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
