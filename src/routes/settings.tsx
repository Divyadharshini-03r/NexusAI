import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NexusIQ" },
      { name: "description", content: "Configure your database connection, AI model, and safety settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Backend, model, and safety configuration">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
        <Card className="p-5 bg-card/60">
          <h3 className="font-medium mb-1">Spring Boot Backend</h3>
          <p className="text-xs text-muted-foreground mb-4">The Java service that powers NL→SQL, safety, and execution.</p>
          <div className="space-y-3">
            <div><Label>Base URL</Label><Input defaultValue="http://localhost:8080/api" className="mt-1.5 bg-background/60 font-mono text-sm" /></div>
            <div className="flex items-center gap-2"><Badge variant="secondary" className="bg-success/15 text-success border-success/30">Connected</Badge><span className="text-xs text-muted-foreground">v1.0.0 · schema cached</span></div>
          </div>
        </Card>
        <Card className="p-5 bg-card/60">
          <h3 className="font-medium mb-1">Database</h3>
          <p className="text-xs text-muted-foreground mb-4">Read-only connection used for schema + execution.</p>
          <div className="space-y-3">
            <div><Label>JDBC URL</Label><Input defaultValue="jdbc:postgresql://localhost:5432/analytics" className="mt-1.5 bg-background/60 font-mono text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Username</Label><Input defaultValue="readonly" className="mt-1.5 bg-background/60" /></div>
              <div><Label>Password</Label><Input type="password" defaultValue="••••••••" className="mt-1.5 bg-background/60" /></div>
            </div>
            <Button size="sm">Test connection</Button>
          </div>
        </Card>
        <Card className="p-5 bg-card/60">
          <h3 className="font-medium mb-1">LLM Model</h3>
          <p className="text-xs text-muted-foreground mb-4">Used to translate natural language into SQL.</p>
          <div className="space-y-3">
            <div><Label>Model</Label><Input defaultValue="openai/gpt-4.1" className="mt-1.5 bg-background/60 font-mono text-sm" /></div>
            <div><Label>API Key</Label><Input type="password" defaultValue="sk-••••••••••••" className="mt-1.5 bg-background/60 font-mono text-sm" /></div>
          </div>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <h3 className="font-medium mb-2">Safety Policy</h3>
          <p className="text-xs text-muted-foreground mb-3">Enforced server-side before any query touches the database.</p>
          <div className="flex flex-wrap gap-1.5">
            {["DROP", "DELETE", "UPDATE", "ALTER", "TRUNCATE", "CREATE", "EXEC", "INSERT", "GRANT"].map((k) => (
              <Badge key={k} variant="secondary" className="bg-destructive/15 text-destructive border-destructive/30 font-mono">{k}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Only SELECT and WITH statements are permitted.</p>
        </Card>
      </div>
    </AppShell>
  );
}
