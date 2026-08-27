# AI 기초 — Next.js + Git CMS

정적 HTML로 되어 있던 "AI 기초" 블로그를 Next.js 15(App Router) + Markdown 콘텐츠 +
Sveltia CMS + Vercel 배포로 이전한 버전이다. 이전 계획 전체는 원본 저장소의
`ai-blog/PLAN.md`를 참고.

## 글을 추가하거나 고치려면

**`/admin`에서 고친다.** 브라우저에서 GitHub 계정으로 로그인하면 폼으로 제목·카테고리·
난이도·순서·공개 여부를 고칠 수 있다. 저장 = GitHub 커밋이고, 30초~1분 안에 배포에
반영된다. (`/admin` 로그인이 되려면 GitHub OAuth App 등록이 먼저 필요하다 — 아직
안 되어 있다면 아래 "남은 설정" 참고.)

직접 파일을 고치고 싶다면 `content/posts/<slug>.md`를 연다. frontmatter가 카드·헤더에
쓰이는 메타데이터이고, `---` 아래가 본문(Markdown + 일부 커스텀 컴포넌트)이다.

- **`slug`는 절대 바꾸지 않는다.** URL이 그대로 바뀐다.
- 정렬은 `level`(난이도) → `order`(같은 난이도 안 순서)로 고정. 최신순이 아니다.
- `level: 0`은 그리드에 안 뜨고 첫 화면 질문 목록에만 나온다.
- `draft: true`는 "준비 중" 흐린 카드로만 보이고 개별 페이지는 생성되지 않는다.
- 본문에서 쓸 수 있는 컴포넌트: `<Fig>`, `<Flow>`, `<Stack>` (자세한 사용법은
  `components/mdx/*.tsx`와 `scripts/migrate.mjs`의 변환 결과 참고). `<Tldr>`,
  `<Forwho>`, `<Myth>`, `<Todo>`는 frontmatter의 `tldr`/`forwho`/`myth`/`todo`
  값으로 자동 렌더되므로 본문에 직접 쓰지 않는다.

## 개발

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # 프로덕션 빌드 검증
node scripts/check.mjs        # 콘텐츠 정합성 검사(슬러그·정렬·링크·용어사전)
node scripts/screenshots.mjs  # Playwright로 주요 페이지 스크린샷 저장
```

## 배포

Vercel에 `SuperRPM/ai-blog` 프로젝트로 배포되어 있다. `vercel --prod` 로 수동 배포하거나,
GitHub 저장소 연동을 완료하면 `main` 브랜치 push마다 자동 배포된다.

## 폴더 구조

```
app/                 라우트 (갤러리 · 글 상세 · 용어 사전 · sitemap · robots · OG 이미지)
components/          화면 컴포넌트 + components/mdx/ 본문 전용 컴포넌트
lib/                 posts.ts(정렬·필터 규칙) · taxonomy.ts(카테고리·난이도 상수) · glossary.ts
content/posts/*.md   글 22편 + 준비 중 카드 2개
content/glossary.yml 용어 사전 데이터(4그룹 29항목)
public/admin/        Sveltia CMS 설정(index.html · config.yml)
scripts/             migrate.mjs(원본 이전용, 재실행 불필요) · check.mjs · screenshots.mjs
```

## 남은 설정 (사람이 해야 하는 일)

1. **GitHub OAuth App 생성** — `/admin` 로그인에 필요. GitHub → Settings →
   Developer settings → OAuth Apps → New OAuth App. Homepage/callback URL은
   Sveltia CMS 최신 문서를 확인해서 넣을 것. 발급된 Client ID/Secret은 Vercel
   프로젝트 → Settings → Environments → Production 안의 환경변수 등록 화면에
   `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` 로 등록한다. (2026-08-27 진행 중)
2. **Vercel ↔ GitHub 저장소 자동 연동** — 완료. (2026-08-27) 이제 `main` push마다
   자동 배포된다.
3. **나중에 할 일 — Google Search Console 등록 + `sitemap.xml` 제출.**
   급하지 않다. 사이트는 이거 없어도 정상 작동하고, 이건 구글 검색 결과 노출을
   앞당기는 용도일 뿐이다. `app/sitemap.ts`가 이미 사이트맵을 자동 생성하고 있으니
   등록만 하면 된다. 하는 법: https://search.google.com/search-console 에서
   배포 도메인(`ai-blog-ten-swart.vercel.app` 또는 커스텀 도메인) 추가 → 소유 확인
   → Sitemaps 메뉴에서 `sitemap.xml` 제출.
