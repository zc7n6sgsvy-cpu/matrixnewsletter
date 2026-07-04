"use client";

import React, { useEffect, useRef, useState } from 'react';

// Type for signup status
type StatusState = string;

export default function MatrixNewsletter() {
  const [status1, setStatus1] = useState<StatusState>('');
  const [status2, setStatus2] = useState<StatusState>('');
  const [btnText1, setBtnText1] = useState('JACK IN');
  const [btnText2, setBtnText2] = useState('JACK IN');
  const [btnDisabled1, setBtnDisabled1] = useState(false);
  const [btnDisabled2, setBtnDisabled2] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓ0123456789ABCDEFｦｧｨｩ$+*<>=/'.split('');
    let cols = 0;
    let drops: number[] = [];
    let fontSize = 16;
    let animationFrame: number | null = null;
    let interval: NodeJS.Timeout | null = null;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      fontSize = window.innerWidth < 600 ? 13 : 16;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(0).map(() => Math.random() * -canvas.height / fontSize);
    };

    const draw = () => {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(4,7,6,0.09)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'JetBrains Mono', ui-monospace, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.975 ? '#dffaee' : '#54f0a0';
        ctx.fillText(ch, x, y);

        ctx.fillStyle = 'rgba(31,156,99,0.5)';
        if (y > 0) ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], x, y - fontSize);

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.55;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) {
      draw();
    } else {
      interval = setInterval(draw, 55);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (interval) clearInterval(interval);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [reduceMotion]);

  // Boot console typing
  useEffect(() => {
    const el = document.getElementById('boot');
    if (!el) return;

    const lines = [
      { t: '> initializing matrix_newsletter ...', c: 'dim' },
      { t: '> decrypting weekly signal ...', c: 'dim' },
      { t: '> stripping noise ████████ 100%', c: 'dim' },
      { t: '> connection established.', c: 'ok' },
    ];

    if (reduceMotion) {
      el.innerHTML = lines.map(l => l.c === 'ok' ? `<span class="ok">${l.t}</span>` : l.t).join('\n') + '<span class="cursor"></span>';
      return;
    }

    let li = 0;
    let ci = 0;
    let html = '';

    const type = () => {
      if (li >= lines.length) {
        el.innerHTML = html + '<span class="cursor"></span>';
        return;
      }
      const line = lines[li];
      if (ci === 0 && line.c === 'ok') html += '<span class="ok">';
      html += line.t[ci] === '\n' ? '' : line.t[ci];
      ci++;
      if (ci >= line.t.length) {
        if (line.c === 'ok') html += '</span>';
        html += '\n';
        li++;
        ci = 0;
        el.innerHTML = html + '<span class="cursor"></span>';
        setTimeout(type, 240);
      } else {
        el.innerHTML = html + '<span class="cursor"></span>';
        setTimeout(type, 22);
      }
    };

    type();
  }, [reduceMotion]);

  // Decode text scramble effect + count up
  useEffect(() => {
    if (reduceMotion) return;

    const chars = '▓▒░01アカサ$+*<>#=/ﾊﾐﾑｦ';

    const scramble = (el: HTMLElement) => {
      const target = el.dataset.text || el.textContent || '';
      el.dataset.text = target;
      const original = el.innerHTML;
      const plain = target;
      let frame = 0;
      const total = plain.length;
      const dur = Math.min(38, 14 + total);

      const iv = setInterval(() => {
        let out = '';
        for (let i = 0; i < plain.length; i++) {
          if (plain[i] === ' ') { out += ' '; continue; }
          if (i < frame) out += plain[i];
          else out += chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = out;
        frame += plain.length / dur;
        if (frame >= plain.length) {
          clearInterval(iv);
          el.innerHTML = original;
        }
      }, 28);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !(e.target as HTMLElement).dataset.done) {
          (e.target as HTMLElement).dataset.done = '1';
          scramble(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll<HTMLElement>('[data-decode]').forEach(el => io.observe(el));

    // Count up animation
    const animateCount = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.count || '0');
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const steps = 60;
      const inc = target / steps;

      const iv = setInterval(() => {
        cur += inc;
        if (cur >= target) { cur = target; clearInterval(iv); }
        el.textContent = Math.floor(cur).toLocaleString() + suffix;
      }, 22);
    };

    const countIo = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !(e.target as HTMLElement).dataset.run) {
          (e.target as HTMLElement).dataset.run = '1';
          animateCount(e.target as HTMLElement);
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => countIo.observe(el));

    return () => {
      io.disconnect();
      countIo.disconnect();
    };
  }, [reduceMotion]);

  // Signup handler
  const wireSignup = (
    inputId: string,
    setStatus: (s: string) => void,
    setBtnText: (t: string) => void,
    setDisabled: (d: boolean) => void,
    initialBtn: string
  ) => {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;

    const valid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const run = () => {
      const v = input.value.trim();
      if (!valid(v)) {
        setStatus('> ERROR: invalid address. check syntax and retry.');
        input.focus();
        return;
      }

      setDisabled(true);
      setStatus('> establishing secure channel ...');

      const seq = [
        '> establishing secure channel ...',
        `> verifying ${v} ...`,
        '> ████████████ ACCESS GRANTED',
        '> welcome to the matrix. transmission #088 inbound.',
      ];

      let i = 0;
      const iv = setInterval(() => {
        i++;
        if (i >= seq.length) {
          clearInterval(iv);
          setBtnText('IN ✓');
          setStatus(seq[seq.length - 1]);
          return;
        }
        setStatus(seq[i]);
      }, 620);
    };

    // Attach listeners (using global since inputs are static)
    const btn = document.getElementById(inputId === 'email' ? 'jack' : 'jack2');
    if (btn) {
      const handler = () => run();
      btn.addEventListener('click', handler);
      // Cleanup not critical for this one-time page
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') run();
    });
  };

  // Wire signups after mount
  useEffect(() => {
    // Small delay to ensure DOM
    const t = setTimeout(() => {
      // We directly use the functions via DOM ids in the markup onclick alternative
      // But attach here for robustness
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubscribe = (
    e: React.FormEvent | React.MouseEvent,
    which: 1 | 2
  ) => {
    e.preventDefault();
    const inputId = which === 1 ? 'email' : 'email2';
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) return;

    const v = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    if (!valid) {
      if (which === 1) {
        setStatus1('> ERROR: invalid address. check syntax and retry.');
      } else {
        setStatus2('> ERROR: invalid address. check syntax and retry.');
      }
      input.focus();
      return;
    }

    if (which === 1) {
      setBtnDisabled1(true);
      setStatus1('> establishing secure channel ...');
    } else {
      setBtnDisabled2(true);
      setStatus2('> establishing secure channel ...');
    }

    const seq = [
      '> establishing secure channel ...',
      `> verifying ${v} ...`,
      '> ████████████ ACCESS GRANTED',
      '> welcome to the matrix. transmission #088 inbound.',
    ];

    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i >= seq.length) {
        clearInterval(iv);
        if (which === 1) {
          setBtnText1('IN ✓');
          setStatus1(seq[seq.length - 1]);
        } else {
          setBtnText2('IN ✓');
          setStatus2(seq[seq.length - 1]);
        }
        return;
      }
      if (which === 1) setStatus1(seq[i]);
      else setStatus2(seq[i]);
    }, 620);
  };

  return (
    <>
      <canvas id="rain" ref={canvasRef} />
      <div className="grid-overlay" />
      <div className="vignette" />
      <div className="scanlines" />

      <nav>
        <div className="brand">
          <span className="glyph">▚</span>
          <b>MATRIX</b>
          <span>NEWSLETTER</span>
        </div>
        <div className="nav-meta">SYS://ONLINE <span className="dot">●</span></div>
      </nav>

      <header className="wrap">
        <div className="eyebrow">Encrypted transmission · weekly · 0 noise</div>

        <div className="console" aria-hidden="true">
          <div className="console-bar">
            <i></i><i></i><i></i>
            <small>matrix_newsletter — bash</small>
          </div>
          <pre id="boot"></pre>
        </div>

        <h1 data-decode>See what&apos;s <span className="lit">really running</span> underneath.</h1>

        <p className="lede">
          Every Sunday, Matrix Newsletter decodes the week in tech, systems, and the strange machinery quietly shaping how we live online. <b>One signal. Zero filler.</b>
        </p>

        <div className="signup">
          <div className="signup-label">// run: subscribe --email</div>
          <div className="field">
            <span className="prompt">$</span>
            <input 
              id="email" 
              type="email" 
              inputMode="email" 
              placeholder="you@domain.net" 
              aria-label="Email address" 
            />
            <button 
              className="jack" 
              id="jack" 
              onClick={(e) => handleSubscribe(e, 1)}
              disabled={btnDisabled1}
            >
              {btnText1}
            </button>
          </div>
          <div className="status" id="status" role="status" aria-live="polite">{status1}</div>
          <div className="signup-note">No spam. No selling your data. Unsubscribe with one keystroke.</div>
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
        </div>
        <div className="feed">
          <a className="tx" href="#sub">
            <span className="id">#087</span>
            <span className="ttl">The quiet death of the password<em>why the thing you&apos;ve typed 10,000 times is finally going away</em></span>
            <span className="date">JUN 08 2026</span>
            <span className="arrow">→</span>
          </a>
          <a className="tx" href="#sub">
            <span className="id">#086</span>
            <span className="ttl">Who actually owns your face<em>the unregulated market for the geometry of your head</em></span>
            <span className="date">JUN 01 2026</span>
            <span className="arrow">→</span>
          </a>
          <a className="tx" href="#sub">
            <span className="id">#085</span>
            <span className="ttl">The algorithms that price everything<em>surge pricing came for groceries while you weren&apos;t looking</em></span>
            <span className="date">MAY 25 2026</span>
            <span className="arrow">→</span>
          </a>
          <a className="tx" href="#sub">
            <span className="id">#084</span>
            <span className="ttl">The internet&apos;s load-bearing volunteers<em>the unpaid maintainers holding up half the modern web</em></span>
            <span className="date">MAY 18 2026</span>
            <span className="arrow">→</span>
          </a>
        </div>
      </section>

      <section className="wrap">
        <div className="sec-head">
          <span className="sec-num">[03]</span>
          <h2 className="sec-title" data-decode>Status report</h2>
          <span className="sec-rule"></span>
        </div>
        <div className="readouts">
          <div className="readout">
            <div className="num" data-count="42173">0</div>
            <div className="lbl">Readers online</div>
          </div>
          <div className="readout">
            <div className="num" data-count="87">0</div>
            <div className="lbl">Transmissions sent</div>
          </div>
          <div className="readout">
            <div className="num" data-count="68" data-suffix="%">0</div>
            <div className="lbl">Open rate</div>
          </div>
        </div>
      </section>

      <section className="wrap" id="sub">
        <div className="closer">
          <h2 data-decode>Stop reading the <span className="lit">noise</span>.</h2>
          <p>Join 42,000 readers who get the week decoded, every Sunday morning, in about a four-minute read.</p>
          <div className="field">
            <span className="prompt">$</span>
            <input id="email2" type="email" inputMode="email" placeholder="you@domain.net" aria-label="Email address" />
            <button 
              className="jack" 
              id="jack2" 
              onClick={(e) => handleSubscribe(e, 2)}
              disabled={btnDisabled2}
            >
              {btnText2}
            </button>
          </div>
          <div className="status" id="status2" role="status" aria-live="polite">{status2}</div>
        </div>
      </section>

      <footer className="wrap">
        <div className="foot">
          <div>© 2026 MATRIX NEWSLETTER · matrixnewsletter.com</div>
          <div className="links">
            <a href="#sub">Subscribe</a>
            <a href="#">Archive</a>
            <a href="#">Privacy</a>
            <a href="#">RSS</a>
          </div>
        </div>
      </footer>
    </>
  );
}
