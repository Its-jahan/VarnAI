import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentWorkspaceId } from '@/lib/workspace';

export async function GET() {
  const workspaceId = await getCurrentWorkspaceId();
  const usage = await prisma.usageEvent.findMany({ where: { workspaceId }, orderBy: { occurredAt: 'desc' }, take: 90 });
  const totals = usage.reduce(
    (acc, event) => {
      acc.tokensIn += event.tokensIn ?? 0;
      acc.tokensOut += event.tokensOut ?? 0;
      acc.images += event.images ?? 0;
      acc.costCents += event.costCents ?? 0;
      return acc;
    },
    { tokensIn: 0, tokensOut: 0, images: 0, costCents: 0 },
  );

  return NextResponse.json({ totals, events: usage });
}
