import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import QuizClient from "@/components/QuizClient";

export const metadata: Metadata = {
  title: "AI 활용 단계 진단",
  description: "질문 10개로 지금 AI를 얼마나 활용하고 있는지 확인하고, 다음에 읽으면 좋은 글을 추천받으세요.",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <>
      <TopBar back={{ href: "/", label: "← 목록" }} />
      <main className="quizwrap">
        <h1>나는 AI를 얼마나 쓰고 있을까?</h1>
        <p className="lead">질문 10개, 1분이면 끝납니다. 답변에 따라 지금 딱 필요한 글을 추천해 드립니다.</p>
        <QuizClient />
      </main>
    </>
  );
}
