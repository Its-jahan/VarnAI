'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImagesPage() {
  const [prompt, setPrompt] = useState('Futuristic dashboard interface');
  const [size, setSize] = useState<'256x256' | '512x512' | '1024x1024'>('512x512');
  const [images, setImages] = useState<Array<{ url: string }>>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const response = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, size, n: 2 }),
    });
    const data = await response.json();
    setImages(data.images ?? []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border bg-card/80">
        <CardHeader>
          <CardTitle>Generate images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the image" />
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as typeof size)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm"
          >
            <option value="256x256">256x256</option>
            <option value="512x512">512x512</option>
            <option value="1024x1024">1024x1024</option>
          </select>
          <Button onClick={generate} disabled={loading} className="rounded-xl">
            {loading ? 'Generating…' : 'Generate'}
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div key={index} className="rounded-2xl border bg-card/80 p-2">
            <img src={image.url} alt={prompt} className="h-64 w-full rounded-xl object-cover" />
            <p className="mt-2 text-xs text-muted-foreground">{prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
