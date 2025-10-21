'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { enqueueTrainingJob } from '@/lib/training-queue';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

const schema = z.object({ datasetId: z.string(), baseModel: z.string() });

type StartTrainingInput = z.infer<typeof schema>;

export async function startTrainingJob(input: StartTrainingInput) {
  const { datasetId, baseModel } = schema.parse(input);
  const workspaceId = await getCurrentWorkspaceId();

  const job = await prisma.trainingJob.create({
    data: {
      workspaceId,
      datasetId,
      baseModel,
      status: 'QUEUED',
      metadata: {},
    },
  });

  await enqueueTrainingJob({ jobId: job.id, workspaceId, datasetId, baseModel });
  revalidatePath('/training');
}
