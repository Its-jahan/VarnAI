import { getDatasets } from '@/data/datasets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export async function DatasetsTable() {
  const datasets = await getDatasets();
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {datasets.map((dataset) => (
        <Card key={dataset.id} className="rounded-2xl border bg-card/80">
          <CardHeader>
            <CardTitle>{dataset.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{dataset.description ?? 'No description provided.'}</p>
            <p>Items: {dataset.itemCount}</p>
            <p>Created: {dataset.createdAt}</p>
          </CardContent>
        </Card>
      ))}
      {datasets.length === 0 && (
        <Card className="rounded-2xl border bg-card/80">
          <CardContent className="p-6 text-sm text-muted-foreground">No datasets yet.</CardContent>
        </Card>
      )}
    </div>
  );
}
