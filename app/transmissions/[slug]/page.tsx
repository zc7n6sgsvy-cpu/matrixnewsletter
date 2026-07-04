import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPostBySlug, sanitizeBeehiivContent, formatPublishDate, estimateReadingTime, isBeehiivConfigured } from '@/lib/beehiiv';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return { title: 'Transmission not found — Matrix Newsletter' };
  }

  return {
    title: `${post.title} — Matrix Newsletter`,
    description: post.subtitle || 'A transmission from Matrix Newsletter.',
    openGraph: {
      title: post.title,
    },
  };
}

export default async function TransmissionPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  const configured = isBeehiivConfigured();

  if (!post) {
    notFound();
  }

  const date = formatPublishDate(post);
  const readingTime = estimateReadingTime(post);
  const body = sanitizeBeehiivContent(post.content?.free?.web || '');

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/archive" className="font-mono text-sm text-[#54f0a0] hover:underline">← ALL TRANSMISSIONS</Link>
        <div className="flex items-center gap-4 mt-6 text-sm font-mono text-[#54f0a0]">
          <span>{date}</span>
          <span className="opacity-40">•</span>
          <span>{readingTime} MIN READ</span>
        </div>
        <h1 className="text-5xl font-semibold tracking-[-1.5px] leading-none mt-3">{post.title}</h1>
        {post.subtitle && <p className="mt-4 text-xl text-[#aecabb]">{post.subtitle}</p>}
      </div>

      {/* Reader content — we keep Beehiiv's HTML but scope it inside a dark reader */}
      <article
        className="beehiiv-reader prose prose-invert max-w-none text-[#d1e8d8] bg-[#070d0a] border border-[#15301f] rounded-2xl p-10 md:p-14"
        dangerouslySetInnerHTML={{ __html: body }}
      />

      {!configured && (
        <div className="mt-8 text-xs font-mono text-[#54f0a0]/50">
          This is a preview. Real content will load from Beehiiv once keys are added.
        </div>
      )}

      <div className="mt-16 border-t border-[#15301f] pt-8 flex flex-col md:flex-row gap-4 text-sm font-mono">
        <Link href="/archive" className="hover:text-[#54f0a0]">← Back to archive</Link>
        <Link href="/#subscribe" className="hover:text-[#54f0a0] md:ml-auto">Subscribe for the next one</Link>
      </div>
    </div>
  );
}
