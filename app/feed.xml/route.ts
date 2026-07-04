import { fetchRecentPosts, formatPublishDate, sanitizeBeehiivContent } from '@/lib/beehiiv';

export async function GET() {
  const posts = await fetchRecentPosts(50);

  const items = posts.map((post) => {
    const date = new Date(
      typeof post.publish_date === 'number' ? post.publish_date * 1000 : post.publish_date
    ).toUTCString();

    const content = sanitizeBeehiivContent(post.content?.free?.web || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>https://matrixnewsletter.com/transmissions/${post.slug}</link>
        <guid>https://matrixnewsletter.com/transmissions/${post.slug}</guid>
        <pubDate>${date}</pubDate>
        <description>${escapeXml(post.subtitle || '')}</description>
        <content:encoded><![CDATA[${content}]]></content:encoded>
      </item>
    `;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>Matrix Newsletter</title>
  <link>https://matrixnewsletter.com</link>
  <description>Decode the signal. Weekly transmissions. Zero noise.</description>
  <language>en</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${items}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=300, stale-while-revalidate',
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
