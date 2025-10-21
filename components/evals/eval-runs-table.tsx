import { getEvalRuns } from '@/data/evals/runs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export async function EvalRunsTable() {
  const runs = await getEvalRuns();
  return (
    <Card className="rounded-2xl border bg-card/80">
      <CardHeader>
        <CardTitle>Latest eval runs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {runs.map((run) => (
          <div key={run.id} className="rounded-xl border bg-background/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{run.agentName}</p>
                <p className="text-xs text-muted-foreground">Dataset: {run.datasetName}</p>
              </div>
              <Badge variant="secondary">Pass rate {(run.passRate * 100).toFixed(0)}%</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>Latency {run.avgLatencyMs} ms</span>
              <span>Cost ${(run.tokenCostCents / 100).toFixed(2)}</span>
              <span>Scorer {run.scorer}</span>
            </div>
          </div>
        ))}
        {runs.length === 0 && <p className="text-sm text-muted-foreground">No eval runs yet.</p>}
      </CardContent>
    </Card>
  );
}
