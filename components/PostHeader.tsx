import Thumb from "./Thumb";
import { LEVELS } from "@/lib/taxonomy";
import { slugify } from "./mdx/mdxComponents";
import type { Post } from "@/lib/posts";

function extractHeadings(body: string): string[] {
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
}

export default function PostHeader({ post }: { post: Post }) {
  const headings = extractHeadings(post.body);
  return (
    <div className="post">
      <div className="phero">
        <Thumb data={{ cat: post.cat, order: post.order, title: post.title, sub: post.sub }} bare />
      </div>
      <div className="pmeta">
        <span className="lv">난이도 · {LEVELS[post.level]}</span>
        <span>·</span>
        <span>{post.min}분</span>
        <span className="asof">{post.asof} 기준</span>
      </div>
      <h1>{post.title}</h1>
      <p className="psub">{post.sub}</p>
      {headings.length >= 2 && (
        <nav className="toc">
          <div className="th">목차</div>
          <ol>
            {headings.map((h, i) => (
              <li key={i}>
                <a href={`#${slugify(h)}`}>{h}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}
