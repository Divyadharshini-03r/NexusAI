import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, FileJson, FileText, Download, Clock, Calendar, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/exports")({
  head: () => ({
    meta: [
      { title: "Exports & Scheduled Reports — NexusIQ" },
      { name: "description", content: "Export query results to CSV, Excel, JSON, or PDF. Schedule automated reports via email." },
    ],
  }),
  component: ExportsPage,
});

const jobs = [
  { id: "e1", name: "Weekly Revenue Report", format: "PDF", schedule: "Every Monday 9:00", recipients: 4, lastRun: "2 days ago", status: "success" as const },
  { id: "e2", name: "Customer Segments", format: "XLSX", schedule: "Daily 06:00", recipients: 12, lastRun: "6h ago", status: "success" as const },
  { id: "e3", name: "Inventory Snapshot", format: "CSV", schedule: "Hourly", recipients: 2, lastRun: "18 min ago", status: "success" as const },
  { id: "e4", name: "Fraud Alerts", format: "JSON", schedule: "Realtime webhook", recipients: 1, lastRun: "3 min ago", status: "warning" as const },
];

const recent = [
  { file: "top_customers_q3.csv", size: "142 KB", when: "10 min ago" },
  { file: "monthly_revenue_2026.xlsx", size: "68 KB", when: "1h ago" },
  { file: "category_performance.pdf", size: "312 KB", when: "yesterday" },
];

function ExportsPage() {
  return (
    <AppShell title="Exports & Reports" subtitle="Download, schedule, and distribute query results">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: FileSpreadsheet, label: "Export as CSV", color: "text-success" },
          { icon: FileSpreadsheet, label: "Export as Excel", color: "text-success" },
          { icon: FileJson, label: "Export as JSON", color: "text-accent" },
          { icon: FileText, label: "Export as PDF", color: "text-destructive" },
        ].map((f) => (
          <Card key={f.label} className="p-4 bg-card/60 hover:border-primary/40 cursor-pointer transition"
            onClick={() => toast.success(`${f.label} — ready`)}>
            <div className="flex items-center gap-3">
              <f.icon className={`h-5 w-5 ${f.color}`} />
              <span className="text-sm font-medium">{f.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-card/60 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Scheduled Reports</h3>
            <Button size="sm" variant="outline"><Calendar className="h-3.5 w-3.5 mr-1.5" />New Schedule</Button>
          </div>
          <div className="space-y-2">
            {jobs.map((j) => (
              <div key={j.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/60 hover:border-primary/40 transition">
                <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{j.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3">
                    <span>{j.schedule}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{j.recipients}</span>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">{j.format}</Badge>
                <Badge variant="secondary" className={j.status === "success" ? "bg-success/15 text-success border-success/30" : "bg-warning/15 text-warning border-warning/30"}>
                  {j.lastRun}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 bg-card/60">
          <h3 className="font-medium mb-4">Recent Downloads</h3>
          <div className="space-y-2">
            {recent.map((r) => (
              <div key={r.file} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/40 transition">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{r.file}</div>
                  <div className="text-[10px] text-muted-foreground">{r.size} · {r.when}</div>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
