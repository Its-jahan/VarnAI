import 'server-only';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { cache } from 'react';

export const getCurrentWorkspaceId = cache(async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
    },
    select: { workspaceId: true },
  });
  if (!membership) throw new Error('User has no workspace');
  return membership.workspaceId;
});
