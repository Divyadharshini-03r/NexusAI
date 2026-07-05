import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schema } from "@/lib/mock/data";
import { Key, Link2, RefreshCw, Database } from "lucide-react";

export const Route = createFileRoute("/schema")({
  head: () => ({
    meta: [
      { title: "Schema Explorer — NexusIQ" },
      { name: "description", content: "Interactive database schema visualization with tables, columns, and relationships." },
    ],
  }),
  component: SchemaPage,
});

function SchemaPage() {
  return (
    <AppShell
      title="Schema Explorer"
      subtitle="Auto-inspected from your connected database · cached for fast prompts"
      actions={<Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Refresh schema</Button>}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tables", value: schema.length },
          { label: "Columns", value: schema.reduce((n, t) => n + t.columns.length, 0) },
          { label: "Relationships", value: schema.reduce((n, t) => n + t.columns.filter((c) => "fk" in c).length, 0) },
          { label: "Primary Keys", value: schema.reduce((n, t) => n + t.columns.filter((c) => "pk" in c).length, 0) },
        ].map((s) => (
          <Card key={s.label} className="p-4 bg-card/60">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-semibold mt-1">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {schema.map((table) => (
          <Card key={table.table} className="p-0 bg-card/60 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="font-mono font-medium">{table.table}</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">{table.columns.length} cols</Badge>
            </div>
            <ul className="divide-y divide-border/40">
              {table.columns.map((col) => (
                <li key={col.name} className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted/30">
                  <div className="flex items-center gap-2 min-w-0">
                    {"pk" in col && <Key className="h-3 w-3 text-warning shrink-0" />}
                    {"fk" in col && <Link2 className="h-3 w-3 text-accent shrink-0" />}
                    <span className="font-mono truncate">{col.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                    {"fk" in col && <span className="font-mono text-accent">→ {col.fk}</span>}
                    <span className="font-mono">{col.type}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
