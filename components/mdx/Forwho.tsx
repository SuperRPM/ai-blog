import { mdInline } from "@/lib/mdInline";

export default function Forwho({ yes, no }: { yes: string; no: string }) {
  return (
    <div className="forwho">
      <div className="yes">
        <div className="k">이 글은</div>
        <p>{mdInline(yes)}</p>
      </div>
      <div className="no">
        <div className="k">이 글이 아닌</div>
        <p>{mdInline(no)}</p>
      </div>
    </div>
  );
}
