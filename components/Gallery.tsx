"use client";

import { useState } from "react";
import Link from "next/link";
import Thumb from "./Thumb";
import { CATS, LEVELS } from "@/lib/taxonomy";
import type { Post } from "@/lib/posts";

export default function Gallery({
  posts,
  coming,
  availableCats,
  availableLevels,
}: {
  posts: Post[];
  coming: Post[];
  availableCats: string[];
  availableLevels: number[];
}) {
  const [cat, setCat] = useState("all");
  const [level, setLevel] = useState("all");

  const filteredPosts = posts.filter(
    (p) => (cat === "all" || p.cat === cat) && (level === "all" || String(p.level) === level)
  );
  const filteredComing = coming.filter(
    (c) => (cat === "all" || c.cat === cat) && (level === "all" || String(c.level) === level)
  );

  const hasResults = filteredPosts.length > 0 || filteredComing.length > 0;

  return (
    <>
      <div className="selfilters">
        <label>
          <span>주제</span>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">전체</option>
            {availableCats.map((k) => (
              <option key={k} value={k}>
                {CATS[k].name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>난이도</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">전체</option>
            {availableLevels.map((l) => (
              <option key={l} value={l}>
                {LEVELS[l]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filters">
        <span className="lbl">주제</span>
        <button className={`chip${cat === "all" ? " on" : ""}`} onClick={() => setCat("all")}>
          전체
        </button>
        {availableCats.map((k) => (
          <button key={k} className={`chip${cat === k ? " on" : ""}`} onClick={() => setCat(k)}>
            {CATS[k].name}
          </button>
        ))}
        <span className="div"></span>
        <span className="lbl">난이도</span>
        <button className={`chip${level === "all" ? " on" : ""}`} onClick={() => setLevel("all")}>
          전체
        </button>
        {availableLevels.map((l) => (
          <button
            key={l}
            className={`chip${level === String(l) ? " on" : ""}`}
            onClick={() => setLevel(String(l))}
          >
            {LEVELS[l]}
          </button>
        ))}
      </div>

      <main className="grid" id="gallery">
        {hasResults ? (
          <>
            {filteredPosts.map((p) => (
              <Link className="card" href={`/posts/${p.slug}`} key={p.slug}>
                <Thumb data={{ cat: p.cat, order: p.order, title: p.title, sub: p.sub }} />
                <div className="meta">
                  <span className="lv">{LEVELS[p.level]}</span>
                  <span>·</span>
                  <span>{p.min}분</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
              </Link>
            ))}
            {filteredComing.map((c) => (
              <div className="card soon" key={c.slug}>
                <Thumb data={{ cat: c.cat, title: c.title, sub: c.sub }} soon />
                <div className="meta">
                  <span className="lv">{LEVELS[c.level]}</span>
                  <span>·</span>
                  <span>준비 중</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.excerpt}</p>
              </div>
            ))}
          </>
        ) : (
          <p style={{ color: "var(--txt-mute)", fontSize: 14 }}>해당하는 글이 없습니다.</p>
        )}
      </main>
    </>
  );
}
