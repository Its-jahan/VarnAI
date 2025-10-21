import { Suspense } from 'react';
import { AgentsTable } from '@/components/agents/agents-table';
import { CreateAgentDrawer } from '@/components/agents/create-agent-drawer';

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Agents</h1>
          <p className="text-sm text-muted-foreground">Create configurable multi-modal AI agents.</p>
        </div>
        <CreateAgentDrawer />
      </div>
      <Suspense fallback={<div className="rounded-2xl border bg-card p-6">Loading agents…</div>}>
        <AgentsTable />
      </Suspense>
    </div>
  );
}
