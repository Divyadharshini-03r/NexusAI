import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, Plus, Star, Users, Share2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { revenueByMonth, categoryShare } from "@/lib/mock/data";

export const Route = createFileRoute("/dashboards")({
  head: () => ({
    meta: [
      { title: "Dashboards — NexusIQ" },
      { name: "description", content: "Drag-and-drop dashboards built from AI-generated queries with real-time visualizations." },
    ],
  }),
  component: DashboardsPage,
});

const dashboards = [
  { id: "d1", name: "Executive Overview", owner: "You", widgets: 8, viewers: 42, starred: true, updated: "2h ago" },
  { id: "d2", name: "Revenue Operations", owner: "Sarah K.", widgets: 12, viewers: 18, starred: true, updated: "yesterday" },
  { id: "d3", name: "Product Analytics", owner: "Mike T.", widgets: 6, viewers: 27, starred: false, updated: "3d ago" },
  { id: "d4", name: "Marketing Attribution", owner: "You", widgets: 9, viewers: 11, starred: false, updated: "1w ago" },
];

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function DashboardsPage() {
  return (
    <AppShell
      title="Dashboards"
      subtitle="Live visualizations powered by AI queries"
      actions={<Button><Plus className="h-4 w-4 mr-2" />New Dashboard</Button>}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Featured: Executive Overview</h2>
          <div className="flex gap-2 text-xs">
            <Badge variant="secondary">Live</Badge>
            <Badge variant="outline">Auto-refresh 30s</Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/60 col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Revenue Trend</h3>
              <span className="text-[10px] text-muted-foreground">from `orders`</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#rg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4 bg-card/60">
            <h3 className="text-sm font-medium mb-2">Orders</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="orders" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4 bg-card/60">
            <h3 className="text-sm font-medium mb-2">Category Mix</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryShare} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {categoryShare.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4 bg-card/60 col-span-1 lg:col-span-3">
            <h3 className="text-sm font-medium mb-2">Profit by Month</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="profit" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">All Dashboards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map((d) => (
          <Card key={d.id} className="p-5 bg-card/60 hover:border-primary/40 transition cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-primary" />
              </div>
              {d.starred && <Star className="h-4 w-4 fill-warning text-warning" />}
            </div>
            <h3 className="font-medium mb-1">{d.name}</h3>
            <p className="text-xs text-muted-foreground">by {d.owner} · updated {d.updated}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><LayoutGrid className="h-3 w-3" />{d.widgets} widgets</span>
              <span className="flex items-center gap-1.5"><Users className="h-3 w-3" />{d.viewers} viewers</span>
              <Share2 className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition" />
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
