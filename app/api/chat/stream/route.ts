import { NextRequest } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

const chatSchema = z.object({
  agentVersionId: z.string(),
  messages: z.array(z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string() })),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { agentVersionId, messages } = chatSchema.parse(body);
  const workspaceId = await getCurrentWorkspaceId();

  const version = await prisma.agentVersion.findFirst({
    where: { id: agentVersionId, agent: { workspaceId } },
    include: { agent: true },
  });

  if (!version || !process.env.OPENAI_API_KEY) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(`data: ${JSON.stringify({ delta: 'Mock response: configure OPENAI_API_KEY.' })}\n\n`);
        controller.close();
      },
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.stream({
    model: version.agent.defaultModel,
    input: [
      { role: 'system', content: version.system },
      ...messages.map((message) => ({ role: message.role, content: message.content })),
    ],
    temperature: version.agent.temperature,
    max_output_tokens: version.agent.maxTokens,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const event of response) {
        if (event.type === 'response.output_text.delta') {
          controller.enqueue(`data: ${JSON.stringify({ delta: event.delta })}\n\n`);
        }
        if (event.type === 'response.completed') {
          const output = event.response.output_text ?? '';
          await prisma.usageEvent.create({
            data: {
              workspaceId,
              kind: 'chat',
              tokensIn: event.response.usage?.input_tokens ?? 0,
              tokensOut: event.response.usage?.output_tokens ?? 0,
              costCents: Math.round((event.response.usage?.total_tokens ?? 0) * 0.002),
            },
          });
          controller.enqueue(`data: ${JSON.stringify({ done: true })}\n\n`);
        }
      }
      controller.close();
    },
    cancel() {
      response.controller.abort();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
