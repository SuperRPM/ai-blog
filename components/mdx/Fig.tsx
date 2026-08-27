import { mdInline } from "@/lib/mdInline";

export default function Fig({
  cap,
  children,
}: {
  cap?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fig" style={{ textAlign: "center", padding: "26px 22px" }}>
      <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.5, letterSpacing: "-.015em" }}>
        {typeof children === "string" ? mdInline(children) : children}
      </div>
      {cap ? <div className="cap">{cap}</div> : null}
    </div>
  );
}
