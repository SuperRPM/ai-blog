import { CATS } from "@/lib/taxonomy";

export interface ThumbData {
  cat?: string;
  label?: string;
  order?: number;
  title: string;
  sub?: string;
}

export default function Thumb({
  data,
  soon,
  bare,
}: {
  data: ThumbData;
  soon?: boolean;
  bare?: boolean;
}) {
  const catName = data.label || (data.cat && CATS[data.cat]?.name) || "";
  return (
    <div className={`thumb c${data.cat || "N"}${soon ? " soon" : ""}`}>
      <span className="tcat">{catName}</span>
      {data.order ? <span className="tno">{String(data.order).padStart(2, "0")}</span> : null}
      {!bare && (
        <>
          <span className="ttl">{data.title}</span>
          {data.sub ? <span className="tsub">{data.sub}</span> : null}
        </>
      )}
    </div>
  );
}
