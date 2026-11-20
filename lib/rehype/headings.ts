import type { Element, ElementContent, Root } from "hast";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function textOf(node: Element | ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

/** "Ce urmează?" -> "ce-urmeaza": diacritics folded, everything else to `-`. */
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Give every `h2` / `h3` an `id` and collect them on `file.data.headings`, in
 * document order. The ids are the anchor targets for the article outline
 * (`components/blog/ArticleOutline.tsx`), which also uses them to work out
 * which section is currently being read.
 */
export default function rehypeHeadings() {
  return function transform(tree: Root, file: VFile): void {
    const headings: Heading[] = [];
    const used = new Map<string, number>();

    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "h2" && node.tagName !== "h3") return;

      const text = textOf(node).trim();
      if (!text) return;

      // Two sections may share a title; suffix repeats so ids stay unique.
      const base = slugify(text) || "section";
      const seen = used.get(base) ?? 0;
      used.set(base, seen + 1);
      const id = seen === 0 ? base : `${base}-${seen + 1}`;

      node.properties.id = id;
      headings.push({
        id,
        text,
        level: node.tagName === "h2" ? 2 : 3,
      });
    });

    file.data.headings = headings;
  };
}
