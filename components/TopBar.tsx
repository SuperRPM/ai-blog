"use client";

import Link from "next/link";

declare global {
  interface Window {
    toggleTheme?: () => void;
  }
}

export default function TopBar({ back }: { back?: { href: string; label: string } }) {
  return (
    <div className="bar">
      <div className="in">
        <Link className="home" href="/">
          AI <em>기초</em>
        </Link>
        {back ? (
          <Link className="back" href={back.href}>
            {back.label}
          </Link>
        ) : (
          <>
            <span className="sp"></span>
            <Link className="back" href="/glossary">
              용어 사전
            </Link>
          </>
        )}
        {back && <span className="sp"></span>}
        <button onClick={() => window.toggleTheme?.()}>라이트/다크</button>
      </div>
    </div>
  );
}
