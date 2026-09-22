import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Make external links (absolute http/https URLs) open in a new tab, with
 * `rel="noopener"` to block `window.opener` hijacking. We intentionally omit
 * `noreferrer` so partner/course sites still see referral traffic from us.
 * Internal links are relative (`/ro/…`, `/en/…`) so they don't match and keep
 * opening in the same tab.
 *
 * This used to be a regex over the serialized HTML. Working on the tree instead
 * fixes two real bugs: the regex only matched when `href` was the *first*
 * attribute, and it could match an `href="http…"` written inside a code block.
 */
export default function rehypeExternalLinks() {
  return function transform(tree: Root): void {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;

      const href = node.properties?.href;
      if (typeof href !== "string" || !/^https?:\/\//i.test(href)) return;

      node.properties.target = "_blank";
      node.properties.rel = ["noopener"];
    });
  };
}
