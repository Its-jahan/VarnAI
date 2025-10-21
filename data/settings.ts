import 'server-only';

import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

export async function getWorkspaceSettings() {
  const workspaceId = await getCurrentWorkspaceId();
  const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId }, include: { apiKeys: true } });
  const audit = await prisma.auditLog.findMany({ where: { workspaceId }, orderBy: { occurredAt: 'desc' }, take: 5 });

  return {
    defaultModel: 'gpt-4.1-mini',
    temperature: 0.7,
    providers: workspace?.apiKeys.map((key) => key.provider) ?? [],
    audit: audit.map((item) => ({ id: item.id, action: item.action, actor: item.actorName ?? 'System' })),
  };
}
