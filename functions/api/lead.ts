// [新增说明] 在类型里加上 N8N_WEBHOOK_URL，供后面调用 n8n 使用
export const onRequestPost: PagesFunction<{
  DB: D1Database,
  R2: R2Bucket,
  TURNSTILE_SECRET: string,
  N8N_WEBHOOK_URL: string, // [新增] n8n Webhook 的完整 URL，由 Cloudflare Pages 环境变量提供
}> = async ({ request, env }) => {
  const f = await request.formData();

  // 1) 蜜罐（有值直接吞）
  if ((f.get("website") as string)?.trim()) {
    return new Response("ok", { status: 200 });
  }

  // 2) Turnstile 服务端校验
  const token = String(f.get("cf-turnstile-response") || "");
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const v = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: token,
      remoteip: ip
    }),
  }).then(r => r.json());

  if (!v.success) {
    return new Response("Bot check failed", { status: 400 });
  }

  // 3) 取字段
  const now = new Date().toISOString();
  const get = (k: string) => String(f.get(k) || "").trim();
  const email = get("email");
  const name = get("name");
  const company = get("company");
  const country = get("country");
  const message = get("message");
  const formType = get("form_type") || "contact";
  const pageUrl = get("page_url");               // 也可换成 request.headers.get("Referer") 兜底
  const downloadSlug = get("download_slug");
  const consent = get("consent") || "no";
  const utm = (k: string) => get(k);
  const ua = request.headers.get("User-Agent") || "";

  // [新增] 从表单中取 phone 字段，前端表单需要增加 name="phone" 的输入框
  const phone = get("phone");

  // [新增] 统一构造一份线索数据，既给 D1 用，也给 n8n 用
  const leadPayload = {
    name,
    email,
    phone,
    company,
    country,
    message,
    formType,
    pageUrl,
    createdAt: now,
    ip,
    userAgent: ua,
    consent,
    utm_source: utm("utm_source"),
    utm_medium: utm("utm_medium"),
    utm_campaign: utm("utm_campaign"),
    utm_term: utm("utm_term"),
    utm_content: utm("utm_content"),
  };

  // 4) 入库（leads）
  // [变更说明] 这里给 leads 表新增 phone 列：
  //  (created_at, name, email, phone, company, ...) 并在 VALUES 中增加一个占位符和绑定参数
  //  上线前请先在 D1 执行：ALTER TABLE leads ADD COLUMN phone TEXT;
  await env.DB.prepare(`
    INSERT INTO leads
      (created_at, name, email, phone, company, country, message, form_type, page_url,
       utm_source, utm_medium, utm_campaign, utm_term, utm_content, ip, user_agent, consent)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    now,
    name,
    email,
    phone,            // [新增绑定] phone
    company,
    country,
    message,
    formType,
    pageUrl,
    utm("utm_source"),
    utm("utm_medium"),
    utm("utm_campaign"),
    utm("utm_term"),
    utm("utm_content"),
    ip,
    ua,
    consent
  ).run();

  // [新增] 5) 写完 D1 之后，把同一份线索数据 POST 给 n8n Webhook
  // 目的：让 n8n → Espo 自动生成“潜在客户”
  // 这里用 try/catch，避免 n8n 暂时不可用时影响用户提交体验
  try {
    if (env.N8N_WEBHOOK_URL) {
      await fetch(env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadPayload),
      });
    }
  } catch (err) {
    // [可选记录] 这里只做日志，不向前端暴露错误
    console.error("Failed to send lead to n8n", err);
  }

  // 6) 下载型：写票据 + Set-Cookie + 303 跳感谢页（带 ?dl=slug）
  if (formType === "download" && downloadSlug) {
    const id = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await env.DB.prepare(`
      INSERT INTO tickets (id, slug, created_at, expires_at)
      VALUES (?,?,?,?)
    `).bind(id, downloadSlug, now, expiresAt).run();

    const url = new URL("/thanks/", request.url);
    url.searchParams.set("dl", downloadSlug);

    return new Response(null, {
      status: 303,
      headers: {
        "Location": url.toString(),
        "Set-Cookie": `dl_ticket=${id}; Path=/downloads; HttpOnly; Secure; SameSite=Lax; Max-Age=900`
      }
    });
  }

  // 7) 联系表单：无票据，直接去 /thanks/
  return new Response(null, {
    status: 303,
    headers: { "Location": new URL("/thanks/", request.url).toString() }
  });
};
