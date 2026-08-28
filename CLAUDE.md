# CLAUDE.md — ai-blog-next 운영 지침

이 저장소는 "AI 기초" 블로그의 Next.js 버전이다. 정적 HTML로 되어 있던 이전 버전
(`ai-blog/` → `_trash/ai-blog-static-backup/`)에서 마이그레이션했다. 이 문서는
이 저장소를 다시 건드릴 에이전트/사람을 위한 운영 지침이다.

## 절대 지킬 것

1. **slug를 바꾸지 않는다.** `content/posts/<slug>.md`의 파일명(=frontmatter의
   `slug` 필드)이 곧 URL이다. 22개 기존 글의 slug는 원본 정적 사이트와 동일해야 한다.
2. **정렬은 `level` → `order`.** `lib/posts.ts`의 `byOrder`가 유일한 정렬 기준이다.
   최신순으로 바꾸지 않는다 — 순서 자체가 커리큘럼이다.
3. **`level: 0`(질문글)은 그리드에 넣지 않는다.** 첫 화면 질문 목록(`getQuestions`)
   전용이다.
4. **글이 0편인 카테고리 칩을 만들지 않는다.** `getAvailableCats`/`getAvailableLevels`가
   실제 데이터에서 뽑아내므로 새 카테고리를 추가할 땐 최소 1편 이상 채운 뒤 배포한다.
5. **모바일(≤640px)은 select 드롭다운, 칩은 숨긴다.** `select` 글자는 16px 이상
   유지(iOS 자동 확대 방지) — `app/globals.css`의 `.selfilters select` 규칙.
6. **콘텐츠는 Git 파일로.** DB를 들이지 않는다. 유일한 원천은 `content/` 아래 파일.
7. **`/admin`은 검색엔진에서 막는다.** `app/robots.ts`에서 `disallow: "/admin"`.
8. **글 내용을 임의로 고치지 않는다.** 오탈자 수정 등 명백한 경우가 아니면 콘텐츠는
   `/admin`을 통한 편집자의 몫이다.
9. **기본 테마는 라이트.** `app/layout.tsx`의 `<html data-theme="light">`가 기본값이고,
   사용자가 다크로 전환하면 `localStorage`(`aiblog-theme`)에 저장되어 다음 방문에도
   유지된다. 이 기본값을 다시 다크로 되돌리지 않는다.
10. **다크/라이트 모두 텍스트 대비 WCAG AA(4.5:1) 이상을 유지한다.** 색 토큰을
    고칠 때는 `app/globals.css`의 `--txt-mute`/`--mint`/`--orange` 등 텍스트로도
    쓰이는 토큰의 대비를 다시 계산할 것.

## 데이터 모델

- `content/posts/<slug>.md`: frontmatter(제목·카테고리·난이도·순서·tldr·forwho·myth·
  todo 등) + Markdown 본문. 스키마는 `lib/posts.ts`의 `Post` 인터페이스.
- `content/glossary.yml`: 용어 사전 4그룹 29항목. `link` 필드는 실제 존재하는 slug만
  가리켜야 한다(`node scripts/check.mjs`가 검증).
- 본문에서 쓸 수 있는 커스텀 컴포넌트: `<Fig>`(인용/강조 박스), `<Flow>`(단계 다이어그램,
  `data` prop은 base64 JSON), `<Stack>`(층 다이어그램, 마찬가지). `<Tldr>`/`<Forwho>`/
  `<Myth>`/`<Todo>`는 frontmatter에서 자동 렌더되므로 본문에 직접 쓰지 않는다.

  주의: `<Flow>`/`<Stack>`에 배열·객체 리터럴을 JSX 속성으로 직접 넘기면
  (`steps={[{...}]}` 형태) next-mdx-remote의 dev-JSX 컴파일 경로에서 속성이 통째로
  드롭되는 버그가 있다(@mdx-js/mdx 3.1.1 + estree-util-build-jsx 3.0.1 조합에서 확인).
  그래서 `scripts/migrate.mjs`는 구조화된 데이터를 base64 인코딩한 문자열(`data` prop)
  로 넘기고, 컴포넌트가 디코드한다. 새 글을 손으로 쓸 때도 이 패턴을 따를 것.

## 파이프라인

```
편집자 → /admin(Sveltia CMS, GitHub 로그인) → content/*.md 커밋
       → GitHub push → Vercel 빌드(SSG) → 배포
```

- 런타임 서버 없음, DB 없음. 전부 빌드 타임에 정적으로 생성된다.
- `scripts/migrate.mjs`는 원본 정적 사이트(`ai-blog/posts.js` + `ai-blog/posts/*.html`)를
  1회성으로 변환한 스크립트다. 원본이 `_trash/`로 옮겨졌으므로 재실행할 일은 없다 —
  다만 변환 로직 자체는 앞으로 비슷한 이전 작업을 할 때 참고할 수 있다.
- `scripts/check.mjs`: 콘텐츠 정합성(슬러그 22개, 정렬, prev/next 대칭, 용어사전 링크,
  카테고리 칩 비어있지 않음 등)을 코드로 검증. 콘텐츠를 대량으로 고친 뒤에는 실행할 것.
- `scripts/screenshots.mjs`: Playwright로 주요 페이지(갤러리/글/용어사전, 라이트/다크,
  데스크톱/모바일)를 스크린샷으로 남긴다. 시각적 리그레션을 눈으로 확인할 때 사용.

## 하지 말 것

- 디자인 개편 / 색·폰트 체계 변경 (접근성 대비 수정은 예외)
- 카테고리·난이도 체계 변경
- 발표자료(`agent소개자료` 등)와 링크 연결
- 회사·제품·고객사 이야기 추가
- `content/` 밖에 콘텐츠를 두거나 DB를 도입하는 것

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
