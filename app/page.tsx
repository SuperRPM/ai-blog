import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import QuestionList from "@/components/QuestionList";
import Gallery from "@/components/Gallery";
import {
  getQuestions,
  getGridPosts,
  getComingCards,
  getAvailableCats,
  getAvailableLevels,
} from "@/lib/posts";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const questions = getQuestions();
  const gridPosts = getGridPosts();
  const coming = getComingCards();
  const availableCats = getAvailableCats();
  const availableLevels = getAvailableLevels();

  return (
    <>
      <TopBar />
      <header className="hero">
        <h1>
          AI, <span className="grad">뭐부터 물어봐야</span> 할지
          <br />
          모르겠다면.
        </h1>
        <p>
          처음 오신 분들이 실제로 가장 많이 하는 질문부터 답했습니다. 한 편 3~4분, 어려운 말은
          쓰지 않았습니다.
        </p>
        <p style={{ marginTop: 14 }}>
          <a
            href="/quiz"
            style={{
              display: "inline-block",
              fontWeight: 800,
              fontSize: 14,
              color: "var(--mint)",
              border: "1.5px solid var(--mint)",
              borderRadius: 99,
              padding: "9px 18px",
            }}
          >
            내 AI 활용 단계 진단해보기 →
          </a>
        </p>
      </header>

      <section className="qwrap">
        <div className="qhead">
          이런 게 <span className="mint">궁금하셨나요?</span>
        </div>
        <QuestionList questions={questions} />
      </section>

      <div className="secline">
        <div className="st">차근차근 읽고 싶다면</div>
        <p>개념 하나에 글 하나. 순서대로 읽으면 기초 → 입문 → 초급으로 이어집니다.</p>
      </div>

      <Gallery
        posts={gridPosts}
        coming={coming}
        availableCats={availableCats}
        availableLevels={availableLevels}
      />

      <footer className="foot">
        모르는 말이 나오면{" "}
        <a href="/glossary" style={{ color: "var(--mint)", fontWeight: 700 }}>
          용어 사전
        </a>
        을 보십시오.
        <br />
        글에 적힌 모델 이름·요금·기능은 각 글 상단의 기준 시점 당시 내용입니다. 이 분야는 빠르게
        바뀝니다.
      </footer>
    </>
  );
}
