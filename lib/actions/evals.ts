'use server';

import { z } from 'zod';
import { runEval } from '@/lib/evals';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';
import { revalidatePath } from 'next/cache';

const schema = z.object({ agentVersionId: z.string(), datasetId: z.string(), scorer: z.enum(['regex', 'contains', 'equals']) });

type RunEvalInput = z.infer<typeof schema>;

export async function runEvalAction(input: RunEvalInput) {
  const payload = schema.parse(input);
  const workspaceId = await getCurrentWorkspaceId();
  const result = await runEval({ ...payload, workspaceId });
  await prisma.evalRun.create({
    data: {
      agentVersionId: payload.agentVersionId,
      datasetId: payload.datasetId,
      scorer: payload.scorer,
      passRate: result.passRate,
      avgLatencyMs: result.avgLatencyMs,
      tokenCostCents: result.tokenCostCents,
    },
  });
  revalidatePath('/evals');
}
