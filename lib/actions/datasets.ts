'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const datasetLineSchema = z.object({
  prompt: z.string(),
  expected_output: z.string(),
  tags: z.array(z.string()).optional(),
});

export async function uploadDataset(jsonl: string) {
  const lines = jsonl
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed = lines.map((line, index) => {
    try {
      const payload = JSON.parse(line);
      return datasetLineSchema.parse(payload);
    } catch (error) {
      throw new Error(`Invalid JSONL line ${index + 1}`);
    }
  });

  const workspaceId = await getCurrentWorkspaceId();

  const dataset = await prisma.dataset.create({
    data: {
      workspaceId,
      name: `Dataset ${new Date().toISOString()}`,
      description: 'Uploaded via UI',
      itemCount: parsed.length,
      items: {
        createMany: {
          data: parsed.map((item) => ({
            prompt: item.prompt,
            expected: item.expected_output,
            tags: item.tags ?? [],
          })),
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      workspaceId,
      action: 'dataset.uploaded',
      actorId: 'system',
      actorName: 'System',
      metadata: { datasetId: dataset.id },
    },
  });

  revalidatePath('/datasets');
}
