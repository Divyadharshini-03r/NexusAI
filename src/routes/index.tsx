import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Database, ShieldCheck, MessageSquareCode } from "lucide-react";
import heroImg from "@/assets/hero-dashboard.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexusIQ — Enterprise AI Data Intelligence" },
      { name: "description", content: "Turn natural language into safe, optimized SQL. Explore dashboards, insights, and enterprise data with AI." },
      { property: "og:title", content: "NexusIQ — Enterprise AI Data Intelligence" },
      { property: "og:description", content: "Natural language to SQL, dashboards, and AI insights for the modern enterprise." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 backdrop-blur bg-background/60 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">NexusIQ</div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate">Data Intelligence</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40" style={{
          background: "radial-gradient(60% 60% at 20% 20%, oklch(0.68 0.19 275 / 0.35), transparent 60%), radial-gradient(50% 50% at 85% 15%, oklch(0.72 0.17 195 / 0.3), transparent 60%)",
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-card/40 text-[11px] sm:text-xs text-muted-foreground mb-4 sm:mb-6">
              <Sparkles className="h-3 w-3 text-accent" /> Powered by GPT-4.1 · Java Spring Boot
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
              Ask your data<br />
              <span className="gradient-text">anything.</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-xl">
              NexusIQ turns natural language into safe, optimized SQL — instantly. Now with voice input and spoken insights.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-11 sm:h-12 px-6 sm:px-8 text-base">
                <Link to="/ask">Get Started<ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <div className="flex items-center gap-3 text-[11px] sm:text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live schema sync</span>
                <span>·</span>
                <span>SOC 2 ready</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-md">
              {[
                { icon: MessageSquareCode, label: "NL → SQL" },
                { icon: Database, label: "40+ sources" },
                { icon: ShieldCheck, label: "Governed" },
              ].map((f) => (
                <div key={f.label} className="rounded-xl border border-border/60 bg-card/40 p-3 text-center">
                  <f.icon className="h-4 w-4 mx-auto text-accent mb-1" />
                  <div className="text-[11px] sm:text-xs text-muted-foreground">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative order-first lg:order-last">
            <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl rounded-3xl" />
            <img
              src={heroImg}
              alt="NexusIQ data intelligence dashboard preview"
              width={1536}
              height={1024}
              className="relative w-full h-auto rounded-xl sm:rounded-2xl border border-border/60 shadow-2xl"
            />
          </div>
        </div>
      </section>


      <footer className="border-t border-border/60 py-6 sm:py-8 text-center text-[11px] sm:text-xs text-muted-foreground px-4">
        © {new Date().getFullYear()} NexusIQ · Enterprise AI Data Intelligence
      </footer>
    </div>
  );
}
