import { useSyncExternalStore } from "react";

// What the visitor did on the blog, kept in their own browser only: how often
// they opened each article and which ones they pinned. It feeds the quick-links
// bar on the home page. Keyed by slug, so it is shared between both languages.
// Client-side only; every access is guarded because localStorage throws in
// private windows and when site data is blocked.
const STORAGE_KEY = "im-trainer.blog-activity";
const CHANGE_EVENT = "im-trainer:blog-activity";

/** How many "most visited" articles the quick-links bar shows inline. */
export const MOST_VISITED_LIMIT = 3;
/** How many it lists once they are folded into a dropdown. */
export const MOST_VISITED_MENU_LIMIT = 5;

/** How long an article has to stay on screen before it counts as a visit. */
export const VISIT_AFTER_MS = 10_000;

// One article counts at most once in this window, so reloading the page or
// hopping back and forth does not inflate its count.
const VISIT_COOLDOWN_MS = 30 * 60 * 1000;

export interface BlogVisit {
  count: number;
  /** Timestamp (ms) of the latest visit — the tie-breaker between equal counts. */
  last: number;
}

export interface BlogActivity {
  visits: Record<string, BlogVisit>;
  /** Pinned slugs, oldest pin first. */
  pins: string[];
}

const EMPTY: BlogActivity = { visits: {}, pins: [] };

/** Anything unexpected in storage (old shape, hand-edited, corrupt) is dropped. */
function parse(raw: string | null): BlogActivity {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<BlogActivity> | null;
    if (!data || typeof data !== "object") return EMPTY;

    const visits: Record<string, BlogVisit> = {};
    if (data.visits && typeof data.visits === "object") {
      for (const [slug, visit] of Object.entries(data.visits)) {
        if (
          visit &&
          Number.isFinite(visit.count) &&
          visit.count > 0 &&
          Number.isFinite(visit.last)
        ) {
          visits[slug] = { count: visit.count, last: visit.last };
        }
      }
    }

    const pins = Array.isArray(data.pins)
      ? [...new Set(data.pins.filter((p) => typeof p === "string"))]
      : [];

    return {
      visits,
      pins,
    };
  } catch {
    return EMPTY;
  }
}

// `useSyncExternalStore` needs the same object back while nothing changed, so
// the parsed value is cached against the raw string it came from.
let cachedRaw: string | null = null;
let cached: BlogActivity = EMPTY;

export function readActivity(): BlogActivity {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parse(raw);
  }
  return cached;
}

function write(next: BlogActivity) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore — this is a convenience, not required for the site to work.
    return;
  }
  // The `storage` event only fires in *other* tabs; this one tells this tab.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function recordVisit(slug: string) {
  const now = Date.now();
  const activity = readActivity();
  const previous = activity.visits[slug];
  if (previous && now - previous.last < VISIT_COOLDOWN_MS) return;

  const count = (previous?.count ?? 0) + 1;
  write({
    ...activity,
    visits: {
      ...activity.visits,
      [slug]: {
        count,
        last: now,
      },
    },
  });
}

export function togglePin(slug: string) {
  const activity = readActivity();
  const pins = activity.pins.includes(slug)
    ? activity.pins.filter((p) => p !== slug)
    : [...activity.pins, slug];
  write({
    ...activity,
    pins,
  });
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * Live view of the stored activity. Empty while prerendering and during
 * hydration (so the static HTML always matches), real right after.
 */
export function useBlogActivity(): BlogActivity {
  return useSyncExternalStore(subscribe, readActivity, () => EMPTY);
}

const noop = () => () => {};

/**
 * False while prerendering and hydrating, true afterwards — i.e. whether what
 * `useBlogActivity` returns is the visitor's real data yet.
 */
export function useActivityLoaded(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export interface QuickLinks {
  pinned: string[];
  mostVisited: {
    slug: string;
    count: number;
  }[];
}

/**
 * What the quick-links bar shows: every pinned article, then the most visited
 * ones that are not already pinned. Slugs of articles that no longer exist are
 * skipped.
 */
export function selectQuickLinks(
  activity: BlogActivity,
  knownSlugs: ReadonlySet<string>,
): QuickLinks {
  const pinned = activity.pins.filter((slug) => knownSlugs.has(slug));
  const mostVisited = Object.entries(activity.visits)
    .filter(([slug]) => knownSlugs.has(slug) && !pinned.includes(slug))
    .sort(([, a], [, b]) => b.count - a.count || b.last - a.last)
    .slice(0, MOST_VISITED_MENU_LIMIT)
    .map(([slug, visit]) => ({
      slug,
      count: visit.count,
    }));
  return {
    pinned,
    mostVisited,
  };
}
