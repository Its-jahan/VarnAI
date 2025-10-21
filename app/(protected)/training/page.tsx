import { Suspense } from 'react';
import { TrainingJobsTable } from '@/components/training/training-jobs-table';
import { StartTrainingDialog } from '@/components/training/start-training-dialog';

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Training jobs</h1>
          <p className="text-sm text-muted-foreground">Track fine-tune requests and lightweight tuning.</p>
        </div>
        <StartTrainingDialog />
      </div>
      <Suspense fallback={<div className="rounded-2xl border bg-card p-6">Loading jobs…</div>}>
        <TrainingJobsTable />
      </Suspense>
    </div>
  );
}
