import Link from "next/link";
import { CATS, LEVELS } from "@/lib/taxonomy";
import type { Post } from "@/lib/posts";

function NavCard({ post, dir }: { post: Post | null; dir: "back" | "fwd" }) {
  if (!post) return <span className="nx blank"></span>;
  return (
    <Link className={`nx ${dir}`} href={`/posts/${post.slug}`}>
      <span className="k2">{dir === "back" ? "← 이전 글" : "다음 글 →"}</span>
      <span className="c">
        {CATS[post.cat].name} · {LEVELS[post.level]}
      </span>
      <h4>{post.title}</h4>
    </Link>
  );
}

export default function PostNav({ prev, next }: { prev: Post | null; next: Post | null }) {
  return (
    <div className="next">
      <div className="row">
        <NavCard post={prev} dir="back" />
        <NavCard post={next} dir="fwd" />
      </div>
      <Link className="all" href="/">
        ← 전체 글 목록
      </Link>
    </div>
  );
}
