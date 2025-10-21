import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

const imageSchema = z.object({
  prompt: z.string().min(4),
  negativePrompt: z.string().optional(),
  size: z.enum(['256x256', '512x512', '1024x1024']).default('512x512'),
  n: z.number().min(1).max(4).default(1),
  seed: z.number().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt, negativePrompt, size, n, seed } = imageSchema.parse(body);
  const workspaceId = await getCurrentWorkspaceId();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      images: Array.from({ length: n }).map((_, idx) => ({
        url: `https://placehold.co/600x400?text=Mock+${idx + 1}`,
        prompt,
      })),
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.images.generate({
    model: 'gpt-image-1',
    prompt,
    negative_prompt: negativePrompt,
    size,
    n,
    seed,
  });

  const outputs = response.data.map((image) => ({ url: image.url }));

  await prisma.imageJob.create({
    data: {
      workspaceId,
      prompt,
      negativePrompt,
      size,
      n,
      seed,
      status: 'completed',
      outputs,
    },
  });

  await prisma.usageEvent.create({
    data: {
      workspaceId,
      kind: 'image',
      images: n,
      costCents: n * 400,
    },
  });

  return NextResponse.json({ images: outputs });
}
