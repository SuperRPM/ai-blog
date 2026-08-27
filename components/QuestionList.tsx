import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function QuestionList({ questions }: { questions: Post[] }) {
  return (
    <div className="qlist" id="questions">
      {questions.map((p) => (
        <Link className="q" href={`/posts/${p.slug}`} key={p.slug}>
          <span className="qm">?</span>
          <span className="qb">
            <span className="qq">{p.title}</span>
            <span className="qa">{p.excerpt}</span>
          </span>
          <span className="qg">{p.min}분 →</span>
        </Link>
      ))}
    </div>
  );
}
