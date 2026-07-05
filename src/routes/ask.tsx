import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { mockGenerateSql, validateSql } from "@/lib/mock/data";
import { Sparkles, Play, ShieldCheck, ShieldAlert, Zap, BookOpen, Copy, Mic, MicOff, Volume2, Square } from "lucide-react";
import { toast } from "sonner";
import { useSpeechRecognition, useSpeech } from "@/hooks/use-voice";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask AI — Natural Language to SQL" },
      { name: "description", content: "Convert plain English questions into safe, optimized SQL with AI explanations." },
    ],
  }),
  component: AskPage,
});

const suggestions = [
  "Top 5 customers by revenue last quarter",
  "Monthly revenue trend for 2026",
  "Which categories are underperforming?",
  "Delete stale sessions older than 90 days",
];

const sampleRows = [
  { name: "Acme Corp", revenue: 128400 },
  { name: "Globex", revenue: 96200 },
  { name: "Initech", revenue: 84500 },
  { name: "Umbrella", revenue: 72100 },
  { name: "Soylent", revenue: 61800 },
];

function AskPage() {
  const [question, setQuestion] = useState("Top 5 customers by revenue last quarter");
  const [sql, setSql] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [safety, setSafety] = useState<{ ok: boolean; reason?: string } | null>(null);
  const [executed, setExecuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const mic = useSpeechRecognition((text) => {
    setQuestion(text);
    toast.success("Voice captured");
  });
  const tts = useSpeech();

  const toggleMic = () => {
    if (!mic.supported) return toast.error("Voice input not supported in this browser");
    mic.listening ? mic.stop() : mic.start();
  };

  const speakInsights = () => {
    if (!tts.supported) return toast.error("Text-to-speech not supported");
    if (tts.speaking) return tts.stop();
    const parts = [
      sql ? `Generated SQL. ${sql}` : "",
      explanation ? `Explanation. ${explanation}` : "",
      executed && safety?.ok ? `Results: ${sampleRows.map(r => `${r.name} ${r.revenue} dollars`).join(", ")}.` : "",
    ].filter(Boolean).join(" ");
    if (!parts) return toast.error("Nothing to read yet — generate a query first");
    tts.speak(parts);
  };

  const generate = () => {
    setLoading(true);
    setExecuted(false);
    setTimeout(() => {
      const generated = mockGenerateSql(question);
      const safe = validateSql(generated);
      setSql(generated);
      setSafety(safe);
      setExplanation(
        "This query joins `customers` and `orders` on `customer_id`, filters to the last 90 days, then aggregates total spend per customer. `ORDER BY revenue DESC LIMIT 5` returns the top spenders. A join is required because customer names live in a separate table from the transactional data.",
      );
      setLoading(false);
    }, 700);
  };

  const execute = () => {
    if (!safety?.ok) return toast.error("Query blocked by safety validator");
    setExecuted(true);
    toast.success("Query executed · 5 rows in 142ms");
  };

  return (
    <AppShell title="Ask AI" subtitle="Natural language → SQL, safely">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 bg-card/60">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Ask a question</label>
            <div className="relative mt-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                className="bg-background/60 resize-none pr-12"
                placeholder="e.g. Which products had the highest refund rate last month?"
              />
              <Button
                type="button"
                variant={mic.listening ? "default" : "outline"}
                size="icon"
                onClick={toggleMic}
                className="absolute top-2 right-2 h-8 w-8"
                title={mic.listening ? "Stop listening" : "Speak your question"}
              >
                {mic.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuestion(s)}
                  className="text-xs px-2.5 py-1 rounded-md border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={generate} disabled={loading}>
                <Sparkles className="h-4 w-4 mr-2" />
                {loading ? "Generating…" : "Generate SQL"}
              </Button>
              <Button variant="outline" onClick={execute} disabled={!sql}>
                <Play className="h-4 w-4 mr-2" />Execute
              </Button>
              <Button variant="outline" onClick={speakInsights} disabled={!sql}>
                {tts.speaking ? <Square className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                {tts.speaking ? "Stop" : "Read aloud"}
              </Button>
            </div>
          </Card>

          {sql && (
            <Card className="p-0 bg-card/60 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Generated SQL</span>
                  {safety?.ok ? (
                    <Badge variant="secondary" className="gap-1 bg-success/15 text-success border-success/30">
                      <ShieldCheck className="h-3 w-3" />Safe SELECT
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <ShieldAlert className="h-3 w-3" />Blocked
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(sql); toast.success("Copied"); }}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <pre className="p-4 text-sm overflow-x-auto"><code className="text-foreground/90">{sql}</code></pre>
              {!safety?.ok && (
                <div className="px-4 py-2.5 bg-destructive/10 border-t border-destructive/30 text-sm text-destructive">
                  {safety?.reason}
                </div>
              )}
            </Card>
          )}

          {executed && safety?.ok && (
            <Card className="p-5 bg-card/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Results</h3>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>142 ms</span><span>·</span><span>5 rows</span><span>·</span><span>2 tables scanned</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-border">
                        <th className="py-2 font-medium">name</th>
                        <th className="py-2 font-medium text-right">revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRows.map((r) => (
                        <tr key={r.name} className="border-b border-border/50">
                          <td className="py-2">{r.name}</td>
                          <td className="py-2 text-right font-mono">${r.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sampleRows}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Bar dataKey="revenue" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {explanation && (
            <Card className="p-5 bg-card/60">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <h3 className="font-medium">AI Explanation</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
            </Card>
          )}
          {sql && (
            <Card className="p-5 bg-card/60">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-warning" />
                <h3 className="font-medium">Optimization Hints</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><span className="text-warning">•</span>Avoid <code className="text-xs bg-muted px-1 rounded">SELECT *</code> — enumerate columns.</li>
                <li className="flex gap-2"><span className="text-warning">•</span>Add index on <code className="text-xs bg-muted px-1 rounded">orders.customer_id</code>.</li>
                <li className="flex gap-2"><span className="text-success">✓</span>Join predicate uses primary key.</li>
              </ul>
            </Card>
          )}
          <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h3 className="font-medium text-sm mb-2">Safety guarantee</h3>
            <p className="text-xs text-muted-foreground">
              Only <code className="bg-muted px-1 rounded">SELECT</code> / <code className="bg-muted px-1 rounded">WITH</code> statements execute.
              DROP, DELETE, UPDATE, ALTER, TRUNCATE, CREATE, EXEC are blocked before reaching the database.
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
