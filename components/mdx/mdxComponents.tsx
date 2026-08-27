import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import Tldr from "./Tldr";
import Forwho from "./Forwho";
import Myth from "./Myth";
import Todo from "./Todo";
import Fig from "./Fig";
import Flow from "./Flow";
import Stack from "./Stack";

export function slugify(text: ReactNode): string {
  const str = typeof text === "string" ? text : String(text);
  return str
    .toLowerCase()
    .replace(/[^\wㄱ-힝\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Returns a fresh components map with its own h2-numbering counter — call once per render. */
export function getMdxComponents() {
  let n = 0;
  return {
    h2: ({ children }: { children: ReactNode }) => {
      n += 1;
      const num = String(n).padStart(2, "0");
      const id = slugify(children);
      return (
        <h2 id={id}>
          <span className="qn">{num}</span>
          {children}
        </h2>
      );
    },
    table: ({ children }: { children: ReactNode }) => (
      <div className="tw">
        <table>{children}</table>
      </div>
    ),
    a: ({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      if (href && href.startsWith("/")) {
        return (
          <Link href={href} {...rest}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      );
    },
    Tldr,
    Forwho,
    Myth,
    Todo,
    Fig,
    Flow,
    Stack,
  };
}
