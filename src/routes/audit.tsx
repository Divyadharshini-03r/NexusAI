import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, User, Database, Download, Search, KeyRound, Play } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Log — NexusIQ" },
      { name: "description", content: "Complete audit trail of queries, connections, exports, and access events for compliance." },
    ],
  }),
  component: AuditPage,
});

type Event = {
  id: string;
  actor: string;
  action: string;
  target: string;
  severity: "info" | "warning" | "critical";
  time: string;
  ip: string;
  icon: typeof Shield;
};

const events: Event[] = [
  { id: "a1", actor: "alex@acme.co", action: "Executed query", target: "SELECT * FROM customers LIMIT 100", severity: "info", time: "12:04:22", ip: "10.0.4.12", icon: Play },
  { id: "a2", actor: "sarah@acme.co", action: "Exported data", target: "top_customers_q3.csv (5 rows)", severity: "info", time: "12:01:08", ip: "10.0.4.44", icon: Download },
  { id: "a3", actor: "mike@acme.co", action: "Query blocked", target: "DELETE FROM sessions ...", severity: "warning", time: "11:52:41", ip: "10.0.4.19", icon: ShieldAlert },
  { id: "a4", actor: "alex@acme.co", action: "Granted role", target: "jordan@acme.co → Engineer", severity: "warning", time: "11:31:00", ip: "10.0.4.12", icon: User },
  { id: "a5", actor: "system", action: "Schema refreshed", target: "postgres · prod (128 tables)", severity: "info", time: "11:15:02", ip: "internal", icon: Database },
  { id: "a6", actor: "priya@acme.co", action: "Login", target: "SSO via Okta", severity: "info", time: "11:04:55", ip: "203.0.113.9", icon: KeyRound },
  { id: "a7", actor: "unknown", action: "Failed login", target: "root@acme.co (5th attempt)", severity: "critical", time: "10:58:11", ip: "45.9.148.7", icon: ShieldAlert },
  { id: "a8", actor: "alex@acme.co", action: "Rotated API key", target: "OpenAI GPT-4.1", severity: "warning", time: "10:12:30", ip: "10.0.4.12", icon: KeyRound },
];

const sevStyles: Record<Event["severity"], string> = {
  info: "bg-muted text-muted-foreground border-border",
  warning: "bg-warning/15 text-warning border-warning/30",
  critical: "bg-destructive/15 text-destructive border-destructive/30",
};

function AuditPage() {
  return (
    <AppShell
      title="Audit Log"
      subtitle="Immutable event stream for compliance & security"
      actions={<Button variant="outline"><Download className="h-4 w-4 mr-2" />Export CSV</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Events today", value: "2,481", tone: "text-foreground" },
          { label: "Blocked queries", value: "12", tone: "text-warning" },
          { label: "Failed logins", value: "3", tone: "text-destructive" },
          { label: "Data exports", value: "47", tone: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="p-4 bg-card/60">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</div>
            <div className={`text-2xl font-semibold mt-1 ${s.tone}`}>{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="bg-card/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search actor, action, target…" className="pl-9 h-9 bg-background/60" />
          </div>
          <Badge variant="outline" className="text-[10px]">Retention: 365 days</Badge>
        </div>
        <div className="divide-y divide-border/40">
          {events.map((e) => {
            const Icon = e.icon;
            return (
              <div key={e.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition">
                <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                  e.severity === "critical" ? "bg-destructive/15" : e.severity === "warning" ? "bg-warning/15" : "bg-muted"
                }`}>
                  <Icon className={`h-4 w-4 ${
                    e.severity === "critical" ? "text-destructive" : e.severity === "warning" ? "text-warning" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium">{e.actor}</span>{" "}
                    <span className="text-muted-foreground">{e.action.toLowerCase()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{e.target}</div>
                </div>
                <div className="text-xs text-muted-foreground font-mono hidden md:block">{e.ip}</div>
                <Badge variant="outline" className={sevStyles[e.severity]}>{e.severity}</Badge>
                <div className="text-xs text-muted-foreground font-mono w-20 text-right">{e.time}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </AppShell>
  );
}
