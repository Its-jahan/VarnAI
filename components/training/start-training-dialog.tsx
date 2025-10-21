'use client';

import { useState, useTransition } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { startTrainingJob } from '@/lib/actions/training';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function StartTrainingDialog() {
  const { data } = useSWR('/api/datasets', fetcher);
  const [open, setOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [model, setModel] = useState('gpt-4.1-mini');
  const [isPending, startTransition] = useTransition();

  const onStart = () => {
    if (!selectedDataset) return;
    startTransition(async () => {
      await startTrainingJob({ datasetId: selectedDataset, baseModel: model });
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Start fine-tune</Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Start training</DialogTitle>
        </DialogHeader>
        <select
          value={selectedDataset}
          onChange={(event) => setSelectedDataset(event.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm"
        >
          <option value="">Select dataset</option>
          {data?.datasets?.map((dataset: any) => (
            <option key={dataset.id} value={dataset.id}>
              {dataset.name}
            </option>
          ))}
        </select>
        <input
          value={model}
          onChange={(event) => setModel(event.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm"
        />
        <DialogFooter>
          <Button onClick={onStart} disabled={isPending || !selectedDataset} className="rounded-xl">
            {isPending ? 'Scheduling…' : 'Start job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
