import { Suspense } from 'react';
import { OverviewCards } from '@/components/overview-cards';
import { UsageChart } from '@/components/usage-chart';
import { RecentActivity } from '@/components/recent-activity';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <OverviewCards />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Suspense fallback={<div className="rounded-2xl border bg-card p-6">Loading usage…</div>}>
            <UsageChart period="30d" />
          </Suspense>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}
