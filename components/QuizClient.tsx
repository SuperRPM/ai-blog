"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ_QUESTIONS, getTierForScore, getRecommendationsForAnswers } from "@/lib/quiz";

export default function QuizClient() {
  const [step, setStep] = useState(0); // 0..9 질문, 10 결과
  const [answers, setAnswers] = useState<number[]>([]);

  const total = QUIZ_QUESTIONS.length;
  const done = step >= total;

  function choose(score: number) {
    const next = [...answers.slice(0, step), score];
    setAnswers(next);
    setStep(step + 1);
  }

  function goBack() {
    if (step === 0) return;
    setStep(step - 1);
  }

  function retry() {
    setAnswers([]);
    setStep(0);
  }

  if (done) {
    const sum = answers.reduce((a, b) => a + b, 0);
    const tier = getTierForScore(sum);
    const recs = getRecommendationsForAnswers(answers);
    return (
      <div className="qz-result">
        <span className="qz-tier">{tier.name}</span>
        <h2>지금 단계는 &ldquo;{tier.name}&rdquo;입니다</h2>
        <p>{tier.desc}</p>

        <div className="qz-recs">
          {recs.map((r) => (
            <Link className="qz-rec" href={`/posts/${r.slug}`} key={r.slug}>
              <div className="k">지금 읽으면 좋은 글</div>
              <div className="t">{r.title} →</div>
            </Link>
          ))}
        </div>

        <button className="qz-retry" onClick={retry}>
          다시 진단하기
        </button>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[step];
  const pct = Math.round((step / total) * 100);

  return (
    <div>
      <div className="qz-progress">
        <div className="qz-progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="qz-step">
        {step + 1} / {total}
      </div>

      <div className="qz-card">
        <div className="qz-q">{q.q}</div>
        <div className="qz-opts">
          {q.options.map((opt) => (
            <button className="qz-opt" key={opt.text} onClick={() => choose(opt.score)}>
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <button className="qz-back" onClick={goBack}>
          ← 이전 질문
        </button>
      )}
    </div>
  );
}
