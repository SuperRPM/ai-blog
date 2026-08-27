// STEP2 migration script: ai-blog/posts.js + posts/*.html -> ai-blog-next/content/posts/*.md
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const SRC = path.resolve('../ai-blog');
const OUT = path.resolve('content/posts');

// 1. Load posts.js data (POSTS, COMING) by evaluating in a sandbox.
const postsSrc = fs.readFileSync(path.join(SRC, 'posts.js'), 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(postsSrc + '\nthis.__POSTS=POSTS;this.__COMING=COMING;', sandbox);
const POSTS = sandbox.__POSTS;
const COMING = sandbox.__COMING;

function esc(s) { return s; }

// --- tiny helpers for extracting the fixed blocks ---
function extractBlock(html, re) {
  const m = html.match(re);
  return m ? m[0] : '';
}
function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').trim();
}
function inlineToMd(html) {
  if (html == null) return '';
  let s = html;
  s = s.replace(/<b>(.*?)<\/b>/gs, '**$1**');
  s = s.replace(/<strong>(.*?)<\/strong>/gs, '**$1**');
  s = s.replace(/<a\s+href="([^"]+)">(.*?)<\/a>/gs, (m, href, text) => {
    if (/^https?:\/\//.test(href)) return `[${text}](${href})`;
    let h = href.replace(/^\.\.\/posts\//, '').replace(/^posts\//, '').replace(/^\.\.\//, '');
    h = h.replace(/\.html$/, '');
    return `[${text}](/posts/${h})`;
  });
  s = s.replace(/<br\s*\/?>/g, '  \n');
  return s.trim();
}

function extractTldr(art) {
  const m = art.match(/<div class="tldr">[\s\S]*?<p>([\s\S]*?)<\/p><\/div>/);
  if (!m) return '';
  return inlineToMd(m[1].replace(/\s+/g, ' ').trim());
}
function extractForwho(art) {
  const m = art.match(/<div class="forwho">([\s\S]*?)<\/div>\s*(?=<div class="myth"|<h2)/);
  if (!m) return null;
  const block = m[1];
  const yes = block.match(/<div class="yes">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  const no = block.match(/<div class="no">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (!yes && !no) return null;
  return {
    yes: yes ? inlineToMd(yes[1].replace(/\s+/g, ' ').trim()) : '',
    no: no ? inlineToMd(no[1].replace(/\s+/g, ' ').trim()) : '',
  };
}
function extractMyth(art) {
  const m = art.match(/<div class="myth">[\s\S]*?<div class="said">([\s\S]*?)<\/div>\s*<div class="real">([\s\S]*?)<\/div>\s*<\/div>/);
  if (!m) return null;
  return {
    said: inlineToMd(m[1].replace(/\s+/g, ' ').trim()).replace(/^"|"$/g, ''),
    real: inlineToMd(m[2].replace(/\s+/g, ' ').trim()),
  };
}
function extractTodo(art) {
  const m = art.match(/<div class="todo">[\s\S]*?<ol>([\s\S]*?)<\/ol><\/div>/);
  if (!m) return [];
  const items = [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) =>
    inlineToMd(x[1].replace(/\s+/g, ' ').trim())
  );
  return items;
}

function removeBlocks(art) {
  let s = art;
  s = s.replace(/<div class="tldr">[\s\S]*?<\/div><\/div>/, '');
  // tldr div structure is <div class="tldr"><div class="k">...</div><p>...</p></div> -- adjust:
  return s;
}

// Body conversion: operate on the article HTML after stripping tldr/forwho/myth/todo.
function convertBody(html) {
  let s = html;

  // Remove fixed blocks first (non-greedy, in order they appear).
  s = s.replace(/<div class="tldr">[\s\S]*?<\/div>\s*<\/div>\n?/, (m) => {
    // tldr = <div class="tldr"><div class="k">...</div><p>...</p></div>
    return '';
  });
  // The above regex is tricky with nested divs; do targeted removal instead.
  return s;
}

// Because tldr/forwho/myth/todo have nested divs, do explicit removal by finding
// the whole outer div via balanced counting.
function removeDivByClass(html, className) {
  const openTag = `<div class="${className}">`;
  const idx = html.indexOf(openTag);
  if (idx === -1) return html;
  let depth = 0;
  let i = idx;
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = idx;
  let m;
  let end = -1;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<div')) depth++;
    else depth--;
    if (depth === 0) {
      end = m.index + m[0].length;
      break;
    }
  }
  if (end === -1) return html;
  return html.slice(0, idx) + html.slice(end);
}

