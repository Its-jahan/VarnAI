import { NextResponse } from 'next/server';
import { uploadDataset } from '@/lib/actions/datasets';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

const datasetSchema = z.object({ jsonl: z.string().min(2) });

export async function GET() {
  const workspaceId = await getCurrentWorkspaceId();
  const datasets = await prisma.dataset.findMany({ where: { workspaceId } });
  return NextResponse.json({ datasets });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { jsonl } = datasetSchema.parse(body);
  await uploadDataset(jsonl);
  return NextResponse.json({ ok: true }, { status: 201 });
}
