'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { uploadDataset } from '@/lib/actions/datasets';

export function UploadDatasetDialog() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  const onUpload = () => {
    startTransition(async () => {
      await uploadDataset(content);
      setContent('');
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Upload JSONL</Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Upload dataset</DialogTitle>
        </DialogHeader>
        <Textarea value={content} onChange={(event) => setContent(event.target.value)} disabled={isPending} placeholder='{"prompt":"Classify…","expected_output":"cat"}' />
        <DialogFooter>
          <Button onClick={onUpload} disabled={isPending || content.trim().length === 0} className="rounded-xl">
            {isPending ? 'Uploading…' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
