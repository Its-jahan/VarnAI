import { getAgents } from '@/data/agents';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export async function AgentsTable() {
  const agents = await getAgents();
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {agents.map((agent) => (
        <Card key={agent.id} className="rounded-2xl border bg-card/80">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>
              <Badge variant={agent.memory ? 'default' : 'secondary'}>{agent.memory ? 'Memory on' : 'Stateless'}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Model: {agent.defaultModel}</span>
              <span>Temperature: {agent.temperature.toFixed(1)}</span>
              <span>Tools: {agent.tools.join(', ') || 'None'}</span>
            </div>
            <div className="flex gap-3 text-sm">
              <Link className="text-primary" href={`/agents/${agent.id}`}>
                Manage
              </Link>
              <Link className="text-muted-foreground" href={`/chat?agent=${agent.id}`}>
                Open chat
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
      {agents.length === 0 && (
        <Card className="rounded-2xl border bg-card/80">
          <CardContent className="p-6 text-sm text-muted-foreground">No agents yet.</CardContent>
        </Card>
      )}
    </div>
  );
}
