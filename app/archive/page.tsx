import Link from 'next/link';
import { fetchRecentPosts, formatPublishDate, estimateReadingTime, isBeehiivConfigured } from '@/lib/beehiiv';

export const metadata = {
  title: 'Archive — Matrix Newsletter',
  description: 'All past transmissions. Decode the signal.',
};

export default async function ArchivePage() {
  const posts = await fetchRecentPosts(100);
  const configured = isBeehiivConfigured();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <Link href="/" className="font-mono text-sm text-[#54f0a0] hover:underline">← BACK TO SIGNAL</Link>
        <h1 className="text-6xl font-semibold tracking-[-2px] mt-4">ARCHIVE</h1>
        <p className="text-[#aecabb] mt-2">Every confirmed transmission, in reverse chronological order.</p>
      </div>

      {!configured && (
        <div className="mb-8 p-4 border border-[#15301f] bg-[#0a140f] text-sm font-mono">
          Beehiiv is not yet connected. Add your API keys to see real issues here.
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-[#54f0a0]/70">No transmissions found yet. Publish your first issue in Beehiiv.</div>
      ) : (
        <div className="space-y-1 border-t border-[#15301f]">
          {posts.map((post) => {
            const date = formatPublishDate(post);
            const reading = estimateReadingTime(post);
            return (
              <Link
                key={post.id}
                href={`/transmissions/${post.slug}`}
                className="group flex items-center justify-between border-b border-[#15301f] py-6 px-2 hover:bg-[#0a140f] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 text-sm font-mono text-[#54f0a0]">
                    <span>{date}</span>
                    <span className="text-[#54f0a0]/40">•</span>
                    <span>{reading} MIN READ</span>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight mt-1 group-hover:text-[#54f0a0] transition-colors">
                    {post.title}
                  </h2>
                  {post.subtitle && (
                    <p className="text-[#aecabb] mt-1 line-clamp-1">{post.subtitle}</p>
                  )}
                </div>
                <div className="text-[#54f0a0] font-mono text-sm pl-8 group-hover:translate-x-1 transition">READ →</div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-16 text-xs font-mono text-[#54f0a0]/50">
        Powered by Beehiiv • Content automatically synced from your publication
      </div>
    </div>
  );
}
