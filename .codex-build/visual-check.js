const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "public");
const outDir = path.resolve(__dirname, "visual");
fs.mkdirSync(outDir, { recursive: true });

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  let file = path.join(root, clean);
  if (decoded.endsWith("/")) file = path.join(file, "index.html");
  if (!path.extname(file)) {
    const indexFile = path.join(file, "index.html");
    if (fs.existsSync(indexFile)) file = indexFile;
  }
  if (!file.startsWith(root)) return null;
  return file;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url || "/");
  if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "content-type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const launchOptions = fs.existsSync(chromePath) ? { headless: true, executablePath: chromePath } : { headless: true };
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.route("**/*", (route) => {
    const requestUrl = route.request().url();
    if (requestUrl.startsWith(base)) return route.continue();
    return route.abort();
  });

  const results = { base, screenshots: [], metrics: {}, checks: [] };
  const shot = async (name, target = page) => {
    const file = path.join(outDir, `${name}.png`);
    await target.screenshot({ path: file });
    results.screenshots.push(file);
  };
  const waitForViewportImages = async () => {
    await page.evaluate(async () => {
      const images = Array.from(document.images).filter((img) => {
        const r = img.getBoundingClientRect();
        return r.bottom >= -200 && r.top <= window.innerHeight + 400;
      });
      await Promise.all(images.map((img) => {
        if (img.complete && img.naturalWidth > 0) return true;
        if (typeof img.decode === "function") return img.decode().catch(() => false);
        return new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      }));
    });
  };
  const measure = async (selectors) => page.evaluate((items) => {
    const rectFor = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        selector,
        text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120),
        width: Math.round(r.width),
        height: Math.round(r.height),
        x: Math.round(r.x),
        y: Math.round(r.y),
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      };
    };
    return Object.fromEntries(Object.entries(items).map(([name, selector]) => [name, rectFor(selector)]));
  }, selectors);

  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await waitForViewportImages();
  await shot("home-viewport");
  await page.locator(".factory").scrollIntoViewIfNeeded();
  await waitForViewportImages();
  await shot("home-factory", page.locator(".factory"));
  results.metrics.home = await measure({
    factoryTitle: ".factory .home-section-head__title",
    factoryDescription: ".factory__description",
  });

  await page.goto(`${base}/products/`, { waitUntil: "domcontentloaded" });
  await waitForViewportImages();
  await shot("products-list");
  results.metrics.productsList = await measure({
    firstCard: ".product-listing__card",
    firstMedia: ".product-listing__media",
  });
  results.metrics.productsList.firstImage = await page.evaluate(() => {
    const img = document.querySelector(".product-listing__image");
    if (!img) return null;
    const r = img.getBoundingClientRect();
    const style = getComputedStyle(img);
    return {
      src: img.currentSrc || img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      width: Math.round(r.width),
      height: Math.round(r.height),
      opacity: style.opacity,
      display: style.display,
      objectFit: style.objectFit,
    };
  });

  await page.goto(`${base}/products/pallets/nine-leg_1010/`, { waitUntil: "domcontentloaded" });
  await waitForViewportImages();
  await shot("product-detail");
  results.metrics.productDetail = await measure({
    hero: ".product-hero",
    title: ".product-hero__title",
    media: ".product-hero__media",
  });

  await page.goto(`${base}/resources/case-studies/`, { waitUntil: "domcontentloaded" });
  await waitForViewportImages();
  await shot("case-studies");
  results.metrics.caseStudies = await measure({
    empty: ".resources-empty",
    emptyButton: ".resources-empty .button",
  });

  await page.goto(`${base}/resources/insights/`, { waitUntil: "domcontentloaded" });
  await waitForViewportImages();
  await shot("insights");
  results.metrics.insights = await measure({
    firstCard: ".resource-card",
    firstTitle: ".resource-card__title",
  });

  await page.goto(`${base}/contact/`, { waitUntil: "domcontentloaded" });
  await waitForViewportImages();
  await shot("contact");
  results.metrics.contact = await measure({
    headline: ".contact-hero__headline",
    formTitle: ".contact-form-card__header h2",
  });

  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await waitForViewportImages();
  await page.locator(".site-header__nav-item--mega").hover();
  await page.waitForTimeout(200);
  await shot("mega-menu");
  results.metrics.mega = {
    viewport: await page.evaluate(() => window.innerWidth),
    ...(await measure({
      panel: ".site-header__mega",
      inner: ".site-header__mega-inner",
    })),
  };

  const addCheck = (name, pass, detail) => results.checks.push({ name, pass, detail });
  addCheck("Factory title is not vertically crushed", results.metrics.home.factoryTitle.width > 360 && results.metrics.home.factoryTitle.height < 180, results.metrics.home.factoryTitle);
  addCheck("Product detail title has usable column width", results.metrics.productDetail.title.width > 320 && results.metrics.productDetail.title.height < 260, results.metrics.productDetail.title);
  addCheck("Mega menu spans viewport", results.metrics.mega.panel.width >= results.metrics.mega.viewport - 2, results.metrics.mega.panel);
  addCheck("Resource empty CTA is not stretched full width", results.metrics.caseStudies.emptyButton.width < 360, results.metrics.caseStudies.emptyButton);
  addCheck("Contact form title stays compact", results.metrics.contact.formTitle.height < 150, results.metrics.contact.formTitle);

  await browser.close();
  server.close();
  fs.writeFileSync(path.join(outDir, "visual-check.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.checks.some((check) => !check.pass)) process.exitCode = 1;
})().catch((error) => {
  server.close();
  console.error(error);
  process.exit(1);
});
