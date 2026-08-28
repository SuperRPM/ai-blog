export type QuizOption = { text: string; score: 1 | 2 | 3 };
export type QuizQuestion = {
  q: string;
  options: QuizOption[];
  /** 이 질문에서 점수가 낮게 나오면 추천할 글 */
  weakRecommend: { slug: string; title: string };
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    q: "AI를 컴퓨터에 앱으로 설치해서 써본 적 있나요?",
    options: [
      { text: "아니요, 웹사이트에서만 씁니다", score: 1 },
      { text: "설치는 했는데 거의 안 씁니다", score: 2 },
      { text: "설치해서 자주 씁니다", score: 3 },
    ],
    weakRecommend: { slug: "why-desktop-app", title: "웹으로 쓰면 안 되나요? 앱은 왜 깔아요?" },
  },
  {
    q: "AI한테 뭔가 물어볼 때, 보통 어떻게 하시나요?",
    options: [
      { text: "궁금한 걸 한 줄로 물어본다", score: 1 },
      { text: "배경 설명까지 자세히 써준다", score: 2 },
      { text: "원하는 형식·조건을 미리 정해서 준다", score: 3 },
    ],
    weakRecommend: { slug: "how-to-ask", title: "어떻게 물어봐야 잘 대답해요?" },
  },
  {
    q: "어제 나눈 대화 내용을, 오늘 새 대화에서도 이어서 쓴 적 있나요?",
    options: [
      { text: "아니요, 매번 새로 물어본다", score: 1 },
      { text: "가끔 복사해서 붙여넣는다", score: 2 },
      { text: "아예 규칙을 파일로 저장해두고 불러온다", score: 3 },
    ],
    weakRecommend: { slug: "tokens-and-context", title: "토큰과 컨텍스트 — AI가 기억하는 방식" },
  },
  {
    q: "문서나 엑셀 파일을 AI에게 준 적 있나요?",
    options: [
      { text: "없다", score: 1 },
      { text: "한두 번 있다", score: 2 },
      { text: "자주 쓴다", score: 3 },
    ],
    weakRecommend: { slug: "what-not-to-feed", title: "AI에 넣으면 안 되는 것" },
  },
  {
    q: "매주 반복하는 업무 중, AI로 자동화해본 게 있나요?",
    options: [
      { text: "없다", score: 1 },
      { text: "시도는 해봤다", score: 2 },
      { text: "실제로 쓰고 있다", score: 3 },
    ],
    weakRecommend: { slug: "find-your-first-task", title: "내 업무 어디에 붙이나" },
  },
  {
    q: "\"에이전트\"라는 말을 들으면 뭐가 떠오르시나요?",
    options: [
      { text: "잘 모르겠다", score: 1 },
      { text: "챗봇이랑 비슷한 거 아닌가", score: 2 },
      { text: "스스로 여러 단계를 처리하는 것 (구체적 설명 가능)", score: 3 },
    ],
    weakRecommend: { slug: "chatbot-vs-agent", title: "챗봇과 에이전트는 무엇이 다른가" },
  },
  {
    q: "ChatGPT, Claude 같은 여러 AI의 차이를 설명할 수 있나요?",
    options: [
      { text: "다 비슷한 거 아닌가 싶다", score: 1 },
      { text: "이름은 구분하는데 차이는 잘 모른다", score: 2 },
      { text: "용도에 따라 골라서 쓴다", score: 3 },
    ],
    weakRecommend: { slug: "which-model", title: "Opus·Sonnet·Haiku·Fable, 어떤 걸 써야 하나" },
  },
  {
    q: "AI 유료 요금제를 써본 적 있거나, 왜 필요한지 설명할 수 있나요?",
    options: [
      { text: "무료로만 써봤고 왜 유료를 쓰는지 모르겠다", score: 1 },
      { text: "써본 적은 있는데 정확한 이유는 모른다", score: 2 },
      { text: "쓰는 이유를 설명할 수 있다", score: 3 },
    ],
    weakRecommend: { slug: "free-vs-paid", title: "무료로 쓰면 안 되는 이유" },
  },
  {
    q: "AI가 준 답을 그대로 믿나요, 확인하는 습관이 있나요?",
    options: [
      { text: "대체로 그대로 믿는 편이다", score: 1 },
      { text: "중요한 건 가끔 검색으로 확인한다", score: 2 },
      { text: "AI에게 스스로 검증까지 시킨다", score: 3 },
    ],
    weakRecommend: { slug: "make-ai-verify", title: "왜 AI에게 스스로 확인을 시켜야 하나" },
  },
  {
    q: "MCP나 도구 연동이라는 말을 들어본 적 있나요?",
    options: [
      { text: "처음 듣는다", score: 1 },
      { text: "들어는 봤는데 뭔지는 모른다", score: 2 },
      { text: "무엇인지 알고, 필요성도 이해한다", score: 3 },
    ],
    weakRecommend: { slug: "what-is-mcp", title: "MCP란 무엇인가" },
  },
];

export type QuizTierKey = "beginner" | "basic" | "intermediate" | "ready";

export type QuizTier = {
  key: QuizTierKey;
  name: string;
  range: [number, number];
  desc: string;
};

export const QUIZ_TIERS: QuizTier[] = [
  {
    key: "beginner",
    name: "입문",
    range: [10, 16],
    desc: "AI를 아직 낯설게 느끼는 단계입니다. 기초 개념부터 차근차근 짚어보면 훨씬 편해집니다.",
  },
  {
    key: "basic",
    name: "초급",
    range: [17, 21],
    desc: "AI를 쓰긴 하지만 매번 처음부터 다시 시작하는 단계입니다. 대화가 쌓이는 방식을 알면 답답함이 줄어듭니다.",
  },
  {
    key: "intermediate",
    name: "중급",
    range: [22, 26],
    desc: "파일을 활용하고 업무에 적용해본 단계입니다. 이제 자동화와 도구 조합을 익힐 차례입니다.",
  },
  {
    key: "ready",
    name: "실전 후보",
    range: [27, 30],
    desc: "에이전트와 자동화의 필요성을 이미 느끼고 계시는 단계입니다. 실전으로 넘어갈 준비가 됐습니다.",
  },
];

export function getTierForScore(score: number): QuizTier {
  return (
    QUIZ_TIERS.find((t) => score >= t.range[0] && score <= t.range[1]) ??
    QUIZ_TIERS[QUIZ_TIERS.length - 1]
  );
}

/**
 * 답변(각 문항의 점수 배열)을 받아서, 점수가 가장 낮은 문항 2개에 해당하는 글을 추천한다.
 * 동점이면 문항 순서가 앞선 쪽을 우선한다. 즉 "어떤 질문을 어떻게 선택했는지"가
 * 추천 결과를 직접 결정한다 — 등급(총점)과는 별개의 로직이다.
 */
export function getRecommendationsForAnswers(scores: number[]) {
  const indexed = scores.map((score, index) => ({ score, index }));
  indexed.sort((a, b) => a.score - b.score || a.index - b.index);
  const weakest = indexed.slice(0, 2);
  return weakest.map(({ index }) => QUIZ_QUESTIONS[index].weakRecommend);
}
