import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { queryHistory } from "@/lib/mock/data";
import { CheckCircle2, ShieldAlert, XCircle, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Query History — NexusIQ" },
      { name: "description", content: "Browse and replay your recent natural language queries and generated SQL." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [q, setQ] = useState("");
  const filtered = queryHistory.filter((i) => i.question.toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell title="Query History" subtitle="Every question, generated SQL, and execution result">
      <div className="mb-4 relative max-w-md">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" className="pl-9 bg-card/60" />
      </div>
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} className="p-5 bg-card/60">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.status === "success" && <Badge variant="secondary" className="gap-1 bg-success/15 text-success border-success/30"><CheckCircle2 className="h-3 w-3" />Success</Badge>}
                  {item.status === "blocked" && <Badge variant="destructive" className="gap-1"><ShieldAlert className="h-3 w-3" />Blocked</Badge>}
                  {item.status === "error" && <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Error</Badge>}
                  <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div className="font-medium">{item.question}</div>
              </div>
              <div className="text-xs text-muted-foreground text-right shrink-0">
                <div>{item.rows} rows</div>
                <div>{item.executionMs} ms</div>
              </div>
            </div>
            <pre className="text-xs bg-background/60 rounded-md p-3 border border-border/60 overflow-x-auto"><code>{item.sql}</code></pre>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
