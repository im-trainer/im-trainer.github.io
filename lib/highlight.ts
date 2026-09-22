import { createLowlight } from "lowlight";
import apache from "highlight.js/lib/languages/apache";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import type { Element, ElementContent, Nodes, Root } from "hast";
import { visit } from "unist-util-visit";

// Syntax highlighting for blog code fences, applied at BUILD time: this module
// is only ever imported by `lib/blog.ts`, which runs during `next build` under
// `output: "export"`. Nothing here ships to the browser.

/**
 * `diff`, plus Git conflict markers.
 *
 * The stock grammar handles real diffs well (`+`/`-` lines, `@@` hunks), but
 * of the three conflict markers it only matches `=======`, and colors it as a
 * comment — which reads as if the middle line were the odd one out. Since the
 * blog explains merge conflicts, we add all four markers (`|||||||` shows up
 * in diff3 style) and leave the rest of the grammar untouched.
 *
 * They get their own `conflict` scope rather than an existing one: `meta`
 * renders in the muted comment color, and a conflict marker is the opposite of
 * an aside — it is the thing the reader has to find and delete. The matching
 * `.hljs-conflict` rule lives in `app/globals.css`.
 */
function diffWithConflictMarkers(hljs: Parameters<typeof diff>[0]) {
  const base = diff(hljs);
  return {
    ...base,
    contains: [
      { scope: "conflict", begin: /^(<{7}|>{7}|\|{7}).*$/, relevance: 10 },
      { scope: "conflict", begin: /^={7}$/, relevance: 10 },
      ...(base.contains ?? []),
    ],
  };
}

// We import `createLowlight` bare instead of lowlight's `common` preset, and
// register an explicit list of grammars. The usual reason for that — keeping
// ~37 unused grammars out of the client bundle — does NOT apply here, since
// none of this reaches the browser. The list is explicit anyway, as a
// deliberate choice: it documents which languages the blog supports, and the
// cost of getting it wrong is small and visible (an unstyled block) rather
// than a silent bundle regression. `common` would hide that decision.
const lowlight = createLowlight({
  apache,
  bash,
  css,
  diff: diffWithConflictMarkers,
  java,
  javascript,
  json,
  python,
  sql,
  typescript,
  xml,
  yaml,
});

// Aliases people actually type in fences. `tsx`/`jsx` are not separate grammars
// in highlight.js, and `sh`/`shell`/`html`/`yml` are what gets written in
// practice. Without these the block silently renders unstyled.
lowlight.registerAlias({
  typescript: ["ts", "tsx"],
  javascript: ["js", "jsx"],
  bash: ["sh", "shell", "zsh"],
  xml: ["html"],
  python: ["py"],
  yaml: ["yml"],
  // highlight.js has no ssh-config grammar. `apache` is the closest fit —
  // same `Directive value` shape with `#` comments — so we alias it and write
  // ```ssh-config in the Markdown, which says what the block actually is.
  apache: ["sshconfig", "ssh-config"],
});

/** The language from the `language-xxx` class Markdown puts on `<code>`. */
function languageOf(node: Element): string | undefined {
  const classes = node.properties?.className;
  if (!Array.isArray(classes)) return undefined;
  for (const value of classes) {
    if (typeof value === "string" && value.startsWith("language-")) {
      return value.slice("language-".length);
    }
  }
  return undefined;
}

/** Raw text of a node, concatenated from its leaves. */
function textOf(node: Nodes): string {
  if (node.type === "text") return node.value;
  if (!("children" in node)) return "";
  return node.children.map(textOf).join("");
}

/**
 * Rehype plugin: colorizes `<pre><code class="language-x">`.
 *
 * We deliberately do NOT guess the language when the class is missing.
 * highlight.js auto-detection is unreliable on the short, unlabelled snippets
 * our posts contain (a `.gitignore`, an SSH config), and a wrong guess looks
 * worse than no colors at all.
 */
export default function rehypeHighlightSubset() {
  return function transform(tree: Root): void {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;

      const code = node.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code"
      );
      if (!code) return;

      const language = languageOf(code);
      // Unknown or unregistered language -> leave the block as plain text.
      // `lowlight.highlight` would throw "Unknown language", and an exception
      // here fails the whole build, not just this block.
      if (!language || !lowlight.registered(language)) return;

      const highlighted = lowlight.highlight(language, textOf(code));
      code.children = highlighted.children as ElementContent[];

      const classes = Array.isArray(code.properties.className)
        ? code.properties.className
        : [];
      code.properties.className = ["hljs", ...classes];
    });
  };
}
