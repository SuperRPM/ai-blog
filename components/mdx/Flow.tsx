import { Fragment } from "react";
import { mdInline } from "@/lib/mdInline";

export interface FlowStep {
  t: string;
  d: string;
  hl?: boolean;
}

function decode(data: string): FlowStep[] {
  return JSON.parse(Buffer.from(data, "base64").toString("utf8"));
}

export default function Flow({
  data,
  steps: stepsProp,
  cap,
}: {
  data?: string;
  steps?: FlowStep[];
  cap?: string;
}) {
  const steps = stepsProp ?? (data ? decode(data) : []);
  return (
    <div className="fig">
      <div className="flowr">
        {steps.map((s, i) => (
          <Fragment key={i}>
            <div className={"b" + (s.hl ? " hl" : "")}>
              <div className="bt">{mdInline(s.t)}</div>
              <div className="bd">{mdInline(s.d)}</div>
            </div>
            {i < steps.length - 1 ? <div className="ar">›</div> : null}
          </Fragment>
        ))}
      </div>
      {cap ? <div className="cap">{cap}</div> : null}
    </div>
  );
}
