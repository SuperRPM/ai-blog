import fs from "node:fs";
import path from "node:path";
import { load } from "js-yaml";

export interface GlossaryTerm {
  term: string;
  en?: string;
  desc: string;
  link?: string;
}
export interface GlossaryGroup {
  name: string;
  terms: GlossaryTerm[];
}
export interface GlossaryData {
  groups: GlossaryGroup[];
}

export function getGlossary(): GlossaryData {
  const file = path.join(process.cwd(), "content", "glossary.yml");
  const raw = fs.readFileSync(file, "utf8");
  return load(raw) as GlossaryData;
}
