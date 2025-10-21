import 'server-only';

import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

export async function getTrainingJobs() {
  const workspaceId = await getCurrentWorkspaceId();
  const jobs = await prisma.trainingJob.findMany({
    where: { workspaceId },
    include: { dataset: true },
    orderBy: { createdAt: 'desc' },
  });

  return jobs.map((job) => ({
    id: job.id,
    baseModel: job.baseModel,
    status: job.status,
    costEstimate: job.costEstimateCents ? (job.costEstimateCents / 100).toFixed(2) : '—',
    datasetName: job.dataset?.name ?? 'Unknown dataset',
  }));
}
