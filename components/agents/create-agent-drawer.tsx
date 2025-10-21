'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createAgent } from '@/lib/actions/agents';
import { useTransition } from 'react';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(4),
  defaultModel: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

export function CreateAgentDrawer() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '', description: '', defaultModel: 'gpt-4.1-mini' } });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      await createAgent(data);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-xl">New Agent</Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input disabled={isPending} {...form.register('name')} placeholder="Product Spec Assistant" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea disabled={isPending} {...form.register('description')} placeholder="Helps product teams write specs." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Default model</label>
            <Input disabled={isPending} {...form.register('defaultModel')} placeholder="gpt-4.1-mini" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="rounded-xl">
              {isPending ? 'Creating…' : 'Create agent'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
