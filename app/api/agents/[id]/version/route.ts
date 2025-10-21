import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

const versionSchema = z.object({
  system: z.string().min(4),
  fewShots: z.array(z.object({ role: z.string(), content: z.string(), expected: z.string().optional() })).default([]),
  safety: z.record(z.any()).default({}),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = versionSchema.parse(body);
  const workspaceId = await getCurrentWorkspaceId();

  const agent = await prisma.agent.findFirst({ where: { id: params.id, workspaceId } });
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  const version = await prisma.agentVersion.create({
    data: {
      agentId: agent.id,
      system: parsed.system,
      fewShots: parsed.fewShots,
      safety: parsed.safety,
      createdBy: 'api',
    },
  });

  await prisma.auditLog.create({
    data: {
      workspaceId,
      action: 'agent.version.created',
      actorId: 'api',
      actorName: 'API',
      metadata: { agentId: agent.id, versionId: version.id },
    },
  });

  return NextResponse.json({ version }, { status: 201 });
}
