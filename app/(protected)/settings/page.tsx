import { Suspense } from 'react';
import { SettingsOverview } from '@/components/settings/settings-overview';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Workspace settings</h1>
      <Suspense fallback={<div className="rounded-2xl border bg-card p-6">Loading settings…</div>}>
        <SettingsOverview />
      </Suspense>
    </div>
  );
}
