import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentWorkspaceId } from '@/lib/workspace';
import { prisma } from '@/lib/prisma';
import { enqueueTrainingJob } from '@/lib/training-queue';

const schema = z.object({
  datasetId: z.string(),
  baseModel: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { datasetId, baseModel } = schema.parse(body);
  const workspaceId = await getCurrentWorkspaceId();

  const dataset = await prisma.dataset.findFirst({ where: { id: datasetId, workspaceId } });
  if (!dataset) {
    return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
  }

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

  return NextResponse.json({ job }, { status: 202 });
}
