import { mdInline } from "@/lib/mdInline";

export default function Tldr({ children }: { children: React.ReactNode }) {
  return (
    <div className="tldr">
      <div className="k">한 줄 답</div>
      <p>{typeof children === "string" ? mdInline(children) : children}</p>
    </div>
  );
}
