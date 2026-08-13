const ADMIN_SESSION_COOKIE = "baoheng_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 20 * 60;
const encoder = new TextEncoder();

const securityHeaders = (contentType?: string) => {
  const headers = new Headers();
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "no-store");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
  return headers;
};

const loginResponse = (message = "") => new Response(`<!doctype html>
<html><head><meta charset="utf-8"><title>Lead admin sign in</title></head>
<body><main><h1>Lead admin sign in</h1>${message ? `<p>${message}</p>` : ""}
<form method="post" action="/admin/leads"><label>Admin key <input type="password" name="adminKey" autocomplete="current-password" required></label><button type="submit">Sign in</button></form>
</main></body></html>`, {
  status: 401,
  headers: securityHeaders("text/html; charset=utf-8")
});

const constantTimeEqual = async (left: string, right: string) => {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right))
  ]);
  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let mismatch = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    mismatch |= leftBytes[index] ^ rightBytes[index];
  }
  return mismatch === 0;
};

const sessionKey = (adminKey: string) => crypto.subtle.importKey(
  "raw",
  encoder.encode(adminKey),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
);

const toBase64Url = (bytes: Uint8Array) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const fromBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
};

const createSessionToken = async (adminKey: string) => {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = `v1.${expiresAt}`;
  const signature = await crypto.subtle.sign("HMAC", await sessionKey(adminKey), encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
};

const verifySessionToken = async (token: string, adminKey: string) => {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1" || !/^\d+$/.test(parts[1])) return false;
  const expiresAt = Number(parts[1]);
  const now = Math.floor(Date.now() / 1000);
  if (expiresAt < now || expiresAt > now + ADMIN_SESSION_TTL_SECONDS + 60) return false;
  try {
    return await crypto.subtle.verify(
      "HMAC",
      await sessionKey(adminKey),
      fromBase64Url(parts[2]),
      encoder.encode(`${parts[0]}.${parts[1]}`)
    );
  } catch {
    return false;
  }
};

const cookieValue = (cookieHeader: string, name: string) => {
  for (const item of cookieHeader.split(";")) {
    const separator = item.indexOf("=");
    if (separator >= 0 && item.slice(0, separator).trim() === name) {
      return item.slice(separator + 1).trim();
    }
  }
  return "";
};

const neutralizeCsvFormula = (value: unknown) => {
  const text = (value ?? "").toString();
  const firstNonWhitespace = text.trimStart();
  const startsWithControl = /^[\p{Z}\uFEFF]*\p{Cc}/u.test(text);
  return /^[=+\-@]/.test(firstNonWhitespace) || startsWithControl ? `'${text}` : text;
};

const escapeCsvCell = (value: unknown) => {
  const safe = neutralizeCsvFormula(value);
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

const sanitizeSummaryLocator = (value: unknown) => {
  const text = (value ?? "").toString().trim();
  if (!text) return "";
  try {
    const parsed = new URL(text, "https://summary.invalid");
    const clean = `${parsed.pathname}`.replace(/\/{2,}/g, "/");
    let decoded = clean;
    try { decoded = decodeURIComponent(clean); } catch { /* reject patterns on the encoded path */ }
    if (/[\w.%+-]+@[\w.-]+\.[a-z]{2,}/i.test(decoded) || /(?:\+?\d[\s().-]*){7,}/.test(decoded)) return "";
    return clean === "/" && !text.startsWith("/") ? "" : clean.slice(0, 500);
  } catch {
    return "";
  }
};

const sanitizeSummaryDimension = (value: unknown, maxLength: number) => {
  const text = (value ?? "").toString().trim().toLowerCase();
  return /^[a-z0-9][a-z0-9._-]*$/.test(text) ? text.slice(0, maxLength) : "other";
};

export const onRequestPost: PagesFunction<{ DB: D1Database, ADMIN_KEY: string, SEO_SUMMARY_KEY: string }> =
async ({ request, env }) => {
  let submittedKey = "";
  try {
    const form = await request.formData();
    submittedKey = (form.get("adminKey") ?? "").toString();
  } catch {
    return loginResponse("Invalid sign-in request.");
  }
  if (!env.ADMIN_KEY || !submittedKey || !(await constantTimeEqual(submittedKey, env.ADMIN_KEY))) {
    submittedKey = "";
    return loginResponse("Sign-in failed.");
  }
  submittedKey = "";
  const headers = securityHeaders();
  headers.set("Location", "/admin/leads");
  headers.set(
    "Set-Cookie",
    `${ADMIN_SESSION_COOKIE}=${await createSessionToken(env.ADMIN_KEY)}; Max-Age=${ADMIN_SESSION_TTL_SECONDS}; Path=/admin/leads; HttpOnly; Secure; SameSite=Strict`
  );
  return new Response(null, { status: 303, headers });
};

export const onRequestGet: PagesFunction<{ DB: D1Database, ADMIN_KEY: string, SEO_SUMMARY_KEY: string }> =
async ({ request, env }) => {
  const url = new URL(request.url);
  const format = (url.searchParams.get("format") || "").toLowerCase();
  const limit = Math.max(1, Math.min(parseInt(url.searchParams.get("limit") || "200", 10) || 200, 1000));

  const bearerMatch = request.headers.get("Authorization")?.match(/^Bearer\s+(.+)$/i);
  const summaryBearerIsValid = Boolean(
    format === "seo-summary" && env.SEO_SUMMARY_KEY && bearerMatch && await constantTimeEqual(bearerMatch[1], env.SEO_SUMMARY_KEY)
  );
  const bearerIsValid = Boolean(
    env.ADMIN_KEY && bearerMatch && await constantTimeEqual(bearerMatch[1], env.ADMIN_KEY)
  );
  const sessionToken = cookieValue(request.headers.get("Cookie") || "", ADMIN_SESSION_COOKIE);
  const sessionIsValid = Boolean(
    env.ADMIN_KEY && sessionToken && await verifySessionToken(sessionToken, env.ADMIN_KEY)
  );
  if (format === "seo-summary" && !summaryBearerIsValid) {
    return new Response("Unauthorized", { status: 401, headers: securityHeaders("text/plain; charset=utf-8") });
  }
  if (format !== "seo-summary" && !bearerIsValid && !sessionIsValid) return loginResponse();

  if (format === "seo-summary") {
    try {
      const privacyThreshold = 3;
      const total = await env.DB.prepare(`SELECT COUNT(*) AS total_count FROM leads`).first<Record<string, unknown>>();
      const summary = await env.DB.prepare(`
        SELECT
          landing_page_url, content_asset, intent, language,
          COUNT(*) AS lead_count, MAX(created_at) AS last_seen
        FROM leads
        GROUP BY landing_page_url, content_asset, intent, language
        HAVING COUNT(*) >= ?
        ORDER BY lead_count DESC, last_seen DESC
        LIMIT ?
      `).bind(privacyThreshold, Math.min(limit, 500)).all<Record<string, unknown>>();

      const groups = (summary.results || []).map(row => ({
        landing_page: sanitizeSummaryLocator(row.landing_page_url),
        content_asset: sanitizeSummaryLocator(row.content_asset),
        intent: sanitizeSummaryDimension(row.intent, 100),
        language: sanitizeSummaryDimension(row.language, 20),
        count: Number(row.lead_count) || 0,
        last_seen: (row.last_seen ?? "").toString()
      }));
      return Response.json(
        {
          status: "ok",
          privacy: "aggregate_only",
          privacy_threshold: privacyThreshold,
          total_count: Number(total?.total_count) || 0,
          group_count: groups.length,
          groups
        },
        { headers: securityHeaders("application/json; charset=utf-8") }
      );
    } catch (error) {
      const errorText = error instanceof Error ? error.message : String(error);
      if (!/no such column|no column named|has no column named/i.test(errorText)) throw error;
      return Response.json(
        { status: "migration_required", code: "lead_attribution_columns_missing" },
        { status: 409, headers: securityHeaders("application/json; charset=utf-8") }
      );
    }
  }

  // 2) 查询最近线索
  let rows: { results?: Array<Record<string, unknown>> };
  try {
    rows = await env.DB.prepare(`
      SELECT
        created_at, form_type, name, email, phone, company, country, message,
        page_url, intent, industry, product, language, referrer_url, landing_page_url, content_asset,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content
      FROM leads
      ORDER BY datetime(created_at) DESC
      LIMIT ?
    `).bind(limit).all<Record<string, unknown>>();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/no such column|no column named|has no column named/i.test(message)) throw error;

    // Keep the admin view available while the additive attribution migration rolls out.
    rows = await env.DB.prepare(`
      SELECT
        created_at, form_type, name, email, phone, company, country, message,
        page_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content
      FROM leads
      ORDER BY datetime(created_at) DESC
      LIMIT ?
    `).bind(limit).all<Record<string, unknown>>();
  }

  // 3) CSV 导出
  if (format === "csv") {
    const headers = [
      "created_at","form_type","name","email","phone","company","country","message",
      "page_url","intent","industry","product","language","referrer_url","landing_page_url","content_asset",
      "utm_source","utm_medium","utm_campaign","utm_term","utm_content"
    ];
    /* Formula neutralization happens before RFC 4180-style quoting in escapeCsvCell.
      // CSV 转义：包含逗号/引号/换行时用双引号包裹，并把引号重复一次
    */
    const csv = [
      headers.join(","),
      ...(rows.results || []).map(r => headers.map(h => escapeCsvCell(r[h])).join(","))
    ].join("\n");

    const h = securityHeaders("text/csv; charset=utf-8");
    const date = new Date().toISOString().slice(0,10);
    h.set("Content-Disposition", `attachment; filename="leads-${date}.csv"`);
    return new Response(csv, { headers: h });
  }

 // 4) HTML 简单后台（零依赖）
const esc = (s: any) => (s ?? "").toString()
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const columns = [
  { key: "created_at",   label: "created_at",   width: 150 },
  { key: "form_type",    label: "form_type",    width: 110 },
  { key: "name",         label: "name",         width: 140 },
  { key: "email",        label: "email",        width: 220 },
  { key: "phone",        label: "phone",        width: 160 },
  { key: "company",      label: "company",      width: 180 },
  { key: "country",      label: "country",      width: 120 },
  { key: "message",      label: "message",      width: 420, className: "message" },
  { key: "page_url",     label: "page_url",     width: 360, className: "url" },
  { key: "intent",       label: "intent",       width: 150 },
  { key: "industry",     label: "industry",     width: 150 },
  { key: "product",      label: "product",      width: 220 },
  { key: "language",     label: "language",     width: 90 },
  { key: "referrer_url", label: "referrer_url", width: 320, className: "url" },
  { key: "landing_page_url", label: "landing_page_url", width: 320, className: "url" },
  { key: "content_asset", label: "content_asset", width: 320, className: "url" },
  { key: "utm_source",   label: "utm_source",   width: 130 },
  { key: "utm_medium",   label: "utm_medium",   width: 130 },
  { key: "utm_campaign", label: "utm_campaign", width: 180 },
  { key: "utm_term",     label: "utm_term",     width: 150 },
  { key: "utm_content",  label: "utm_content",  width: 180 }
];

const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

const th = (col: any) => `<th>${esc(col.label)}</th>`;

const td = (col: any, row: any) => {
  const value = row[col.key];
  const className = col.className ? ` class="${col.className}"` : "";

  return `
    <td${className}>
      <div class="cell" title="${esc(value)}">${esc(value)}</div>
    </td>
  `;
};

const rowsHtml = (rows.results || []).map(r => `
  <tr>
    ${columns.map(col => td(col, r)).join("")}
  </tr>
`).join("");

const colgroup = columns.map(col => `<col style="width:${col.width}px">`).join("");

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
      overflow: auto;
      max-height: calc(100vh - 140px);
    }

    table {
      width: ${totalWidth}px;
      min-width: ${totalWidth}px;
      table-layout: fixed;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
      vertical-align: top;
      box-sizing: border-box;
    }

    th {
      position: sticky;
      top: 0;
      z-index: 2;
      background: #f8fafc;
      color: #374151;
      font-weight: 600;
      white-space: nowrap;
    }

    .cell {
      height: 44px;
      line-height: 22px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    td.message .cell {
      white-space: pre-wrap;
      overflow: auto;
      word-break: break-word;
    }

    td.url .cell {
      color: #2563eb;
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
      <a href="${esc(`/admin/leads?format=csv&limit=${limit}`)}">下载 CSV</a>
      <span>显示上限：</span>
      <a href="${esc(`/admin/leads?limit=200`)}">200</a>
      <a href="${esc(`/admin/leads?limit=500`)}">500</a>
      <a href="${esc(`/admin/leads?limit=1000`)}">1000</a>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table>
          <colgroup>${colgroup}</colgroup>
          <thead>
            <tr>${columns.map(th).join("")}</tr>
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

return new Response(body, { headers: securityHeaders("text/html; charset=utf-8") });
};
