export type SubstackPost = {
  title: string;
  link: string;
  slug: string;
  summary: string;
  publishedAt: string;
  image: string;
  localImage?: string;
};

const FEED_URL = "https://arunarulraj.substack.com/feed";

function decode(text: string) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—");
}

function stripHtml(text: string) {
  return decode(text).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function parseFeed(xml: string): SubstackPost[] {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  return items.map((match) => {
    const block = match[1];
    const pick = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return decode((m?.[1] ?? m?.[2] ?? "").trim());
    };
    const link = pick("link");
    const enclosure = block.match(/<enclosure[^>]*url="([^"]+)"/);
    return {
      title: pick("title"),
      link,
      slug: link.replace(/\/$/, "").split("/").pop() || "",
      summary: stripHtml(pick("description")).slice(0, 320),
      publishedAt: pick("pubDate"),
      image: enclosure?.[1] || "",
    };
  }).filter((p) => p.title && p.link);
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  const fallbackMod = await import("./substack-posts.json");
  const fallback = (fallbackMod.default || fallbackMod) as SubstackPost[];
  const localBySlug = new Map(
    fallback.filter((p) => p.localImage).map((p) => [p.slug, p.localImage as string]),
  );

  try {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": "arunportfolio/1.0" },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const xml = await res.text();
      const posts = parseFeed(xml).map((p) => ({
        ...p,
        localImage: localBySlug.get(p.slug),
        image: localBySlug.get(p.slug) || p.image,
      }));
      if (posts.length) return posts;
    }
  } catch {
    // fall through to bundled snapshot
  }

  return fallback.map((p) => ({
    ...p,
    image: p.localImage || p.image,
  }));
}

export function formatSubstackDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
