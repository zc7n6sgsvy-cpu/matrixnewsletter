'use client';

import React, { useEffect, useRef } from 'react';

interface MatrixEffectsProps {
  children: React.ReactNode;
}

export default function MatrixEffects({ children }: MatrixEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ===== MATRIX RAIN ===== */
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { alpha: true });
      if (ctx) {
        const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓ0123456789ABCDEFｦｧｨｩ$+*<>=/'.split('');
        let cols = 0;
        let drops: number[] = [];
        let fontSize = 16;
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

        if (reduce) {
          draw();
        } else {
          interval = setInterval(draw, 55);
        }

        // Cleanup
        const cleanup = () => {
          window.removeEventListener('resize', resize);
          if (interval) clearInterval(interval);
        };

        // Store for later
        (window as any).__matrixCleanup = cleanup;
      }
    }

    /* ===== BOOT CONSOLE TYPING ===== */
    const bootEl = document.getElementById('boot');
    if (bootEl) {
      const lines = [
        '> initializing matrix_newsletter ...',
        '> decrypting weekly signal ...',
        '> stripping noise ████████ 100%',
        '> connection established.',
      ];

      if (reduce) {
        bootEl.innerHTML = lines.map((l, i) => i === 3 ? `<span class="ok">${l}</span>` : l).join('\n') + '<span class="cursor"></span>';
      } else {
        let li = 0;
        let ci = 0;
        let html = '';

        const type = () => {
          if (li >= lines.length) {
            bootEl.innerHTML = html + '<span class="cursor"></span>';
            return;
          }
          const line = lines[li];
          if (ci === 0 && li === 3) html += '<span class="ok">';
          html += line[ci] || '';
          ci++;
          if (ci >= line.length) {
            if (li === 3) html += '</span>';
            html += '\n';
            li++;
            ci = 0;
            bootEl.innerHTML = html + '<span class="cursor"></span>';
            setTimeout(type, 240);
          } else {
            bootEl.innerHTML = html + '<span class="cursor"></span>';
            setTimeout(type, 22);
          }
        };
        type();
      }
    }

    /* ===== DECODE + COUNT ANIMATIONS ===== */
    if (!reduce) {
      const chars = '▓▒░01アカサ$+*<>#=/ﾊﾐﾑｦ';

      const scramble = (el: HTMLElement) => {
        const target = el.dataset.text || el.textContent || '';
        (el as any).dataset.text = target;
        const original = el.innerHTML;
        let frame = 0;
        const dur = Math.min(38, 14 + target.length);

        const iv = setInterval(() => {
          let out = '';
          for (let i = 0; i < target.length; i++) {
            if (target[i] === ' ') { out += ' '; continue; }
            out += i < frame ? target[i] : chars[Math.floor(Math.random() * chars.length)];
          }
          el.textContent = out;
          frame += target.length / dur;
          if (frame >= target.length) {
            clearInterval(iv);
            el.innerHTML = original;
          }
        }, 28);
      };

      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const target = e.target as HTMLElement;
          if (e.isIntersecting && !(target as any).dataset.done) {
            (target as any).dataset.done = '1';
            scramble(target);
            io.unobserve(target);
          }
        });
      }, { threshold: 0.6 });

      document.querySelectorAll<HTMLElement>('[data-decode]').forEach((el) => io.observe(el));

      // Count-ups
      const countIo = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting && !(el as any).dataset.run) {
            (el as any).dataset.run = '1';
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
          }
        });
      }, { threshold: 0.6 });

      document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => countIo.observe(el));
    }

    return () => {
      // basic cleanup
    };
  }, []);

  return (
    <>
      <canvas id="rain" ref={canvasRef} className="fixed inset-0 z-0 opacity-[0.42]" />
      <div className="grid-overlay" />
      <div className="vignette" />
      <div className="scanlines" />
      {children}
    </>
  );
}
