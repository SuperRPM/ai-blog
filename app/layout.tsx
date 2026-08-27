import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI 기초 — 읽고 시작하기",
    template: "%s — AI 기초",
  },
  description:
    "AI와 AI 에이전트를 처음 다루는 사람을 위한 기초 글 모음. 개념부터 모델 선택, 에이전트까지.",
};

const themeInit = `
(function () {
  var t = null;
  try { t = localStorage.getItem('aiblog-theme'); } catch (e) {}
  if (t) document.documentElement.dataset.theme = t;
})();
function toggleTheme() {
  var r = document.documentElement;
  r.dataset.theme = r.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('aiblog-theme', r.dataset.theme); } catch (e) {}
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="light">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
