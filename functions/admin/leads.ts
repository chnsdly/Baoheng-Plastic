export const onRequestGet: PagesFunction<{ DB: D1Database, ADMIN_KEY: string }> =
async ({ request, env }) => {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "";
  const format = (url.searchParams.get("format") || "").toLowerCase();
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "200", 10) || 200, 1000);

  // 1) 简单鉴权
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2) 查询最近线索
  const rows = await env.DB.prepare(`
    SELECT
      created_at, form_type, name, email, phone, company, country, message,
      page_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content
    FROM leads
    ORDER BY datetime(created_at) DESC
    LIMIT ?
  `).bind(limit).all<{[k:string]:string}>();

  // 3) CSV 导出
  if (format === "csv") {
    const headers = [
      "created_at","form_type","name","email","phone","company","country","message",
      "page_url","utm_source","utm_medium","utm_campaign","utm_term","utm_content"
    ];
    const escape = (v: any) => {
      const s = (v ?? "").toString();
      // CSV 转义：包含逗号/引号/换行时用双引号包裹，并把引号重复一次
      return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
    };
    const csv = [
      headers.join(","),
      ...(rows.results || []).map(r => headers.map(h => escape(r[h])).join(","))
    ].join("\n");

    const h = new Headers();
    h.set("Content-Type", "text/csv; charset=utf-8");
    const date = new Date().toISOString().slice(0,10);
    h.set("Content-Disposition", `attachment; filename="leads-${date}.csv"`);
    return new Response(csv, { headers: h });
  }

 // 4) HTML 简单后台（零依赖）
const esc = (s: any) => (s ?? "").toString()
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const th = (t: string) => `<th>${esc(t)}</th>`;
const td = (t: any) => `<td>${esc(t)}</td>`;

const headers = [
  "created_at",
  "form_type",
  "name",
  "email",
  "phone",
  "company",
  "country",
  "message",
  "page_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content"
];

const rowsHtml = (rows.results || []).map(r => `
  <tr>
    ${headers.map(h => td(r[h])).join("")}
  </tr>
`).join("");

const body = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Leads (${rows.results?.length || 0})</title>

  <style>
    body {
      margin: 0;
      background: #f3f4f6;
      color: #111827;
      font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .wrap {
      max-width: 1600px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-title {
      margin: 0 0 12px;
      font-size: 22px;
      line-height: 1.3;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-bottom: 16px;
      color: #4b5563;
    }

    .toolbar a {
      display: inline-block;
      padding: 5px 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #fff;
      color: #2563eb;
      text-decoration: none;
    }

    .toolbar a:hover {
      background: #eff6ff;
      border-color: #93c5fd;
    }

    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,.06);
      overflow: hidden;
    }

    .table-wrap {
      overflow-x: auto;
    }

    table {
      width: 100%;
      min-width: 1500px;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
      vertical-align: top;
    }

    th {
      position: sticky;
      top: 0;
      z-index: 1;
      background: #f8fafc;
      color: #374151;
      font-weight: 600;
      white-space: nowrap;
    }

    td {
      max-width: 260px;
      word-break: break-word;
      color: #111827;
    }

    tbody tr:nth-child(even) {
      background: #fafafa;
    }

    tbody tr:hover {
      background: #f1f5f9;
    }
  </style>
</head>

<body>
  <div class="wrap">
    <h2 class="page-title">Leads (${rows.results?.length || 0})</h2>

    <div class="toolbar">
      <a href="${esc(`/admin/leads?key=${key}&format=csv&limit=${limit}`)}">下载 CSV</a>
      <span>显示上限：</span>
      <a href="${esc(`/admin/leads?key=${key}&limit=200`)}">200</a>
      <a href="${esc(`/admin/leads?key=${key}&limit=500`)}">500</a>
      <a href="${esc(`/admin/leads?key=${key}&limit=1000`)}">1000</a>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>${headers.map(th).join("")}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>
`;

return new Response(body, {
  headers: {
    "Content-Type": "text/html; charset=utf-8"
  }
});
};
