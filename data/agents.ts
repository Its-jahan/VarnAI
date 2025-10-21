import 'server-only';

import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

export async function getAgents() {
  const workspaceId = await getCurrentWorkspaceId();
  const agents = await prisma.agent.findMany({
    where: { workspaceId },
    include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { name: 'asc' },
  });

  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description ?? 'No description provided',
    defaultModel: agent.defaultModel,
    temperature: agent.temperature,
    tools: (agent.tools as string[]) ?? [],
    memory: agent.memory,
    latestVersionId: agent.versions[0]?.id ?? null,
  }));
}