// NOTE: next-mdx-remote's `serialize()` (development/jsxDEV codepath) silently drops
// array/object-literal JSX attribute values (a known incompatibility between
// @mdx-js/mdx's dev JSX transform and estree-util-build-jsx). To sidestep this,
// structured data for <Flow>/<Stack> is passed as a base64-encoded JSON string prop,
// which the component decodes at render time.
function toB64(obj) {
  return Buffer.from(JSON.stringify(obj), 'utf8').toString('base64');
}

function convertFigs(html) {
  let s = html;
  // .flowr blocks
  s = s.replace(/<div class="fig">\s*<div class="flowr">([\s\S]*?)<\/div>\s*<div class="cap">([\s\S]*?)<\/div>\s*<\/div>/g,
    (m, body, cap) => {
      const steps = [...body.matchAll(/<div class="b( hl)?">\s*<div class="bt">([\s\S]*?)<\/div>\s*<div class="bd">([\s\S]*?)<\/div>\s*<\/div>/g)]
        .map((x) => {
          const hl = !!x[1];
          const t = inlineToMd(x[2].trim());
          const d = inlineToMd(x[3].trim());
          return hl ? { t, d, hl: true } : { t, d };
        });
      return `\n<Flow data="${toB64(steps)}" cap={${JSON.stringify(inlineToMd(cap.trim()))}} />\n`;
    });
  // .stack blocks
  s = s.replace(/<div class="fig">\s*<div class="stack">([\s\S]*?)<\/div>\s*<div class="cap">([\s\S]*?)<\/div>\s*<\/div>/g,
    (m, body, cap) => {
      const rows = [...body.matchAll(/<div class="s"><b>([\s\S]*?)<\/b>([\s\S]*?)<\/div>/g)]
        .map((x) => {
          const k = inlineToMd(x[1].trim());
          const d = inlineToMd(x[2].trim());
          return { k, d };
        });
      return `\n<Stack data="${toB64(rows)}" cap={${JSON.stringify(inlineToMd(cap.trim()))}} />\n`;
    });
  return s;
}

function convertTables(html) {
  return html.replace(/<div class="tw"><table>([\s\S]*?)<\/table><\/div>/g, (m, body) => {
    const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) =>
      [...r[1].matchAll(/<t[hd]>([\s\S]*?)<\/t[hd]>/g)].map((c) => inlineToMd(c[1].trim()).replace(/\|/g, '\\|'))
    );
    if (rows.length === 0) return '';
    const header = rows[0];
    const rest = rows.slice(1);
    let md = '\n| ' + header.join(' | ') + ' |\n';
    md += '| ' + header.map(() => '---').join(' | ') + ' |\n';
    for (const r of rest) md += '| ' + r.join(' | ') + ' |\n';
    return md;
  });
}

function convertLists(html) {
  let s = html;
  s = s.replace(/<ul>([\s\S]*?)<\/ul>/g, (m, body) => {
    const items = [...body.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => `- ${inlineToMd(x[1].trim())}`);
    return '\n' + items.join('\n') + '\n';
  });
  s = s.replace(/<ol>([\s\S]*?)<\/ol>/g, (m, body) => {
    const items = [...body.matchAll(/<li>([\s\S]*?)<\/li>/g)];
    return '\n' + items.map((x, i) => `${i + 1}. ${inlineToMd(x[1].trim())}`).join('\n') + '\n';
  });
  return s;
}

function convertHeadingsAndParas(html) {
  let s = html;
  s = s.replace(/<h2>\s*(?:<span class="qn">.*?<\/span>)?([\s\S]*?)<\/h2>/g, (m, t) => `\n\n## ${inlineToMd(t.trim())}\n`);
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (m, t) => `\n${inlineToMd(t.trim())}\n`);
  return s;
}

function convertQuoteFig(html) {
  return html.replace(/<div class="fig"[^>]*>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g, (m, inner) => {
    let text = inner.replace(/<span class="mint">([\s\S]*?)<\/span>/g, '**$1**');
    text = inlineToMd(text.trim());
    return `\n\n<Fig>${text}</Fig>\n\n`;
  });
}

