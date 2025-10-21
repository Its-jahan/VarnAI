import 'server-only';

import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

export async function fetchAuditLog(limit = 10) {
  const workspaceId = await getCurrentWorkspaceId();
  const items = await prisma.auditLog.findMany({
    where: { workspaceId },
    orderBy: { occurredAt: 'desc' },
    take: limit,
  });

  return {
    items: items.map((item) => ({
      id: item.id,
      action: item.action,
      actor: item.actorName ?? 'System',
      occurredAt: item.occurredAt.toISOString(),
      metadata: item.metadata as Record<string, unknown> | null,
    })),
  };
}
