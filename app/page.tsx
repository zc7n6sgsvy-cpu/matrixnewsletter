import React from 'react';
import Link from 'next/link';
import MatrixEffects from '@/components/MatrixEffects';
import SubscribeForm from '@/components/SubscribeForm';
import {
  fetchRecentPosts,
  fetchPublicationStats,
  isBeehiivConfigured,
  formatPublishDate,
} from '@/lib/beehiiv';

export default async function MatrixNewsletter() {
  // Fetch real data from Beehiiv (falls back gracefully if not configured)
  const [recentPosts, stats] = await Promise.all([
    fetchRecentPosts(8),
    fetchPublicationStats(),
  ]);

  const configured = isBeehiivConfigured();
  const activeSubscribers = stats?.data?.stats?.active_subscribers || 42000;
  const totalSent = Math.max(87, recentPosts.length);

  const transmissions = recentPosts.length > 0
    ? recentPosts.map((post, idx) => ({
        id: post.id,
        number: `#${String(87 - idx).padStart(3, '0')}`,
        title: post.title,
        slug: post.slug,
        date: formatPublishDate(post),
      }))
    : [
        { id: 'hardcoded-1', number: '#087', title: 'The quiet death of the password', slug: null, date: 'JUN 08 2026' },
        { id: 'hardcoded-2', number: '#086', title: 'Who actually owns your face', slug: null, date: 'JUN 01 2026' },
        { id: 'hardcoded-3', number: '#085', title: 'The algorithms that price everything', slug: null, date: 'MAY 25 2026' },
        { id: 'hardcoded-4', number: '#084', title: 'The internet\'s load-bearing volunteers', slug: null, date: 'MAY 18 2026' },
      ];

  return (
    <MatrixEffects>
      <header className="wrap pt-8">
        <div className="eyebrow">Encrypted transmission · weekly · 0 noise</div>

        <div className="console" aria-hidden="true">
          <div className="console-bar">
            <i></i><i></i><i></i>
            <small>matrix_newsletter — bash</small>
          </div>
          <pre id="boot"></pre>
        </div>

        <h1 data-decode>
          See what&apos;s <span className="lit">really running</span> underneath.
        </h1>

        <p className="lede">
          Every Sunday, Matrix Newsletter decodes the week in tech, systems, and the strange machinery quietly shaping how we live online. <b>One signal. Zero filler.</b>
        </p>

        <div id="subscribe">
          <SubscribeForm idPrefix="hero" />
        </div>
      </header>

      <section className="wrap">
        <div className="sec-head">
          <span className="sec-num">[01]</span>
          <h2 className="sec-title" data-decode>What you&apos;ll decode</h2>
          <span className="sec-rule"></span>
        </div>
        <div className="packets">
          <div className="packet">
            <span className="idx">001</span>
            <span className="tag">// SIGNAL</span>
            <h3 data-decode>The mechanism</h3>
            <p>Deep dives that cut past the hype cycle to the actual machinery underneath — how the thing works, who it serves, and what it costs.</p>
          </div>
          <div className="packet">
            <span className="idx">002</span>
            <span className="tag">// PATTERN</span>
            <h3 data-decode>The connections</h3>
            <p>The thread tying this week&apos;s scattered stories together — the pattern nobody else is naming yet, drawn in plain language.</p>
          </div>
          <div className="packet">
            <span className="idx">003</span>
            <span className="tag">// ACCESS</span>
            <h3 data-decode>The good stuff</h3>
            <p>Tools, links, and reads we actually used this week. No affiliate bait, no filler list of forty tabs you&apos;ll never open.</p>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="sec-head">
          <span className="sec-num">[02]</span>
          <h2 className="sec-title" data-decode>Recent transmissions</h2>
          <span className="sec-rule"></span>
          <Link href="/archive" className="text-xs font-mono text-[#54f0a0] hover:underline ml-auto">VIEW FULL ARCHIVE →</Link>
        </div>

        <div className="feed">
          {transmissions.map((tx, index) => {
            const href = tx.slug ? `/transmissions/${tx.slug}` : '#subscribe';
            return (
              <Link key={tx.id || index} href={href} className="tx">
                <span className="id">{tx.number}</span>
                <span className="ttl">
                  {tx.title}
                  <em>— {tx.date}</em>
                </span>
                <span className="date">{tx.date}</span>
                <span className="arrow">→</span>
              </Link>
            );
          })}
        </div>

        {recentPosts.length === 0 && !configured && (
          <p className="text-xs text-[#54f0a0]/60 mt-4 font-mono">
            (Live issues will appear here once Beehiiv is connected)
          </p>
        )}
      </section>

      <section className="wrap">
        <div className="sec-head">
          <span className="sec-num">[03]</span>
          <h2 className="sec-title" data-decode>Status report</h2>
          <span className="sec-rule"></span>
        </div>
        <div className="readouts">
          <div className="readout">
            <div className="num" data-count={activeSubscribers}>{activeSubscribers}</div>
            <div className="lbl">Readers online</div>
          </div>
          <div className="readout">
            <div className="num" data-count={totalSent}>{totalSent}</div>
            <div className="lbl">Transmissions sent</div>
          </div>
          <div className="readout">
            <div className="num" data-count="68" data-suffix="%">68%</div>
            <div className="lbl">Open rate</div>
          </div>
        </div>
        {!configured && (
          <p className="text-center text-xs mt-4 text-[#54f0a0]/50 font-mono">
            Live stats will sync from Beehiiv when configured
          </p>
        )}
      </section>

      <section className="wrap" id="subscribe">
        <div className="closer">
          <h2 data-decode>Stop reading the <span className="lit">noise</span>.</h2>
          <p>Join {activeSubscribers.toLocaleString()} readers who get the week decoded, every Sunday morning, in about a four-minute read.</p>
          <SubscribeForm idPrefix="closer" compact />
        </div>
      </section>

      <footer className="wrap">
        <div className="foot">
          <div>© 2026 MATRIX NEWSLETTER · matrixnewsletter.com</div>
          <div className="links">
            <Link href="/archive">Archive</Link>
            <Link href="/#subscribe">Subscribe</Link>
            <a href="/feed.xml" target="_blank">RSS</a>
          </div>
        </div>
      </footer>
    </MatrixEffects>
  );
}
