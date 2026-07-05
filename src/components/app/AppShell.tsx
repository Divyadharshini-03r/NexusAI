import { Link, useRouterState } from "@tanstack/react-router";
import { MessageSquareCode, Database, History, LibraryBig, Settings, Sparkles, LayoutGrid, Plug, Download, Users, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/ask", label: "Ask AI", icon: MessageSquareCode },
  { to: "/dashboards", label: "Dashboards", icon: LayoutGrid },
  { to: "/connections", label: "Connections", icon: Plug },
  { to: "/schema", label: "Schema", icon: Database },
  { to: "/history", label: "History", icon: History },
  { to: "/templates", label: "Templates", icon: LibraryBig },
  { to: "/exports", label: "Exports", icon: Download },
  { to: "/users", label: "Users & Roles", icon: Users },
  { to: "/audit", label: "Audit Log", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar/80 backdrop-blur flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold">NexusIQ</div>
            <div className="text-[11px] text-muted-foreground">Data Intelligence</div>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="glass rounded-lg p-3 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="font-medium">postgres · prod</span>
            </div>
            <div className="text-muted-foreground">4 tables · schema cached</div>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 bg-background/60 backdrop-blur">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
