import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAuditLog } from '@/lib/audit';

export async function RecentActivity() {
  const log = await fetchAuditLog();
  return (
    <Card className="rounded-2xl border bg-card/80">
      <CardHeader>
        <CardTitle>Audit log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {log.items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-background/80 p-4">
            <p className="text-sm font-medium text-foreground">{item.action}</p>
            <p className="text-xs text-muted-foreground">{item.actor} · {item.occurredAt}</p>
            {item.metadata?.resourceId && (
              <Link href={item.metadata.resourceUrl ?? '#'} className="mt-2 inline-flex text-xs text-primary">
                View details
              </Link>
            )}
          </div>
        ))}
        {log.items.length === 0 && <p className="text-sm text-muted-foreground">No recent activity.</p>}
      </CardContent>
    </Card>
  );
}
