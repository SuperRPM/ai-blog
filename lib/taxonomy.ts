export const CATS: Record<string, { name: string; key: string }> = {
  A: { name: 'AI는 어떻게 동작하나', key: 'A' },
  B: { name: '무엇을 쓰고 얼마를 쓰나', key: 'B' },
  C: { name: '잘 쓰는 법', key: 'C' },
  D: { name: '에이전트', key: 'D' },
  E: { name: '실사용 후기', key: 'E' },
};

export const LEVELS: Record<number, string> = {
  0: '처음',
  1: '기초',
  2: '입문',
  3: '초급',
  4: '중급',
};

export type CatKey = keyof typeof CATS;
