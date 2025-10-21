import { Suspense } from 'react';
import { DatasetsTable } from '@/components/datasets/datasets-table';
import { UploadDatasetDialog } from '@/components/datasets/upload-dataset-dialog';

export default function DatasetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Datasets</h1>
          <p className="text-sm text-muted-foreground">Manage JSONL datasets for training and evals.</p>
        </div>
        <UploadDatasetDialog />
      </div>
      <Suspense fallback={<div className="rounded-2xl border bg-card p-6">Loading datasets…</div>}>
        <DatasetsTable />
      </Suspense>
    </div>
  );
}
