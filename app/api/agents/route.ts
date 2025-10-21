import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

const createAgentSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  system: z.string().default('You are an assistant.'),
  fewShots: z.array(z.any()).default([]),
  safety: z.record(z.any()).default({}),
  defaultModel: z.string().min(2),
  temperature: z.number().min(0).max(2).default(0.7),
  topP: z.number().min(0).max(1).default(1),
  maxTokens: z.number().min(32).max(4000).default(1024),
  tools: z.array(z.string()).default([]),
  memory: z.boolean().default(false),
});

export async function GET() {
  const workspaceId = await getCurrentWorkspaceId();
  const agents = await prisma.agent.findMany({ where: { workspaceId }, include: { versions: true } });
  return NextResponse.json({ agents });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createAgentSchema.parse(body);
  const workspaceId = await getCurrentWorkspaceId();

  const agent = await prisma.agent.create({
    data: {
      workspaceId,
      name: parsed.name,
      description: parsed.description,
      defaultModel: parsed.defaultModel,
      temperature: parsed.temperature,
      topP: parsed.topP,
      maxTokens: parsed.maxTokens,
      tools: parsed.tools,
      memory: parsed.memory,
      versions: {
        create: {
          system: parsed.system,
          fewShots: parsed.fewShots,
          safety: parsed.safety,
          createdBy: 'api',
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      workspaceId,
      action: 'agent.created',
      actorId: 'api',
      actorName: 'API',
      metadata: { agentId: agent.id },
    },
  });

  return NextResponse.json({ agent }, { status: 201 });
}
