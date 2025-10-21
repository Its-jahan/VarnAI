import { getTrainingJobs } from '@/data/training/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export async function TrainingJobsTable() {
  const jobs = await getTrainingJobs();
  return (
    <Card className="rounded-2xl border bg-card/80">
      <CardHeader>
        <CardTitle>Jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {jobs.map((job) => (
          <div key={job.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-background/70 p-4">
            <div>
              <p className="font-medium text-foreground">{job.baseModel}</p>
              <p className="text-xs text-muted-foreground">Dataset: {job.datasetName}</p>
            </div>
            <div className="text-right">
              <Badge variant={job.status === 'COMPLETED' ? 'default' : job.status === 'FAILED' ? 'destructive' : 'secondary'}>
                {job.status}
              </Badge>
              <p className="text-xs text-muted-foreground">Cost est: ${job.costEstimate}</p>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-sm text-muted-foreground">No jobs scheduled.</p>}
      </CardContent>
    </Card>
  );
}
