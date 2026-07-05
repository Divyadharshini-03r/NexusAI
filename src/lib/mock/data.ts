export interface QueryHistoryItem {
  id: string;
  question: string;
  sql: string;
  status: "success" | "blocked" | "error";
  rows: number;
  executionMs: number;
  timestamp: string;
}

export const kpis = [
  { label: "Total Revenue", value: "$2.48M", delta: "+12.4%", trend: "up" },
  { label: "Orders", value: "18,942", delta: "+3.1%", trend: "up" },
  { label: "Active Customers", value: "6,214", delta: "+8.7%", trend: "up" },
  { label: "Avg Order Value", value: "$131.02", delta: "-1.2%", trend: "down" },
  { label: "Profit Margin", value: "27.4%", delta: "+0.8%", trend: "up" },
  { label: "Refund Rate", value: "1.9%", delta: "-0.3%", trend: "up" },
];

export const revenueByMonth = [
  { month: "Jan", revenue: 182000, orders: 1420, profit: 48000 },
  { month: "Feb", revenue: 198000, orders: 1510, profit: 52400 },
  { month: "Mar", revenue: 221000, orders: 1680, profit: 60100 },
  { month: "Apr", revenue: 205000, orders: 1590, profit: 55700 },
  { month: "May", revenue: 240000, orders: 1820, profit: 66200 },
  { month: "Jun", revenue: 268000, orders: 2010, profit: 74300 },
  { month: "Jul", revenue: 291000, orders: 2180, profit: 81900 },
  { month: "Aug", revenue: 275000, orders: 2050, profit: 76500 },
  { month: "Sep", revenue: 302000, orders: 2260, profit: 85600 },
  { month: "Oct", revenue: 318000, orders: 2380, profit: 91100 },
];

export const categoryShare = [
  { name: "Electronics", value: 38 },
  { name: "Apparel", value: 22 },
  { name: "Home", value: 18 },
  { name: "Beauty", value: 12 },
  { name: "Sports", value: 10 },
];

export const topProducts = [
  { product: "Nimbus Headphones", units: 4210, revenue: 421000 },
  { product: "Orbit Smartwatch", units: 3820, revenue: 573000 },
  { product: "Loop Backpack", units: 3105, revenue: 217350 },
  { product: "Pulse Sneakers", units: 2890, revenue: 346800 },
  { product: "Halo Lamp", units: 2540, revenue: 127000 },
];

export const queryHistory: QueryHistoryItem[] = [
  {
    id: "q_001",
    question: "Top 5 customers by revenue last quarter",
    sql: "SELECT c.name, SUM(o.total) AS revenue\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nWHERE o.created_at >= DATE_TRUNC('quarter', NOW()) - INTERVAL '3 months'\nGROUP BY c.name\nORDER BY revenue DESC\nLIMIT 5;",
    status: "success",
    rows: 5,
    executionMs: 142,
    timestamp: "2026-07-03T09:42:00Z",
  },
  {
    id: "q_002",
    question: "Monthly revenue trend for 2026",
    sql: "SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue\nFROM orders\nWHERE created_at >= '2026-01-01'\nGROUP BY month\nORDER BY month;",
    status: "success",
    rows: 10,
    executionMs: 88,
    timestamp: "2026-07-03T09:12:00Z",
  },
  {
    id: "q_003",
    question: "Delete stale sessions older than 90 days",
    sql: "DELETE FROM sessions WHERE last_seen < NOW() - INTERVAL '90 days';",
    status: "blocked",
    rows: 0,
    executionMs: 0,
    timestamp: "2026-07-02T16:20:00Z",
  },
  {
    id: "q_004",
    question: "Product categories with negative growth",
    sql: "WITH monthly AS (\n  SELECT category, DATE_TRUNC('month', created_at) m, SUM(total) s\n  FROM orders GROUP BY 1,2\n)\nSELECT category FROM monthly\nGROUP BY category\nHAVING (MAX(s) FILTER (WHERE m = DATE_TRUNC('month', NOW())))\n     < (MAX(s) FILTER (WHERE m = DATE_TRUNC('month', NOW() - INTERVAL '1 month')));",
    status: "success",
    rows: 2,
    executionMs: 312,
    timestamp: "2026-07-02T11:05:00Z",
  },
];

export const schema = [
  {
    table: "customers",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "name", type: "text" },
      { name: "email", type: "text" },
      { name: "created_at", type: "timestamptz" },
    ],
  },
  {
    table: "orders",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "total", type: "numeric" },
      { name: "status", type: "text" },
      { name: "created_at", type: "timestamptz" },
    ],
  },
  {
    table: "products",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "name", type: "text" },
      { name: "category", type: "text" },
      { name: "price", type: "numeric" },
    ],
  },
  {
    table: "order_items",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "order_id", type: "uuid", fk: "orders.id" },
      { name: "product_id", type: "uuid", fk: "products.id" },
      { name: "quantity", type: "int" },
    ],
  },
];

export const templates = [
  { title: "Top customers by revenue", desc: "Rank customers over a chosen window.", category: "Sales" },
  { title: "Monthly revenue trend", desc: "Aggregate revenue by month with growth %.", category: "Finance" },
  { title: "Category performance", desc: "Compare category revenue and margin.", category: "Product" },
  { title: "Cohort retention", desc: "Retention by signup month over 12 weeks.", category: "Growth" },
  { title: "Refund rate by product", desc: "Detect quality issues in inventory.", category: "Ops" },
  { title: "Anomaly detection", desc: "Flag daily revenue outliers (>2σ).", category: "AI" },
];

const DESTRUCTIVE = /\b(DROP|DELETE|UPDATE|ALTER|TRUNCATE|CREATE|EXEC|INSERT|GRANT|REVOKE)\b/i;

export function validateSql(sql: string): { ok: boolean; reason?: string } {
  if (!sql.trim()) return { ok: false, reason: "Empty query." };
  if (DESTRUCTIVE.test(sql)) return { ok: false, reason: "Only SELECT statements are permitted. Destructive keyword detected." };
  if (!/^\s*(WITH|SELECT)\b/i.test(sql.trim())) return { ok: false, reason: "Query must start with SELECT or WITH." };
  return { ok: true };
}

export function mockGenerateSql(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("top") && q.includes("customer"))
    return "SELECT c.name, SUM(o.total) AS revenue\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nWHERE o.created_at >= NOW() - INTERVAL '90 days'\nGROUP BY c.name\nORDER BY revenue DESC\nLIMIT 10;";
  if (q.includes("monthly") || q.includes("month"))
    return "SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue\nFROM orders\nGROUP BY month\nORDER BY month;";
  if (q.includes("category"))
    return "SELECT p.category, SUM(oi.quantity * p.price) AS revenue\nFROM order_items oi\nJOIN products p ON p.id = oi.product_id\nGROUP BY p.category\nORDER BY revenue DESC;";
  return "SELECT *\nFROM orders\nWHERE created_at >= NOW() - INTERVAL '30 days'\nORDER BY created_at DESC\nLIMIT 100;";
}
