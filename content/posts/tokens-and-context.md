---
title: 토큰과 컨텍스트 — AI가 기억하는 방식
sub: AI는 기억하지 않아요. 매번 전부 다시 읽어야 합니다.
excerpt: 토큰은 글을 쪼갠 단위, 컨텍스트는 AI가 한 번에 볼 수 있는 글의 사이즈. 대화가 길어지면 답이 이상해지는 이유가 여기에 있어요.
cat: A
level: 1
order: 3
min: 7
asof: 2026-08
draft: false
tldr: 토큰은 글을 잘게 쪼갠 단위이고, 컨텍스트는 ** AI가 한 번에 볼 수 있는 글의 사이즈**입니다. AI는 대화를 기억하는 게 아니라, 매 턴마다 **지금까지의 대화를 전부 다시 읽습니다.**
forwho:
  yes: 대화가 길어지면 답이 이상해지는 걸 겪은 분, 사용량이 왜 이렇게 빨리 주는지 궁금한 분
  no: 토큰 단가를 계산하려는 분. 여기서는 구조만 다룹니다
myth:
  said: 대화를 계속하면 AI가 저를 기억하겠죠
  real: 기억이 아니라 **재전송**입니다. 매번 처음부터 다시 읽고 있습니다.
todo:
  - 지금 열려 있는 긴 대화를 하나 골라 **"지금까지 정한 것만 정리해 줘"**를 시켜 보세요.
  - 새로운 대화를 열고 정리해주 것을 첫 입력으로 대화를 이어가 보십시오. 답이 다시 정확해지는 걸 바로 느낄 수 있습니다.
  - 반복해서 쓰는 규칙이 있으면 **대화가 아니라 파일이나 프로젝트에** 옮겨야 합니다.
slug: tokens-and-context
---

## 토큰이 무엇인가

글을 모델이 다루기 쉬운 조각으로 자른 단위입니다. **단어보다 작고 글자보다 큰** 경우가 많습니다.
"안녕하세요"가 하나일 수도, 세 개일 수도 있습니다. 정확한 개수는 모델마다 다릅니다.
중요한건 그런 단위로 AI와 데이터가 오가는 구나를 이해하는 것입니다.

실무에서 필요한 감각은 하나뿐입니다 — **글이 길면 토큰이 많고, 토큰이 많으면 비싸고 느립니다.**
그리고 한국어는 영어보다 같은 내용에 토큰을 더 쓰는 편입니다.

## 컨텍스트는 책상이다

모델이 한 번에 볼 수 있는 양에는 한계가 있습니다. 그 한계를 컨텍스트 창이라고 부릅니다.
책상 하나를 떠올리면 편합니다. 그 위에 이런 것들이 동시에 올라가 있어야 합니다.

<Stack data="W3siayI6IjEgwrcg6riw67O4IOyngOyLnCIsImQiOiLshJzruYTsiqTqsIAg66+466asIOuEo+yWtCDrkZQg6rec7LmZLiDsmrDrpqwg64iI7JeQ64qUIOyViCDrs7Tsnbjri6QifSx7ImsiOiIyIMK3IOydtOyghCDrjIDtmZQg7KCE7LK0IiwiZCI6IuuCtOqwgCDtlZwg66eQ6rO8IEFJ6rCAIO2VnCDrp5AsIOyymOydjOu2gO2EsCDsoITrtoAifSx7ImsiOiIzIMK3IOu2meyduCDsnpDro4wiLCJkIjoi66y47IScLCDsnbTrr7jsp4AsIOy9lOuTnCJ9LHsiayI6IjQgwrcg7KeA6riIIOuCtCDsp4jrrLgiLCJkIjoi67Cp6riIIOyeheugpe2VnCDqsoMifSx7ImsiOiI1IMK3IOuLteydtCDrgpjqsIgg7J6Q66asIiwiZCI6IuuLteuPhCDsnbQg7LGF7IOBIOychOyXkCDsjajslbwg7ZWc64ukIn1d" cap={"다섯 개가 한 책상을 나눠 쓴다 — 하나가 커지면 다른 것의 자리가 줄어든다"} />

## 매 턴마다 전부 다시 읽는다

여기가 핵심입니다. AI는 지난 대화를 **기억하고 있는 게 아니라**, 내가 새 질문을 할 때마다
지금까지의 대화 전체를 함께 받아서 처음부터 다시 읽습니다.

<Flow data="W3sidCI6IjHrsojsp7gg7KeI66y4IiwiZCI6IuyniOusuCAxIn0seyJ0IjoiMuuyiOynuCIsImQiOiLsp4jrrLggMSArIOuLtSAxICsg7KeI66y4IDIifSx7InQiOiIz67KI7Ke4IiwiZCI6IuyVnuydmCDsoITrtoAgKyDsp4jrrLggMyJ9LHsidCI6IjIw67KI7Ke4IiwiZCI6IuyVnuydmCDsoITrtoAgKyDsp4jrrLggMjAiLCJobCI6dHJ1ZX1d" cap={"짧게 물어도, 20번째 질문은 첫 질문보다 훨씬 무겁다"} />

그래서 **짧은 질문 하나가 비싼 요청이 될 수 있습니다.** 사용량은 내가 방금 쓴 글자 수가 아니라
대화가 얼마나 쌓였는지에 비례합니다.

## 창이 넘치면 앞이 밀린다

대화가 책상 크기를 넘으면 앞쪽이 밀려나거나 요약됩니다. 그 순간부터 이런 일이 벌어집니다.

- 처음에 준 규칙을 안 지킵니다 — 규칙이 책상에서 떨어졌습니다
- 이미 정한 걸 다시 묻습니다
- 앞에서 고친 실수를 또 합니다

대화 중반부터 답이 갑자기 나빠지는 경험의 정체가 대개 이것입니다.
모델이 갑자기 멍청해진 게 아니라 **초반 내용을 더 이상 보고 있지 않은 것**입니다.

## 무엇을 남기고 무엇을 버리나

그래서 컨텍스트 관리는 요령이 아니라 습관입니다.

- **주제가 바뀌면 새 대화를 시작하세요.** 혹은 /compact로 직접 압축해보세요.
- **계속 쓸 규칙은 대화가 아니라 파일·프로젝트에.** 새로운 대화를 열어도 여전히 기억할 수 있습니다.
- **자료는 필요한 부분만.** 200페이지를 다 넣으면 정작 질문이 앉을 자리가 없습니다
