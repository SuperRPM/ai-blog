import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import PostHeader from "@/components/PostHeader";
import PostNav from "@/components/PostNav";
import Tldr from "@/components/mdx/Tldr";
import Forwho from "@/components/mdx/Forwho";
import Myth from "@/components/mdx/Myth";
import Todo from "@/components/mdx/Todo";
import { getMdxComponents } from "@/components/mdx/mdxComponents";
import { getPublishedPosts, getPostBySlug, getPrevNext } from "@/lib/posts";

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [`/posts/${post.slug}/opengraph-image`],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getPrevNext(slug);

  return (
    <>
      <TopBar back={{ href: "/", label: "← 목록" }} />
      <PostHeader post={post} />
      <article data-slug={post.slug}>
        {post.tldr ? <Tldr>{post.tldr}</Tldr> : null}
        {post.forwho ? <Forwho yes={post.forwho.yes} no={post.forwho.no} /> : null}
        {post.myth ? <Myth said={post.myth.said} real={post.myth.real} /> : null}
        <MDXRemote
          source={post.body}
          components={getMdxComponents()}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
        {post.todo && post.todo.length > 0 ? <Todo items={post.todo} /> : null}
      </article>
      <PostNav prev={prev} next={next} />
    </>
  );
}
