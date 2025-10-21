'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';
import { revalidatePath } from 'next/cache';

const createAgentSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(4),
  defaultModel: z.string().min(2),
});

type CreateAgentInput = z.infer<typeof createAgentSchema>;

export async function createAgent(input: CreateAgentInput) {
  const parsed = createAgentSchema.parse(input);
  const workspaceId = await getCurrentWorkspaceId();
  const agent = await prisma.agent.create({
    data: {
      workspaceId,
      name: parsed.name,
      description: parsed.description,
      defaultModel: parsed.defaultModel,
      tools: [],
      memory: false,
      temperature: 0.7,
      topP: 1,
      maxTokens: 1024,
      versions: {
        create: {
          system: 'You are an assistant.',
          fewShots: [],
          safety: {},
          createdBy: 'system',
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      workspaceId,
      action: 'agent.created',
      actorId: 'system',
      actorName: 'System',
      metadata: { agentId: agent.id },
    },
  });

  revalidatePath('/agents');
}
