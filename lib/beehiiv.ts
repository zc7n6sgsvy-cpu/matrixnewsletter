// Beehiiv API client for Matrix Newsletter
// Adapted for Next.js + Vercel
// Set these in Vercel env vars:
//   BEEHIIV_API_KEY=...
//   BEEHIIV_PUB_ID=pub_xxx (or just the uuid)

const API_BASE = 'https://api.beehiiv.com/v2';

function getPubId() {
  const raw = process.env.BEEHIIV_PUB_ID;
  if (!raw) return null;
  return raw.startsWith('pub_') ? raw : `pub_${raw}`;
}

function getApiKey() {
  return process.env.BEEHIIV_API_KEY;
}

export function isBeehiivConfigured() {
  return Boolean(getPubId() && getApiKey());
}

// Types (minimal, based on Beehiiv API)
export interface BeehiivPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  publish_date: number | string;
  status: string;
  hidden_from_feed?: boolean;
  content?: {
    free?: {
      web?: string;
    };
  };
  stats?: {
    clicks?: number;
    clicks_unique?: number;
    opens?: number;
    opens_unique?: number;
    // etc.
  };
}

export interface BeehiivPublication {
  id: string;
  name: string;
  stats?: {
    active_subscribers?: number;
    total_subscribers?: number;
    // more available
  };
}

// Subscribe a new reader
export async function createSubscription(email: string, source = 'matrixnewsletter.com') {
  const pubId = getPubId();
  const apiKey = getApiKey();

  if (!pubId || !apiKey) {
    throw new Error('Beehiiv is not configured. Set BEEHIIV_API_KEY and BEEHIIV_PUB_ID.');
  }

  const payload = {
    email,
    reactivate_existing: true,
    send_welcome_email: true,
    utm_source: source,
    utm_medium: 'website',
    referring_site: 'https://matrixnewsletter.com',
  };

  const res = await fetch(`${API_BASE}/publications/${pubId}/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Beehiiv returns 409 for already subscribed in some cases
    const message = data?.error || data?.message || 'Subscription failed';
    return { ok: false, status: res.status, message };
  }

  return { ok: true, status: res.status, data };
}

// Fetch publication stats (subscriber counts etc.)
export async function fetchPublicationStats() {
  const pubId = getPubId();
  const apiKey = getApiKey();

  if (!pubId || !apiKey) return null;

  const url = `${API_BASE}/publications/${pubId}?expand[]=stats`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 300 }, // 5 min cache
  });

  if (!res.ok) return null;
  return res.json();
}

// Fetch recent confirmed posts (for landing + archive)
export async function fetchRecentPosts(limit = 12): Promise<BeehiivPost[]> {
  const pubId = getPubId();
  const apiKey = getApiKey();

  if (!pubId || !apiKey) return [];

  const url = new URL(`${API_BASE}/publications/${pubId}/posts`);
  url.searchParams.set('expand[]', 'stats');
  url.searchParams.set('expand[]', 'free_web_content');
  url.searchParams.set('status', 'confirmed');
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('order_by', 'publish_date');
  url.searchParams.set('direction', 'desc');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];

  const json = await res.json();
  const posts: BeehiivPost[] = json.data || [];

  return posts.filter((p) => !p.hidden_from_feed && p.slug);
}

// Fetch a single post by slug (scans recent + paginates a bit)
export async function fetchPostBySlug(slug: string): Promise<BeehiivPost | null> {
  // First try recent
  const recent = await fetchRecentPosts(50);
  const match = recent.find((p) => p.slug === slug);
  if (match) return match;

  // Fallback: fetch more pages if needed (light pagination)
  const pubId = getPubId();
  const apiKey = getApiKey();
  if (!pubId || !apiKey) return null;

  let page = 1;
  const LIMIT = 50;
  while (page < 6) {
    const url = new URL(`${API_BASE}/publications/${pubId}/posts`);
    url.searchParams.set('expand[]', 'free_web_content');
    url.searchParams.set('status', 'confirmed');
    url.searchParams.set('limit', String(LIMIT));
    url.searchParams.set('page', String(page));
    url.searchParams.set('order_by', 'publish_date');
    url.searchParams.set('direction', 'desc');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) break;

    const json = await res.json();
    const batch: BeehiivPost[] = json.data || [];
    const found = batch.find((p) => p.slug === slug && !p.hidden_from_feed);
    if (found) return found;

    if (batch.length < LIMIT) break;
    page++;
  }

  return null;
}

// Sanitize Beehiiv's full HTML web content into clean embeddable fragment.
// Beehiiv returns complete documents; we strip head/body/scripts etc.
export function sanitizeBeehiivContent(raw: string): string {
  let html = String(raw || '');

  html = html.replace(/<!DOCTYPE[^>]*>/gi, '');
  html = html.replace(/<head[\s\S]*?<\/head>/gi, '');
  html = html.replace(/<\/?html[^>]*>/gi, '');
  html = html.replace(/<\/?body[^>]*>/gi, '');
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<link\b[^>]*>/gi, '');

  // Remove Beehiiv's duplicate web header if present
  const headerMatch = /<div\b[^>]*\bid=['"]?web-header['"]?[^>]*>/i.exec(html);
  if (headerMatch) {
    // Simple balanced strip (good enough)
    let start = headerMatch.index;
    let depth = 1;
    const tagRe = /<(\/?)div\b[^>]*>/gi;
    tagRe.lastIndex = start + headerMatch[0].length;
    let m;
    while ((m = tagRe.exec(html))) {
      if (m[1] === '/') {
        if (--depth === 0) {
          html = html.slice(0, start) + html.slice(m.index + m[0].length);
          break;
        }
      } else {
        depth++;
      }
    }
  }

  return html.trim();
}

export function formatPublishDate(p: BeehiivPost): string {
  const ts = typeof p.publish_date === 'number' ? p.publish_date * 1000 : Date.parse(p.publish_date as string);
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();
}

export function estimateReadingTime(post: BeehiivPost): number {
  const text = String(post.content?.free?.web || '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
