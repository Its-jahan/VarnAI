import 'server-only';

import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

export async function fetchUsage(period: '7d' | '30d') {
  const workspaceId = await getCurrentWorkspaceId();
  const since = new Date();
  since.setDate(since.getDate() - (period === '7d' ? 7 : 30));

  const events = await prisma.usageEvent.findMany({
    where: {
      workspaceId,
      occurredAt: {
        gte: since,
      },
    },
    orderBy: { occurredAt: 'asc' },
  });

  const series = events.map((event) => ({
    date: event.occurredAt.toISOString().slice(0, 10),
    tokens: (event.tokensIn ?? 0) + (event.tokensOut ?? 0),
    costCents: event.costCents ?? 0,
  }));

  return { series };
}
