import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUsage } from '@/lib/usage';

interface Props {
  period: '7d' | '30d';
}

export async function UsageChart({ period }: Props) {
  const usage = await fetchUsage(period);

  return (
    <Card className="h-full rounded-2xl border bg-card/80">
      <CardHeader>
        <CardTitle>Usage overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {usage.series.map((bucket) => (
            <div key={bucket.date} className="rounded-xl bg-muted p-4">
              <p className="text-xs text-muted-foreground">{bucket.date}</p>
              <p className="mt-2 text-lg font-semibold">{bucket.tokens.toLocaleString()} tokens</p>
              <p className="text-xs text-muted-foreground">${(bucket.costCents / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function UsageChartSkeleton() {
  return (
    <Card className="rounded-2xl border bg-card/80">
      <CardHeader>
        <CardTitle>Usage overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="animate-pulse rounded-xl bg-muted/60 p-6" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
