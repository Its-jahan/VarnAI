import { Suspense } from 'react';
import { EvalRunsTable } from '@/components/evals/eval-runs-table';
import { RunEvalDialog } from '@/components/evals/run-eval-dialog';

export default function EvalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Evaluations</h1>
          <p className="text-sm text-muted-foreground">Run evals on agent versions and datasets.</p>
        </div>
        <RunEvalDialog />
      </div>
      <Suspense fallback={<div className="rounded-2xl border bg-card p-6">Loading evals…</div>}>
        <EvalRunsTable />
      </Suspense>
    </div>
  );
}
