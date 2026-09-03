interface LeadEnvironment {
  DB: D1Database;
  R2: R2Bucket;
  TURNSTILE_SECRET: string;
  N8N_WEBHOOK_URL?: string;
}

const MAX_LENGTHS: Record<string, number> = {
  name: 200,
  email: 320,
  phone: 100,
  company: 250,
  country: 120,
  message: 5000,
  form_type: 80,
  page_url: 512,
  download_slug: 200,
  intent: 160,
  industry: 160,
  product: 250,
  language: 20,
  referrer_url: 512,
  landing_page_url: 512,
  content_asset: 512,
  utm_source: 160,
  utm_medium: 160,
  utm_campaign: 160,
  utm_term: 160,
  utm_content: 160,
};

const THANKS_PATHS: Record<string, string> = {
  en: "/thanks/",
  es: "/es/thanks/",
  fr: "/fr/thanks/",
  ru: "/ru/thanks/",
  zh: "/zh/thanks/",
};

function getThanksUrl(language: string, requestUrl: string): URL {
  const normalizedLanguage = language.trim().toLowerCase();
  return new URL(THANKS_PATHS[normalizedLanguage] || THANKS_PATHS.en, requestUrl);
}

function cleanPageUrl(value: string, requestUrl: string): string {
  if (!value) return "";
  try {
    const url = new URL(value, requestUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    if (url.origin !== new URL(requestUrl).origin) return "";
    return `${url.origin}${url.pathname}`.slice(0, 512);
  } catch (_) {
    return "";
  }
}

function cleanReferrerUrl(value: string, requestUrl: string): string {
  if (!value) return "";
  try {
    const url = new URL(value, requestUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    const requestOrigin = new URL(requestUrl).origin;
    return (url.origin === requestOrigin ? `${url.origin}${url.pathname}` : url.origin).slice(0, 512);
  } catch (_) {
    return "";
  }
}

function cleanAsset(value: string): string {
  if (!value) return "";
  try {
    const url = new URL(value, "https://www.baohengplastic.com");
    return url.pathname.startsWith("/resources/") ? url.pathname.slice(0, 512) : "";
  } catch (_) {
    return "";
  }
}

export const onRequestPost: PagesFunction<LeadEnvironment> = async ({ request, env }) => {
  const form = await request.formData();

  if (String(form.get("website") || "").trim()) {
    return new Response("ok", { status: 200 });
  }

  const token = String(form.get("cf-turnstile-response") || "");
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: token,
      remoteip: ip,
    }),
  }).then((response) => response.json() as Promise<{ success?: boolean }>);

  if (!verification.success) {
    return new Response("Bot check failed", { status: 400 });
  }

  const get = (key: string): string => {
    const value = String(form.get(key) || "").trim();
    return value.slice(0, MAX_LENGTHS[key] || 512);
  };

  const now = new Date().toISOString();
  const pageUrl = cleanPageUrl(get("page_url") || request.headers.get("Referer") || "", request.url);
  const referrerUrl = cleanReferrerUrl(get("referrer_url"), request.url);
  const landingPageUrl = cleanPageUrl(get("landing_page_url"), request.url);
  const formType = get("form_type") || "contact";
  const downloadSlug = get("download_slug");
  const language = get("language");
  const consent = get("consent");
  const userAgent = (request.headers.get("User-Agent") || "").slice(0, 512);

  const leadPayload = {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    company: get("company"),
    country: get("country"),
    message: get("message"),
    formType,
    pageUrl,
    intent: get("intent"),
    industry: get("industry"),
    product: get("product"),
    language,
    referrerUrl,
    landingPageUrl,
    contentAsset: cleanAsset(get("content_asset")),
    createdAt: now,
    ip,
    userAgent,
    consent,
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_term: get("utm_term"),
    utm_content: get("utm_content"),
  };

  try {
    await env.DB.prepare(`
      INSERT INTO leads
        (created_at, name, email, phone, company, country, message, form_type, page_url,
         intent, industry, product, language, referrer_url, landing_page_url, content_asset,
         utm_source, utm_medium, utm_campaign, utm_term, utm_content, ip, user_agent, consent)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      leadPayload.createdAt, leadPayload.name, leadPayload.email, leadPayload.phone,
      leadPayload.company, leadPayload.country, leadPayload.message, leadPayload.formType,
      leadPayload.pageUrl, leadPayload.intent, leadPayload.industry, leadPayload.product,
      leadPayload.language, leadPayload.referrerUrl, leadPayload.landingPageUrl,
      leadPayload.contentAsset, leadPayload.utm_source, leadPayload.utm_medium,
      leadPayload.utm_campaign, leadPayload.utm_term, leadPayload.utm_content,
      leadPayload.ip, leadPayload.userAgent, leadPayload.consent,
    ).run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/no column named|has no column named/i.test(message)) throw error;

    // Preserve submissions during a rolling deploy if application code arrives before the additive migration.
    await env.DB.prepare(`
      INSERT INTO leads
        (created_at, name, email, phone, company, country, message, form_type, page_url,
         utm_source, utm_medium, utm_campaign, utm_term, utm_content, ip, user_agent, consent)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      leadPayload.createdAt, leadPayload.name, leadPayload.email, leadPayload.phone,
      leadPayload.company, leadPayload.country, leadPayload.message, leadPayload.formType,
      leadPayload.pageUrl, leadPayload.utm_source, leadPayload.utm_medium,
      leadPayload.utm_campaign, leadPayload.utm_term, leadPayload.utm_content,
      leadPayload.ip, leadPayload.userAgent, leadPayload.consent,
    ).run();
  }

  try {
    if (env.N8N_WEBHOOK_URL) {
      await fetch(env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      });
    }
  } catch (error) {
    console.error("Failed to send lead to n8n", error);
  }

  if (formType === "download" && downloadSlug) {
    const id = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await env.DB.prepare(`
      INSERT INTO tickets (id, slug, created_at, expires_at)
      VALUES (?,?,?,?)
    `).bind(id, downloadSlug, now, expiresAt).run();

    const url = getThanksUrl(language, request.url);
    url.searchParams.set("dl", downloadSlug);

    return new Response(null, {
      status: 303,
      headers: {
        Location: url.toString(),
        "Set-Cookie": `dl_ticket=${id}; Path=/downloads; HttpOnly; Secure; SameSite=Lax; Max-Age=900`,
      },
    });
  }

  return new Response(null, {
    status: 303,
    headers: { Location: getThanksUrl(language, request.url).toString() },
  });
};
