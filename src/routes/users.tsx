import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, Eye, Wrench, Crown } from "lucide-react";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — NexusIQ" },
      { name: "description", content: "Manage team members, RBAC roles, and permissions across your data platform." },
    ],
  }),
  component: UsersPage,
});

const users = [
  { name: "Alex Chen", email: "alex@acme.co", role: "Admin", status: "active", lastActive: "now", queries: 428 },
  { name: "Sarah Kim", email: "sarah@acme.co", role: "Analyst", status: "active", lastActive: "5m", queries: 1204 },
  { name: "Mike Torres", email: "mike@acme.co", role: "Analyst", status: "active", lastActive: "1h", queries: 892 },
  { name: "Priya Patel", email: "priya@acme.co", role: "Viewer", status: "active", lastActive: "3h", queries: 67 },
  { name: "Jordan Lee", email: "jordan@acme.co", role: "Engineer", status: "active", lastActive: "yesterday", queries: 512 },
  { name: "Robin Diaz", email: "robin@acme.co", role: "Viewer", status: "invited", lastActive: "—", queries: 0 },
];

const roles = [
  { name: "Admin", icon: Crown, count: 2, perms: ["Manage users", "All queries", "Manage connections", "Billing"], color: "text-warning" },
  { name: "Analyst", icon: Wrench, count: 12, perms: ["Run queries", "Build dashboards", "Export data"], color: "text-primary" },
  { name: "Engineer", icon: Shield, count: 4, perms: ["Manage schema", "Configure connections", "Run queries"], color: "text-accent" },
  { name: "Viewer", icon: Eye, count: 28, perms: ["View dashboards", "Run saved queries"], color: "text-muted-foreground" },
];

const roleBadge: Record<string, string> = {
  Admin: "bg-warning/15 text-warning border-warning/30",
  Analyst: "bg-primary/15 text-primary border-primary/30",
  Engineer: "bg-accent/15 text-accent border-accent/30",
  Viewer: "bg-muted text-muted-foreground border-border",
};

function UsersPage() {
  return (
    <AppShell
      title="Users & Roles"
      subtitle="RBAC across the platform"
      actions={<Button><UserPlus className="h-4 w-4 mr-2" />Invite User</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {roles.map((r) => (
          <Card key={r.name} className="p-4 bg-card/60">
            <div className="flex items-center justify-between mb-3">
              <r.icon className={`h-5 w-5 ${r.color}`} />
              <span className="text-2xl font-semibold">{r.count}</span>
            </div>
            <div className="font-medium text-sm">{r.name}</div>
            <div className="mt-2 space-y-0.5">
              {r.perms.map((p) => (
                <div key={p} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="text-success">✓</span>{p}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-card/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-medium">Team Members</h3>
          <span className="text-xs text-muted-foreground">{users.length} users</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border/60 text-xs">
              <th className="px-5 py-2.5 font-medium">Name</th>
              <th className="px-5 py-2.5 font-medium">Role</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 font-medium text-right">Queries</th>
              <th className="px-5 py-2.5 font-medium text-right">Last active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-border/40 hover:bg-muted/30 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-medium">
                      {u.name.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className={roleBadge[u.role]}>{u.role}</Badge>
                </td>
                <td className="px-5 py-3">
                  {u.status === "active"
                    ? <span className="text-xs text-success flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" />Active</span>
                    : <span className="text-xs text-muted-foreground">Invited</span>}
                </td>
                <td className="px-5 py-3 text-right font-mono text-xs">{u.queries.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-xs text-muted-foreground">{u.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
