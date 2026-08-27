---
title: "에이전트에게 일을 시키는 법"
sub: "지시가 아니라 명세를 쓴다"
excerpt: "어디서 본 문구를 붙이면 이번엔 되고 다음엔 안 된다. 목표·재료·판정 기준·금지·산출물, 다섯 칸으로 쓴다."
cat: C
level: 3
order: 11
min: 7
asof: "2026-08"
draft: false
slug: "spec-not-prompt"
tldr: "프롬프트는 잘 물어보는 요령이 아니라 **그 작업의 명세**입니다. 목표 · 재료 · 판정 기준 · 금지 · 산출물 형식, 다섯 칸으로 씁니다."
forwho:
  yes: "어떤 날은 잘 나오고 어떤 날은 안 나와서, 이유를 모르는 분"
  no: "바로 붙여 쓸 문구 모음을 찾는 분. 그건 모델이 바뀌면 버려집니다"
myth:
  said: "좋은 프롬프트 모음집을 외우면 되겠죠"
  real: "이번엔 되고 다음엔 안 됩니다. **왜 됐는지 모르니 매번 처음부터 헤맵니다.**"
todo:
  - "다음 요청을 **다섯 칸으로 쪼개서** 써 보십시오. 처음엔 어색하고 세 번이면 익숙해집니다."
  - "**판정 기준을 맨 먼저** 쓰십시오. 못 쓰겠으면 일을 더 쪼개야 한다는 신호입니다."
  - "잘 나온 명세는 **파일로 저장**하십시오. 다음엔 고쳐 쓰면 됩니다."
---

## 지시와 명세의 차이

같은 일을 두 가지로 적어 보면 차이가 바로 보입니다.

| 지시 | 명세 |
| --- | --- |
| "이 회의록 좀 정리해 줘" | "이 회의록에서 **결정된 것**만 뽑아 표로. 담당자와 기한이 없는 항목은 '미정'으로 표기하고,
회의록에 없는 내용은 추가하지 말 것. 열은 항목·담당·기한 세 개." |

왼쪽은 매번 다른 결과가 나옵니다. 오른쪽은 **결과가 맞는지 내가 판정할 수 있습니다.**
차이는 문장 길이가 아니라 판정 가능성입니다.

## 다섯 칸

<Stack data="W3siayI6Iuuqqe2RnCIsImQiOiLrrLTsl4fsnbQg64Gd64KcIOyDge2DnOyduOqwgCDigJQgXCLqsrDsoJXsgqztla0g7ZGcIO2VmOuCmFwiIn0seyJrIjoi7J6s66OMIiwiZCI6IuustOyXh+ydhCDqt7zqsbDroZwg7JOw64qU6rCAIOKAlCBcIuu2meyduCDtmozsnZjroZ3rp4wuIOy2lOy4oSDquIjsp4BcIiJ9LHsiayI6Iu2MkOyglSDquLDspIAiLCJkIjoi66y07JeH7J2EIOuztOqzoCDsnpgg65CQ64uk6rOgIO2VmOuKlOqwgCDigJQgXCLriITrnb0g7JeG7J2MLCDsl4bripQg6rKw7KCVIOyXhuydjFwiIn0seyJrIjoi6riI7KeAIiwiZCI6Iu2VmOuptCDslYgg65CY64qUIOqygyDigJQgXCLtmozsnZjroZ3sl5Ag7JeG64qUIOuCtOyaqSDstpTqsIAg6riI7KeAXCIifSx7ImsiOiLsgrDstpzrrLwiLCJkIjoi7Ja065akIO2YleyLneycvOuhnCDigJQgXCLsl7Qg7IS4IOqwnOyduCDtkZwsIOyEpOuqhSDrrLjsnqUg7JeG7J20XCIifV0=" cap={"다섯 칸을 채우는 데 2분이 걸리고, 다시 시키는 데 10분이 걸린다"} />

## 판정 기준이 제일 중요한 이유

다섯 칸 중 하나만 남기라면 **판정 기준**입니다. 이게 없으면 세 가지가 동시에 무너집니다.

- 결과가 좋은지 나쁜지 **내가 모릅니다.** 그냥 그럴듯해 보이면 넘어갑니다
- AI가 **스스로 확인할 수 없습니다.** 무엇을 확인해야 하는지 모르니까요
- 다음에 **개선할 수 없습니다.** 뭐가 문제였는지 말할 수 없습니다

그래서 순서를 뒤집는 게 좋습니다. **판정 기준을 먼저 쓰고** 나머지를 채우십시오.
판정 기준을 못 쓰겠으면, 그건 아직 내가 그 일을 정리하지 못한 것입니다.

## 재사용되는 형태로 남기기

잘 된 명세는 **버리지 말고 저장**하십시오. 요령은 매번 새로 헤매지만 명세는 그대로 다시 씁니다.
그리고 두 번째부터는 고쳐 쓰는 일이 됩니다 — 처음부터 쓰는 것보다 훨씬 쉽습니다.

좋은 명세를 쓸 수 있다는 건 결국 **그 업무를 남에게 넘길 수 있게 정리했다는 뜻**입니다.
사람에게 넘기든 에이전트에게 넘기든 같습니다.
