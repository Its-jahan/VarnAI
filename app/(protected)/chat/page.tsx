'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Agent {
  id: string;
  name: string;
  versions: Array<{ id: string }>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ChatPage() {
  const { data } = useSWR<{ agents: Agent[] }>('/api/agents', fetcher);
  const [message, setMessage] = useState('Hello!');
  const [response, setResponse] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isStreaming, setStreaming] = useState(false);

  useEffect(() => {
    if (data && !selectedVersion && data.agents[0]?.versions[0]) {
      setSelectedVersion(data.agents[0].versions[0].id);
    }
  }, [data, selectedVersion]);

  const sendMessage = async () => {
    if (!selectedVersion) return;
    setResponse('');
    setStreaming(true);
    const res = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentVersionId: selectedVersion, messages: [{ role: 'user', content: message }] }),
    });
    const reader = res.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const payload = JSON.parse(line.slice(6));
          if (payload.delta) {
            setResponse((prev) => prev + payload.delta);
          }
        }
      }
    }
    setStreaming(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Card className="rounded-2xl border bg-card/80">
        <CardHeader>
          <CardTitle>Agent versions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {data?.agents.map((agent) => (
            <div key={agent.id} className="space-y-1">
              <p className="font-medium text-foreground">{agent.name}</p>
              <div className="flex flex-col gap-2">
                {agent.versions.map((version) => (
                  <button
                    key={version.id}
                    onClick={() => setSelectedVersion(version.id)}
                    className={`rounded-xl border px-3 py-2 text-left text-xs ${selectedVersion === version.id ? 'border-primary bg-primary/10 text-primary' : 'border-muted bg-muted/60 text-muted-foreground'}`}
                  >
                    Version {version.id.slice(0, 8)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-2xl border bg-card/80">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} />
          <Button onClick={sendMessage} disabled={!selectedVersion || isStreaming} className="rounded-xl">
            {isStreaming ? 'Streaming…' : 'Send'}
          </Button>
          <div className="min-h-[200px] rounded-xl border bg-background/60 p-4 text-sm whitespace-pre-wrap">
            {response || 'Response will appear here.'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
