import { ImageResponse } from "next/og";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { CATS } from "@/lib/taxonomy";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GRAD: Record<string, string> = {
  A: "radial-gradient(120% 130% at 12% 8%, #0A57D3 0%, #0b1030 62%, #080a1a 100%)",
  B: "radial-gradient(120% 130% at 12% 8%, #0FBD95 0%, #0a2a36 58%, #080a1a 100%)",
  C: "radial-gradient(120% 130% at 12% 8%, #FE9E03 0%, #331f08 58%, #080a1a 100%)",
  D: "radial-gradient(120% 130% at 12% 8%, #6C4DE0 0%, #241a4d 58%, #080a1a 100%)",
  E: "radial-gradient(120% 130% at 12% 8%, #0E7C86 0%, #0b2a33 58%, #080a1a 100%)",
  N: "radial-gradient(120% 130% at 12% 8%, #39406e 0%, #1a1e3c 58%, #080a1a 100%)",
};

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const cat = post?.cat || "N";
  const catName = (post && CATS[post.cat]?.name) || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "64px 56px",
          background: GRAD[cat] || GRAD.N,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 56,
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            background: "#ffffff22",
            border: "1px solid #ffffff33",
            borderRadius: 999,
            padding: "8px 20px",
          }}
        >
          {catName}
        </div>
        {post ? (
          <div
            style={{
              position: "absolute",
              top: 32,
              right: 48,
              fontSize: 28,
              fontWeight: 800,
              color: "#ffffff77",
            }}
          >
            {String(post.order).padStart(2, "0")}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            {post?.title || "AI 기초"}
          </div>
          {post?.sub ? (
            <div style={{ fontSize: 26, color: "#ffffffbb", marginTop: 16, fontWeight: 600 }}>
              {post.sub}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size }
  );
}
