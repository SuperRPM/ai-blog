import React from "react";

/**
 * Minimal inline-markdown renderer for frontmatter-derived text
 * (tldr / myth / forwho / todo). Supports **bold** and [text](url) only —
 * the only inline syntax used in the content.
 */
export function mdInline(src: string): React.ReactNode[] {
  if (!src) return [];
  const nodes: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(src))) {
    if (m.index > last) nodes.push(src.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(<strong key={key++}>{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      nodes.push(
        <a key={key++} href={m[3]}>
          {m[2]}
        </a>
      );
    }
    last = re.lastIndex;
  }
  if (last < src.length) nodes.push(src.slice(last));
  return nodes;
}
