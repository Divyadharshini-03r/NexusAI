import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/mock/data";
import { ArrowRight, LibraryBig } from "lucide-react";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Query Templates — NexusIQ" },
      { name: "description", content: "Pre-built query templates for common business questions." },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  return (
    <AppShell title="Query Templates" subtitle="Run standard reports with one click">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((t) => (
          <Card key={t.title} className="p-5 bg-card/60 group hover:border-primary/50 transition">
            <div className="flex items-start justify-between mb-2">
              <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <LibraryBig className="h-4 w-4" />
              </div>
              <Badge variant="secondary">{t.category}</Badge>
            </div>
            <h3 className="font-medium mt-3">{t.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{t.desc}</p>
            <Button variant="ghost" size="sm" className="px-0 text-primary hover:text-primary">
              Run template <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition" />
            </Button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
