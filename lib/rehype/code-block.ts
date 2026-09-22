import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Display names for the fence languages we highlight. These are product names
 * ("JavaScript", "SQL"), spelled the same in Romanian and English, so they stay
 * here rather than in `messages/*.json` — there would be nothing to translate.
 * Keys are the raw fence token, including the aliases people type.
 */
const LANGUAGE_NAMES: Record<string, string> = {
  bash: "Bash",
  sh: "Bash",
  shell: "Bash",
  zsh: "Bash",
  css: "CSS",
  diff: "Diff",
  html: "HTML",
  java: "Java",
  javascript: "JavaScript",
  js: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  py: "Python",
  python: "Python",
  sql: "SQL",
  "ssh-config": "SSH Config",
  sshconfig: "SSH Config",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
};

/** The raw fence token from the `language-xxx` class Markdown puts on `<code>`. */
function languageOf(pre: Element): string | undefined {
  const code = pre.children.find(
    (child): child is Element =>
      child.type === "element" && child.tagName === "code",
  );
  const classes = code?.properties?.className;
  if (!Array.isArray(classes)) return undefined;
  for (const value of classes) {
    if (typeof value === "string" && value.startsWith("language-")) {
      return value.slice("language-".length);
    }
  }
  return undefined;
}

/**
 * Wraps every `<pre>` in `<div class="code-block">` and puts a header bar above
 * it holding the site's `</>` mark, the language name, and the copy button.
 *
 * Everything here is emitted into the static HTML at build time. The button is
 * emitted EMPTY, as a slot: `components/CodeCopy.tsx` portals the real content
 * (lucide icon + localized labels) into it on mount, which keeps every
 * translatable string in `messages/{ro,en}.json` per the project rule.
 *
 * The bar sits outside `<pre>` because `<pre>` scrolls horizontally — anything
 * inside it would slide away from a long line of code.
 */
export default function rehypeCodeBlock() {
  return function transform(tree: Root): void {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;

      // `visit` walks into the subtree we just created, so without this guard
      // the `<pre>` would get wrapped over and over.
      if (
        parent.type === "element" &&
        Array.isArray(parent.properties?.className) &&
        parent.properties.className.includes("code-block")
      ) {
        return;
      }

      const token = languageOf(node);
      const name = token ? (LANGUAGE_NAMES[token] ?? token) : undefined;

      const bar: Element = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["code-block__bar"],
        },
        children: [
          // The site's logo mark, same glyph as the header wordmark. Decorative:
          // the language name next to it already carries the meaning.
          {
            type: "element",
            tagName: "span",
            properties: {
              className: ["code-block__mark"],
              "aria-hidden": "true",
            },
            children: [{ type: "text", value: "</>" }],
          },
          {
            type: "element",
            tagName: "span",
            properties: {
              className: ["code-block__lang"],
            },
            children: [{ type: "text", value: name ?? "" }],
          },
          {
            type: "element",
            tagName: "button",
            properties: {
              type: "button",
              className: ["code-block__copy"],
              "data-code-copy": "",
            },
            children: [],
          },
        ],
      };

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["code-block"],
        },
        children: [bar, node],
      };
    });
  };
}
