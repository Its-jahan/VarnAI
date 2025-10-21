import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';
import { runEval } from '@/lib/evals';

const schema = z.object({
  agentVersionId: z.string(),
  datasetId: z.string(),
  scorer: z.enum(['regex', 'contains', 'equals']),
  criteria: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const payload = schema.parse(body);
  const workspaceId = await getCurrentWorkspaceId();

  const version = await prisma.agentVersion.findFirst({ where: { id: payload.agentVersionId, agent: { workspaceId } } });
  const dataset = await prisma.dataset.findFirst({ where: { id: payload.datasetId, workspaceId } });
  if (!version || !dataset) {
    return NextResponse.json({ error: 'Invalid agent version or dataset' }, { status: 404 });
  }

  const result = await runEval({ ...payload, workspaceId });

  const evalRun = await prisma.evalRun.create({
    data: {
      agentVersionId: version.id,
      datasetId: dataset.id,
      scorer: payload.scorer,
      passRate: result.passRate,
      avgLatencyMs: result.avgLatencyMs,
      tokenCostCents: result.tokenCostCents,
    },
  });

  await prisma.usageEvent.create({
    data: {
      workspaceId,
      kind: 'eval',
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      costCents: result.tokenCostCents,
    },
  });

  return NextResponse.json({ evalRun, report: result.report });
}
