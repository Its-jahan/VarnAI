import 'server-only';

import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

export async function getEvalRuns() {
  const workspaceId = await getCurrentWorkspaceId();
  const runs = await prisma.evalRun.findMany({
    where: { agentVersion: { agent: { workspaceId } } },
    include: { agentVersion: { include: { agent: true } }, dataset: true },
    orderBy: { createdAt: 'desc' },
  });

  return runs.map((run) => ({
    id: run.id,
    agentName: run.agentVersion.agent.name,
    datasetName: run.dataset.name,
    passRate: run.passRate,
    avgLatencyMs: run.avgLatencyMs,
    tokenCostCents: run.tokenCostCents,
    scorer: run.scorer,
  }));
}
