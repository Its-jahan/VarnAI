import { describe, expect, it } from 'vitest';
import { createAgent } from '@/lib/actions/agents';

vi.mock('@/lib/workspace', () => ({ getCurrentWorkspaceId: vi.fn(async () => 'workspace-1') }));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    agent: {
      create: vi.fn(async ({ data }) => ({ id: 'agent-1', ...data })),
    },
    auditLog: {
      create: vi.fn(async () => ({})),
    },
  },
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

describe('createAgent', () => {
  it('creates an agent with defaults', async () => {
    await expect(createAgent({ name: 'Test', description: 'Desc', defaultModel: 'gpt-4.1-mini' })).resolves.toBeUndefined();
  });
});
