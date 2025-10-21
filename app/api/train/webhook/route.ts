import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  jobId: z.string(),
  status: z.enum(['QUEUED', 'RUNNING', 'COMPLETED', 'FAILED']),
  costEstimateCents: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { jobId, status, costEstimateCents, metadata } = schema.parse(body);

  await prisma.trainingJob.update({
    where: { id: jobId },
    data: { status, costEstimateCents, metadata },
  });

  return NextResponse.json({ ok: true });
}
