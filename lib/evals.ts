import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

interface EvalInput {
  agentVersionId: string;
  datasetId: string;
  scorer: 'regex' | 'contains' | 'equals';
  criteria?: string;
  workspaceId: string;
}

export async function runEval({ agentVersionId, datasetId, scorer, criteria, workspaceId }: EvalInput) {
  const version = await prisma.agentVersion.findUnique({ where: { id: agentVersionId }, include: { agent: true } });
  const items = await prisma.datasetItem.findMany({ where: { datasetId } });

  if (!version) {
    throw new Error('Agent version not found');
  }

  const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
  let passCount = 0;
  let totalLatency = 0;
  const report: Array<{ prompt: string; expected: string; actual: string; pass: boolean }> = [];
  let tokensIn = 0;
  let tokensOut = 0;

  for (const item of items) {
    const start = Date.now();
    let output = 'Mock output';
    if (client) {
      const response = await client.responses.create({
        model: version.agent.defaultModel,
        input: [
          { role: 'system', content: version.system },
          { role: 'user', content: item.prompt },
        ],
      });
      output = response.output_text ?? '';
      tokensIn += response.usage?.input_tokens ?? 0;
      tokensOut += response.usage?.output_tokens ?? 0;
    }
    const latency = Date.now() - start;
    totalLatency += latency;
    const pass = evaluateOutput(output, item.expected, scorer, criteria);
    if (pass) passCount += 1;
    report.push({ prompt: item.prompt, expected: item.expected, actual: output, pass });
  }

  const passRate = items.length ? passCount / items.length : 0;
  const avgLatencyMs = items.length ? Math.round(totalLatency / items.length) : 0;
  const tokenCostCents = Math.round((tokensIn + tokensOut) * 0.002);

  return { passRate, avgLatencyMs, tokenCostCents, tokensIn, tokensOut, report };
}

function evaluateOutput(actual: string, expected: string, scorer: 'regex' | 'contains' | 'equals', criteria?: string) {
  if (scorer === 'equals') {
    return actual.trim() === expected.trim();
  }
  if (scorer === 'contains') {
    return actual.includes(expected) || (criteria ? actual.includes(criteria) : false);
  }
  if (scorer === 'regex') {
    const pattern = new RegExp(criteria ?? expected, 'i');
    return pattern.test(actual);
  }
  return false;
}
