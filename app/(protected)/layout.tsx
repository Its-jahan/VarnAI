import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { getCurrentUser } from '@/lib/auth';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-6">{children}</div>
      </main>
    </div>
  );
}
