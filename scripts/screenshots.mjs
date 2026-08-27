import { chromium } from "playwright";

const BASE = process.argv[2] || "https://ai-blog-ten-swart.vercel.app";
const OUT = process.argv[3] || "/private/tmp/claude-501/-Users-unicum-Projects-agent-edu/a6a52daf-92dd-46a8-8900-73cfe1272ac2/scratchpad/screenshots";

const pages = [
  { path: "/", name: "01-gallery-light", vp: { width: 1280, height: 900 } },
  { path: "/posts/tokens-and-context", name: "02-post-tokens-light", vp: { width: 1280, height: 900 } },
  { path: "/posts/spec-not-prompt", name: "03-post-spec-light", vp: { width: 1280, height: 900 } },
  { path: "/posts/rag-basics", name: "04-post-rag-light", vp: { width: 1280, height: 900 } },
  { path: "/glossary", name: "05-glossary-light", vp: { width: 1280, height: 900 } },
  { path: "/", name: "06-gallery-mobile", vp: { width: 390, height: 844 } },
  { path: "/posts/tokens-and-context", name: "07-post-mobile", vp: { width: 390, height: 844 } },
];

const browser = await chromium.launch();
let anyErr = false;
for (const p of pages) {
  const page = await browser.newPage({ viewport: p.vp });
  const errs = [];
  page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errs.push("CONSOLE " + m.text()); });
  await page.goto(BASE + p.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: true });
  console.log(p.name, "-> saved", errs.length ? `(${errs.length} console errors: ${errs.join(" | ")})` : "(no console errors)");
  if (errs.length) anyErr = true;

  // also capture dark mode variant for the light-default pages
  if (p.name.includes("light")) {
    await page.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/${p.name.replace("light", "dark")}.png`, fullPage: true });
    console.log(p.name.replace("light", "dark"), "-> saved");
  }
  await page.close();
}
await browser.close();
console.log(anyErr ? "\nSOME CONSOLE ERRORS FOUND" : "\nNO CONSOLE ERRORS ON ANY PAGE");
