import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Database, Plus, CheckCircle2, AlertTriangle, Trash2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "Data Connections — NexusIQ" },
      { name: "description", content: "Manage PostgreSQL, MySQL, Snowflake, BigQuery and other data source connections." },
    ],
  }),
  component: ConnectionsPage,
});

type Conn = {
  id: string;
  name: string;
  engine: "PostgreSQL" | "MySQL" | "Snowflake" | "BigQuery" | "Redshift" | "SQL Server";
  host: string;
  database: string;
  status: "healthy" | "degraded" | "offline";
  latencyMs: number;
  tables: number;
  lastSync: string;
};

const seed: Conn[] = [
  { id: "c1", name: "Production Analytics", engine: "PostgreSQL", host: "prod-analytics.internal:5432", database: "analytics", status: "healthy", latencyMs: 42, tables: 128, lastSync: "2 min ago" },
  { id: "c2", name: "Snowflake DWH", engine: "Snowflake", host: "acme.snowflakecomputing.com", database: "ENTERPRISE_DW", status: "healthy", latencyMs: 118, tables: 412, lastSync: "5 min ago" },
  { id: "c3", name: "BigQuery Events", engine: "BigQuery", host: "bigquery.googleapis.com", database: "events_v2", status: "degraded", latencyMs: 890, tables: 87, lastSync: "22 min ago" },
  { id: "c4", name: "Legacy Reporting", engine: "SQL Server", host: "reporting-legacy:1433", database: "reports", status: "offline", latencyMs: 0, tables: 0, lastSync: "3 hours ago" },
];

const engineColor: Record<Conn["engine"], string> = {
  PostgreSQL: "bg-[#336791]/20 text-[#7fb2e6] border-[#336791]/40",
  MySQL: "bg-[#e48e00]/20 text-[#f5b95b] border-[#e48e00]/40",
  Snowflake: "bg-[#29b5e8]/20 text-[#29b5e8] border-[#29b5e8]/40",
  BigQuery: "bg-[#4285f4]/20 text-[#7ba7f9] border-[#4285f4]/40",
  Redshift: "bg-[#c92a2a]/20 text-[#ff6b6b] border-[#c92a2a]/40",
  "SQL Server": "bg-[#a91d22]/20 text-[#ff7a7f] border-[#a91d22]/40",
};

function ConnectionsPage() {
  const [conns, setConns] = useState<Conn[]>(seed);
  const [open, setOpen] = useState(false);

  const addConn = (form: FormData) => {
    const c: Conn = {
      id: `c${Date.now()}`,
      name: String(form.get("name") || "New Connection"),
      engine: (form.get("engine") as Conn["engine"]) || "PostgreSQL",
      host: String(form.get("host") || ""),
      database: String(form.get("database") || ""),
      status: "healthy",
      latencyMs: 60 + Math.floor(Math.random() * 100),
      tables: Math.floor(Math.random() * 200) + 20,
      lastSync: "just now",
    };
    setConns((x) => [c, ...x]);
    setOpen(false);
    toast.success(`Connected to ${c.name}`);
  };

  return (
    <AppShell
      title="Data Connections"
      subtitle="Live sources indexed by the AI"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Connection</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Data Source</DialogTitle></DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); addConn(new FormData(e.currentTarget)); }}
              className="space-y-3"
            >
              <div><Label>Name</Label><Input name="name" required className="mt-1.5" placeholder="Production DB" /></div>
              <div>
                <Label>Engine</Label>
                <select name="engine" className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                  {(["PostgreSQL","MySQL","Snowflake","BigQuery","Redshift","SQL Server"] as const).map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div><Label>Host</Label><Input name="host" required className="mt-1.5 font-mono text-sm" placeholder="db.example.com:5432" /></div>
              <div><Label>Database</Label><Input name="database" required className="mt-1.5 font-mono text-sm" /></div>
              <Button type="submit" className="w-full">Test & Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {conns.map((c) => (
          <Card key={c.id} className="p-5 bg-card/60">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{c.name}</div>
                  <Badge variant="outline" className={`mt-1 text-[10px] ${engineColor[c.engine]}`}>{c.engine}</Badge>
                </div>
              </div>
              {c.status === "healthy" && <CheckCircle2 className="h-4 w-4 text-success" />}
              {c.status === "degraded" && <AlertTriangle className="h-4 w-4 text-warning" />}
              {c.status === "offline" && <AlertTriangle className="h-4 w-4 text-destructive" />}
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
              <div className="truncate">{c.host}</div>
              <div>db: {c.database}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/60 text-center">
              <div><div className="text-sm font-semibold">{c.tables}</div><div className="text-[10px] text-muted-foreground">tables</div></div>
              <div><div className="text-sm font-semibold">{c.latencyMs}ms</div><div className="text-[10px] text-muted-foreground">latency</div></div>
              <div><div className="text-sm font-semibold">{c.lastSync}</div><div className="text-[10px] text-muted-foreground">synced</div></div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Schema refreshed")}>
                <RefreshCw className="h-3 w-3 mr-1.5" />Refresh
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setConns((x) => x.filter((y) => y.id !== c.id)); toast.success("Removed"); }}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
