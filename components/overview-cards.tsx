import { BrainCircuit, Database, ImageIcon, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    title: 'Active Agents',
    value: '4',
    change: '+1 new this week',
    icon: BrainCircuit,
  },
  {
    title: 'Datasets',
    value: '12',
    change: '3 pending reviews',
    icon: Database,
  },
  {
    title: 'Chat Sessions',
    value: '124',
    change: 'Up 18% vs last week',
    icon: MessageSquare,
  },
  {
    title: 'Images Generated',
    value: '87',
    change: 'Cost $12.43',
    icon: ImageIcon,
  },
];

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="rounded-2xl border bg-card/80 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
            </div>
            <stat.icon className="h-10 w-10 text-primary" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
