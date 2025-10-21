import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

const chatSchema = z.object({
  agentVersionId: z.string(),
  messages: z.array(z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string() })),
  tools: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { agentVersionId, messages } = chatSchema.parse(body);
  const workspaceId = await getCurrentWorkspaceId();

  const version = await prisma.agentVersion.findFirst({
    where: {
      id: agentVersionId,
      agent: { workspaceId },
    },
    include: { agent: true },
  });

  if (!version) {
    return NextResponse.json({ error: 'Agent version not found' }, { status: 404 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      message: 'OpenAI API key not configured. Returning mocked response.',
      content: 'Hello! This is a mock response because no OpenAI key is configured.',
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: version.agent.defaultModel,
    input: [
      {
        role: 'system',
        content: version.system,
      },
      ...messages.map((message) => ({ role: message.role, content: message.content })),
    ],
    temperature: version.agent.temperature,
    max_output_tokens: version.agent.maxTokens,
  });

  const content = response.output_text ?? '';

  await prisma.conversation.upsert({
    where: { id: response.id },
    update: {
      messages: {
        create: {
          role: 'assistant',
          content: { text: content },
        },
      },
    },
    create: {
      id: response.id,
      agentVersionId: version.id,
      title: messages[0]?.content.slice(0, 64) ?? 'Conversation',
      createdBy: 'api',
      messages: {
        createMany: {
          data: messages.map((message) => ({
            role: message.role,
            content: { text: message.content },
          })),
        },
      },
    },
  });

  await prisma.usageEvent.create({
    data: {
      workspaceId,
      kind: 'chat',
      tokensIn: response.usage?.input_tokens ?? 0,
      tokensOut: response.usage?.output_tokens ?? 0,
      costCents: Math.round((response.usage?.total_tokens ?? 0) * 0.002),
    },
  });

  return NextResponse.json({ content });
}
