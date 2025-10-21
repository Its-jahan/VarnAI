import 'server-only';

import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

export async function getDatasets() {
  const workspaceId = await getCurrentWorkspaceId();
  const datasets = await prisma.dataset.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
  });

  return datasets.map((dataset) => ({
    id: dataset.id,
    name: dataset.name,
    description: dataset.description,
    itemCount: dataset.itemCount,
    createdAt: dataset.id.slice(0, 8),
  }));
}
