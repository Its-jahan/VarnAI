'use client';

import { useState, useTransition } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { runEvalAction } from '@/lib/actions/evals';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function RunEvalDialog() {
  const { data: agents } = useSWR('/api/agents', fetcher);
  const { data: datasets } = useSWR('/api/datasets', fetcher);
  const [open, setOpen] = useState(false);
  const [agentVersionId, setAgentVersionId] = useState('');
  const [datasetId, setDatasetId] = useState('');
  const [isPending, startTransition] = useTransition();

  const onRun = () => {
    if (!agentVersionId || !datasetId) return;
    startTransition(async () => {
      await runEvalAction({ agentVersionId, datasetId, scorer: 'contains' });
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Run eval</Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Run evaluation</DialogTitle>
        </DialogHeader>
        <select
          value={agentVersionId}
          onChange={(event) => setAgentVersionId(event.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm"
        >
          <option value="">Select agent version</option>
          {agents?.agents?.flatMap((agent: any) =>
            agent.versions.map((version: any) => (
              <option key={version.id} value={version.id}>
                {agent.name} · {version.id.slice(0, 6)}
              </option>
            )),
          )}
        </select>
        <select
          value={datasetId}
          onChange={(event) => setDatasetId(event.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm"
        >
          <option value="">Select dataset</option>
          {datasets?.datasets?.map((dataset: any) => (
            <option key={dataset.id} value={dataset.id}>
              {dataset.name}
            </option>
          ))}
        </select>
        <DialogFooter>
          <Button onClick={onRun} disabled={isPending || !agentVersionId || !datasetId} className="rounded-xl">
            {isPending ? 'Running…' : 'Run eval'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
