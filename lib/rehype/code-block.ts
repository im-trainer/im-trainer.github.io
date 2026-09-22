import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Wraps every `<pre>` in `<div class="code-block">` and appends an empty
 * `<button data-code-copy>` next to it, so the copy button exists in the
 * static HTML that `next build` emits.
 *
 * The button is a sibling of `<pre>`, not a child: `<pre>` scrolls
 * horizontally, and a button inside it would slide away with the code.
 *
 * It is emitted EMPTY, as a slot. `components/CodeCopy.tsx` portals the real
 * button content (lucide icon + localized aria-label) into it on mount. That
 * keeps every user-facing string in `messages/{ro,en}.json`, per the project
 * rule, instead of hardcoding Romanian text into `lib/`.
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

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block"] },
        children: [
          node,
          {
            type: "element",
            tagName: "button",
            properties: { type: "button", "data-code-copy": "" },
            children: [],
          },
        ],
      };
    });
  };
}
