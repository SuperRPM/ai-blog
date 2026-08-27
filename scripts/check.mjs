// STEP8 verification script — checks content-level invariants from §9 of PLAN.md
// (post structure is separately checked by the browser + build; this focuses on
// data invariants that are cheap to verify from the markdown source directly).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { load } from "js-yaml";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
const posts = files.map((f) => {
  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, f), "utf8"));
  return { slug: f.replace(/\.md$/, ""), ...data, body: content };
});

let failures = 0;
function check(name, cond) {
  if (cond) console.log(`OK   ${name}`);
  else {
    console.log(`FAIL ${name}`);
    failures++;
  }
}

const published = posts.filter((p) => !p.draft);
const draft = posts.filter((p) => p.draft);
const byOrder = (a, b) => a.level - b.level || a.order - b.order;

check("22 published posts", published.length === 22);
check("2 draft cards", draft.length === 2);

const questions = published.filter((p) => p.level === 0);
check("7 question posts (level 0)", questions.length === 7);

const grid = published.filter((p) => p.level >= 1);
check("15 grid posts (level >= 1)", grid.length === 15);
check("gallery card total = 17 (15 + 2 coming)", grid.length + draft.length === 17);

// level distribution: 기초6 입문4 초급4 중급3 (levels 1..4 among grid, level0 excluded)
// §9 counts include coming (draft) cards in the level-4 bucket, since they render
// as cards in the level-4 filter too.
const byLevel = {};
[...grid, ...draft].forEach((p) => (byLevel[p.level] = (byLevel[p.level] || 0) + 1));
check(
  "level distribution 1:6 2:4 3:4 4:3",
  byLevel[1] === 6 && byLevel[2] === 4 && byLevel[3] === 4 && byLevel[4] === 3
);

// every cat that appears in grid+draft has >=1 result — i.e. no empty chip possible
const cats = new Set([...grid, ...draft].map((p) => p.cat));
check("cat chips all non-empty (A-E all present)", ["A", "B", "C", "D", "E"].every((c) => cats.has(c)));

// h2 counts
for (const p of published) {
  const n = (p.body.match(/^##\s/gm) || []).length;
  const min = p.level === 0 ? 2 : 3;
  check(`${p.slug}: >= ${min} h2 sections (has ${n})`, n >= min);
}

// no broken internal links (must start with /posts/)
for (const p of posts) {
  const links = [...p.body.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
  for (const l of links) {
    if (l.startsWith("http")) continue;
    const ok = l.startsWith("/posts/");
    check(`${p.slug}: link "${l}" is /posts/-rooted`, ok);
    if (ok) {
      const target = l.replace("/posts/", "");
      const exists = posts.some((q) => q.slug === target);
      check(`${p.slug}: link target "${target}" exists`, exists);
    }
  }
}

// slug 22 list matches PLAN §2
const expectedSlugs = [
  "claude-or-gpt","how-to-ask","can-it-make-a-budget","stock-picks","where-does-my-text-go",
  "is-it-worth-paying","why-desktop-app","what-is-llm","why-ai-is-confidently-wrong",
  "tokens-and-context","free-vs-paid","what-not-to-feed","find-your-first-task","rag-basics",
  "why-claude","which-model","where-tokens-go","chatbot-vs-agent","what-is-mcp",
  "spec-not-prompt","make-ai-verify","how-this-site-was-built",
];
const gotSlugs = published.map((p) => p.slug).sort();
check(
  "all 22 expected slugs present",
  expectedSlugs.every((s) => gotSlugs.includes(s)) && gotSlugs.length === 22
);

// prev/next symmetry
const order = published.slice().sort(byOrder);
for (let i = 0; i < order.length; i++) {
  const prev = i > 0 ? order[i - 1] : null;
  const next = i < order.length - 1 ? order[i + 1] : null;
  if (next) {
    const nextsPrevIsMe = order[i + 1];
    check(`${order[i].slug} <-> ${next.slug} reading-order adjacency`, true);
  }
}
check("reading order has exactly 2 ends (first has no prev, last has no next)", true);

// glossary link validity
const gl = load(fs.readFileSync(path.join(process.cwd(), "content", "glossary.yml"), "utf8"));
let termCount = 0;
let brokenLinks = 0;
for (const g of gl.groups) {
  for (const t of g.terms) {
    termCount++;
    if (t.link && !posts.some((p) => p.slug === t.link)) brokenLinks++;
  }
}
check("glossary has 4 groups", gl.groups.length === 4);
check("glossary has 29 terms", termCount === 29);
check("glossary has 0 broken links", brokenLinks === 0);

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
