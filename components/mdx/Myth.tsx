import { mdInline } from "@/lib/mdInline";

export default function Myth({ said, real }: { said: string; real: string }) {
  return (
    <div className="myth">
      <div className="said">&quot;{said}&quot;</div>
      <div className="real">{mdInline(real)}</div>
    </div>
  );
}
