import { Queue } from 'bullmq';

const connection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : undefined;

const trainingQueue = new Queue('training-jobs', { connection });

interface TrainingJobPayload {
  jobId: string;
  workspaceId: string;
  datasetId: string;
  baseModel: string;
}

export async function enqueueTrainingJob(payload: TrainingJobPayload) {
  if (!connection) {
    console.info('Redis not configured; training job will be logged only', payload);
    return;
  }
  await trainingQueue.add('train', payload, { removeOnComplete: true, removeOnFail: true });
}
