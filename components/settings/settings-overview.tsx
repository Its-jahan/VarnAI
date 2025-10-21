import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getWorkspaceSettings } from '@/data/settings';
import { Button } from '@/components/ui/button';

export async function SettingsOverview() {
  const settings = await getWorkspaceSettings();
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="rounded-2xl border bg-card/80">
        <CardHeader>
          <CardTitle>Models & defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Default model: {settings.defaultModel}</p>
          <p>Temperature: {settings.temperature}</p>
          <Button variant="outline" size="sm" className="rounded-xl">
            Edit defaults
          </Button>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border bg-card/80">
        <CardHeader>
          <CardTitle>API keys vault</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Stored providers: {settings.providers.join(', ') || 'None'}</p>
          <Button variant="outline" size="sm" className="rounded-xl">
            Manage keys
          </Button>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border bg-card/80 lg:col-span-2">
        <CardHeader>
          <CardTitle>Audit log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {settings.audit.map((item) => (
            <div key={item.id} className="rounded-xl border bg-background/70 p-3">
              <p className="font-medium text-foreground">{item.action}</p>
              <p>{item.actor}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
