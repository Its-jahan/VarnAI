import Link from 'next/link';
import { LucideIcon, BrainCircuit, Database, Settings, Image as ImageIcon, MessageSquare, LineChart } from 'lucide-react';
import { ReactNode } from 'react';

const links: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/dashboard', label: 'Dashboard', icon: LineChart },
  { href: '/agents', label: 'Agents', icon: BrainCircuit },
  { href: '/datasets', label: 'Datasets', icon: Database },
  { href: '/training', label: 'Training', icon: LineChart },
  { href: '/evals', label: 'Evaluations', icon: LineChart },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/images', label: 'Images', icon: ImageIcon },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ user }: { user: { email?: string | null } | null }) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r bg-card/80 p-6 lg:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <span className="rounded-xl bg-primary/10 px-2 py-1 text-primary">AI Trainer</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1 text-sm">
        {links.map((link) => (
          <SidebarLink key={link.href} href={link.href} icon={<link.icon className="h-4 w-4" />}>
            {link.label}
          </SidebarLink>
        ))}
      </nav>
      <div className="mt-6 rounded-xl bg-muted p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Signed in</p>
        <p>{user?.email ?? 'Unknown user'}</p>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
