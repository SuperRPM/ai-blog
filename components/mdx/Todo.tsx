import { mdInline } from "@/lib/mdInline";

export default function Todo({ items }: { items: string[] }) {
  return (
    <div className="todo">
      <div className="k">그래서 뭘 하면 되나</div>
      <ol>
        {items.map((item, i) => (
          <li key={i}>{mdInline(item)}</li>
        ))}
      </ol>
    </div>
  );
}
