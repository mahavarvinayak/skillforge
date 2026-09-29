/* ── Hero canvas: scroll-reactive crimson spark field on bone paper.
      Adds gentle pointer parallax on fine-pointer devices, freezes to a
      single still frame under prefers-reduced-motion, and pauses when
      scrolled away. The old revolving icosahedron lattice stays gone. ── */

export interface ForgeCoreHandle {
  setScroll: (p: number) => void; // 0..1 hero scroll progress
  setPointer: (x: number, y: number) => void; // -0.5..0.5 viewport-normalised
  destroy: () => void;
}

export function createForgeCore(
  canvas: HTMLCanvasElement,
  opts: { mobile: boolean; reduced?: boolean }
): ForgeCoreHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { setScroll: () => {}, setPointer: () => {}, destroy: () => {} };
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let w = 0;
  let h = 0;
  let raf = 0;
  let running = false;
  let scrollP = 0;
  let px = 0; // smoothed pointer offset
  let py = 0;
  let tx = 0;
  let ty = 0;
  const t0 = performance.now();

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  /* motes — deterministic pseudo-random so every load matches */
  const MOTE_N = opts.mobile ? 22 : 54;
  interface Mote {
    x: number;
    y: number;
    r: number;
    vy: number;
    vx: number;
    depth: number;
    a: number;
    flick: number;
    h: number;
    s: number;
    l: number;
  }
  const motes: Mote[] = [];
  for (let i = 0; i < MOTE_N; i++) {
    const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const rnd = s - Math.floor(s);
    const s2 = Math.sin(i * 269.5 + 183.3) * 24634.6345;
    const rnd2 = s2 - Math.floor(s2);
    const isCrimson = rnd > 0.34;
    motes.push({
      x: rnd,
      y: rnd2,
      r: 1.1 + ((rnd * 7) % 2.2),
      vy: 0.04 + ((rnd2 * 13) % 0.07),
      vx: (rnd - 0.5) * 0.016,
      depth: 0.35 + ((rnd2 * 11) % 0.65),
      a: 0.16 + ((rnd2 * 5) % 0.34),
      flick: 2 + rnd2 * 5,
      // crimson sparks + a few warm graphite neutrals
      h: isCrimson ? 349 + ((rnd2 * 8) % 6) : 26,
      s: isCrimson ? 76 : 18,
      l: isCrimson ? 48 : 38,
    });
  }

  const wrap = (v: number) => ((v % 1.1) + 1.1) % 1.1;

  const paint = (t: number) => {
    ctx.clearRect(0, 0, w, h);
    for (const e of motes) {
      /* pointer parallax — nearer motes lean toward the cursor */
      const parX = (e.x * w) + px * 34 * e.depth;
      const parYRaw = e.y - scrollP * 0.22 * e.depth;
      const parY = wrap(parYRaw) * h - 0.05 * h + py * 22 * e.depth;
      const alpha = e.a * (0.65 + 0.35 * Math.sin(t * e.flick * 2 + e.x * 10));
      const grad = ctx.createRadialGradient(parX, parY, 0, parX, parY, e.r * 3.6);
      grad.addColorStop(0, `hsla(${e.h}, ${e.s}%, ${e.l}%, ${alpha})`);
      grad.addColorStop(1, `hsla(${e.h}, ${e.s}%, ${e.l}%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(parX, parY, e.r * 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsla(${e.h}, ${Math.min(e.s + 6, 100)}%, ${e.l + 4}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(parX, parY, e.r * 0.85, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const frame = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;

    for (const e of motes) {
      e.y -= e.vy / 100;
      e.x += e.vx / 100 + Math.sin(t * e.flick + e.y * 20) * 0.0004;
      if (e.y < -0.06) {
        e.y = 1.06;
        e.x = Math.random();
      }
    }

    /* ease the pointer toward its target so parallax feels weighty */
    px += (tx - px) * 0.045;
    py += (ty - py) * 0.045;

    paint(t);
  };

  if (opts.reduced) {
    /* single still frame — no motion loop for reduced-motion users */
    paint(0);
  } else {
    running = true;
    raf = requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (opts.reduced) return; // static frame never needs the loop
      if (entries[0].isIntersecting) {
        if (!running) {
          running = true;
          raf = requestAnimationFrame(frame);
        }
      } else if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0 }
  );
  io.observe(canvas);

  return {
    setScroll(p) {
      scrollP = Math.max(0, Math.min(1, p));
      if (opts.reduced) paint(0);
    },
    setPointer(x, y) {
      tx = Math.max(-0.5, Math.min(0.5, x));
      ty = Math.max(-0.5, Math.min(0.5, y));
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    },
  };
}
