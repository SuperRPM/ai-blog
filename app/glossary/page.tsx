import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import { getGlossary } from "@/lib/glossary";
import { mdInline } from "@/lib/mdInline";

export const metadata: Metadata = {
  title: "용어 사전",
  description: "AI와 에이전트 관련 용어를 한 줄로 정리했습니다. 각 항목에서 자세한 글로 넘어갑니다.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryPage() {
  const { groups } = getGlossary();
  return (
    <>
      <TopBar back={{ href: "/", label: "← 목록" }} />
      <main className="glwrap">
        <h1>용어 사전</h1>
        <p className="glead">
          글에 나오는 말들을 한 줄로 정리했습니다. 모르는 단어가 나오면 여기만 보고 다시
          돌아가시면 됩니다.
        </p>

        {groups.map((g) => (
          <section className="glgroup" key={g.name}>
            <div className="gh">{g.name}</div>
            <div className="gl">
              {g.terms.map((t) => (
                <div className="row" key={t.term}>
                  <div className="t">
                    {t.term}
                    {t.en ? <em>{t.en}</em> : null}
                  </div>
                  <div className="d">
                    {mdInline(t.desc)}
                    {t.link ? (
                      <>
                        {" "}
                        <a href={`/posts/${t.link}`}>자세히 →</a>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <p className="glead" style={{ marginTop: 44, fontSize: 14, color: "var(--txt-mute)" }}>
          용어의 정의는 쓰이는 맥락에 따라 조금씩 다를 수 있습니다. 여기서는{" "}
          <b>처음 읽는 사람이 이해하기 쉬운 쪽</b>으로 적었습니다. 2026-08 기준.
        </p>
      </main>
    </>
  );
}
