import { mdInline } from "@/lib/mdInline";

export interface StackRow {
  k: string;
  d: string;
}

function decode(data: string): StackRow[] {
  return JSON.parse(Buffer.from(data, "base64").toString("utf8"));
}

export default function Stack({
  data,
  rows: rowsProp,
  cap,
}: {
  data?: string;
  rows?: StackRow[];
  cap?: string;
}) {
  const rows = rowsProp ?? (data ? decode(data) : []);
  return (
    <div className="fig">
      <div className="stack">
        {rows.map((r, i) => (
          <div className="s" key={i}>
            <b>{mdInline(r.k)}</b>
            {mdInline(r.d)}
          </div>
        ))}
      </div>
      {cap ? <div className="cap">{cap}</div> : null}
    </div>
  );
}