function htmlToMarkdown(articleHtml) {
  let body = articleHtml;
  body = removeDivByClass(body, 'tldr');
  body = removeDivByClass(body, 'forwho');
  body = removeDivByClass(body, 'myth');
  body = removeDivByClass(body, 'todo');
  body = convertFigs(body);
  body = convertQuoteFig(body);
  body = convertTables(body);
  body = convertLists(body);
  body = convertHeadingsAndParas(body);
  // collapse extra blank lines
  body = body.replace(/\n{3,}/g, '\n\n').trim();
  return body + '\n';
}

function yamlStr(s) {
  if (s == null) return "''";
  // Use JSON-style single-quoted-safe YAML scalar: prefer double quotes via JSON if it has special chars.
  if (/^[\w\- .,가-힣!?~%()·"'“”…/]*$/.test(s) === false || s.includes('\n')) {
    return JSON.stringify(s);
  }
  return JSON.stringify(s); // just always use JSON string, valid YAML flow scalar
}

function buildFrontmatter(fm) {
  const lines = ['---'];
  lines.push(`title: ${yamlStr(fm.title)}`);
  lines.push(`sub: ${yamlStr(fm.sub)}`);
  lines.push(`excerpt: ${yamlStr(fm.excerpt)}`);
  lines.push(`cat: ${fm.cat}`);
  lines.push(`level: ${fm.level}`);
  lines.push(`order: ${fm.order}`);
  lines.push(`min: ${fm.min}`);
  lines.push(`asof: ${yamlStr(fm.asof)}`);
  lines.push(`draft: ${fm.draft}`);
  lines.push(`slug: ${yamlStr(fm.slug)}`);
  lines.push(`tldr: ${yamlStr(fm.tldr || '')}`);
  if (fm.forwho) {
    lines.push(`forwho:`);
    lines.push(`  yes: ${yamlStr(fm.forwho.yes)}`);
    lines.push(`  no: ${yamlStr(fm.forwho.no)}`);
  }
  if (fm.myth) {
    lines.push(`myth:`);
    lines.push(`  said: ${yamlStr(fm.myth.said)}`);
    lines.push(`  real: ${yamlStr(fm.myth.real)}`);
  }
  lines.push(`todo:`);
  if (fm.todo && fm.todo.length) {
    for (const t of fm.todo) lines.push(`  - ${yamlStr(t)}`);
  } else {
    lines[lines.length - 1] = 'todo: []';
  }
  lines.push('---');
  return lines.join('\n') + '\n\n';
}

fs.mkdirSync(OUT, { recursive: true });

let count = 0;
for (const p of POSTS) {
  const htmlPath = path.join(SRC, 'posts', `${p.slug}.html`);
  const raw = fs.readFileSync(htmlPath, 'utf8');
  const artMatch = raw.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  const art = artMatch ? artMatch[1] : '';

  const tldr = extractTldr(art);
  const forwho = extractForwho(art);
  const myth = extractMyth(art);
  const todo = extractTodo(art);
  const body = htmlToMarkdown(art);

  const fm = {
    title: p.title,
    sub: p.sub,
    excerpt: p.excerpt,
    cat: p.cat,
    level: p.level,
    order: p.n,
    min: p.min,
    asof: p.asof,
    draft: false,
    slug: p.slug,
    tldr,
    forwho,
    myth,
    todo,
  };

  const out = buildFrontmatter(fm) + body;
  fs.writeFileSync(path.join(OUT, `${p.slug}.md`), out, 'utf8');
  count++;
}

// COMING -> draft posts
const comingSlugs = ['can-it-make-a-budget-agent-report', 'stock-analysis-report'];
let nextOrder = Math.max(...POSTS.map((p) => p.n)) + 1;
COMING.forEach((c, i) => {
  const slug = i === 0 ? 'household-agent-coming' : 'stock-analysis-coming';
  const fm = {
    title: c.title,
    sub: '준비 중',
    excerpt: c.excerpt,
    cat: c.cat,
    level: c.level,
    order: nextOrder++,
    min: 0,
    asof: '2026-08',
    draft: true,
    slug,
    tldr: '',
    forwho: null,
    myth: null,
    todo: [],
  };
  const out = buildFrontmatter(fm) + '\n';
  fs.writeFileSync(path.join(OUT, `${slug}.md`), out, 'utf8');
  count++;
});

console.log(`Wrote ${count} markdown files to ${OUT}`);
