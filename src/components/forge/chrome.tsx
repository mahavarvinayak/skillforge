"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REPO_URL } from "./data";
import { Magnetic } from "./ui";

gsap.registerPlugin(ScrollTrigger);

/* ══════════ PRELOADER ══════════ */
const BOOT_LINES = [
  "warming the embers",
  "calibrating 40 skills",
  "checking schema gates · draft 2020-12",
  "registry: 10 ide hosts online",
  "evolution loop healthy",
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [line, setLine] = useState(BOOT_LINES[0]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => onDone(),
    });
    tl.to(counter, {
      v: 100,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.v);
        setPct(v);
        setLine(BOOT_LINES[Math.min(BOOT_LINES.length - 1, Math.floor((v / 100) * BOOT_LINES.length))]);
      },
    })
      .to("[data-boot-fade]", { opacity: 0, y: -24, duration: 0.45, ease: "power2.in" })
      /* two-layer curtain: paper panel lifts, a crimson edge chases it
         out 120ms later — the reveal reads as one continuous wipe */
      .to(el, { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, "+=0.02")
      .to("[data-boot-accent]", { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, "<0.12")
      .set([el, "[data-boot-accent]"], { display: "none" });
    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <>
      {/* crimson chase panel — sits beneath the paper, follows it out */}
      <div
        data-boot-accent
        className="fixed inset-0 z-[99]"
        style={{ background: "#c8102e" }}
        aria-hidden
      />
      <div
        ref={root}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        style={{ background: "#ffffff" }}
        aria-hidden
      >
        <div data-boot-fade className="flex flex-col items-center gap-6 px-6 text-center">
          <div className="mono-label" style={{ color: "#c8102e" }}>
            PI SKILLFORGE
          </div>
          <div
            className="font-display font-bold leading-none tabular-nums"
            style={{ color: "#191410", fontSize: "clamp(4rem, 14vw, 9rem)" }}
          >
            {pct}
            <span style={{ color: "#c8102e" }}>%</span>
          </div>
          <div className="h-px w-56 overflow-hidden" style={{ background: "rgba(25,20,16,0.12)" }}>
            <div
              className="h-full origin-left"
              style={{ background: "#c8102e", transform: `scaleX(${pct / 100})` }}
            />
          </div>
          <div className="font-mono text-xs tracking-widest" style={{ color: "#7a6f61" }}>
            {line}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════ NAV + PROGRESS ══════════ */
export function Nav({ visible }: { visible: boolean }) {
  const bar = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);

  /* progress fill runs from mount; entrance is owned by `visible` below */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  /* entrance: plays once the preloader curtain lifts */
  useEffect(() => {
    if (!visible || !nav.current) return;
    const tween = gsap.fromTo(
      nav.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, delay: 0.25, ease: "power3.out" }
    );
    return () => {
      tween.kill();
    };
  }, [visible]);

  /* choreography: glass backdrop after leaving the very top +
     hide on scroll down / reveal on scroll up (desktop ritual).
     Only armed after the entrance finishes so quickTo never
     fights the intro tween over `y`. */
  useEffect(() => {
    const el = nav.current;
    if (!visible || !el) return;
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let intro = true;
    const t = setTimeout(() => {
      intro = false;
    }, 1300);
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const y = self.scroll();
        el.classList.toggle("nav-scrolled", y > 32);
        if (intro) return;
        yTo(y < 140 || self.direction === -1 ? 0 : -110);
      },
    });
    return () => {
      clearTimeout(t);
      st.kill();
    };
  }, [visible]);

  /* route the logo through Lenis so a bottom-of-page click glides home
     instead of hard-jumping (native anchor jumps can desync scrub) */
  const onLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        ref={nav}
        className="fixed inset-x-0 top-0 z-[80] flex items-center justify-between px-5 py-4 transition-colors sm:px-10"
        style={{ opacity: 0, transform: "translateY(-80px)" }}
      >
        <a href="#top" onClick={onLogoClick} className="flex items-center gap-3">
          <PiMark className="h-8 w-8 shrink-0" />
          <span className="hidden whitespace-nowrap font-mono text-[0.78rem] font-bold tracking-[0.2em] sm:inline">
            PI&nbsp;SKILLFORGE
          </span>
        </a>
        <div className="flex items-center gap-3">
          <a
            href="https://www.thepilab.in"
            target="_blank"
            rel="noreferrer"
            className="mono-label link-draw hidden transition-colors hover:text-[#c8102e] md:inline"
            style={{ color: "#7a6f61" }}
          >
            by The Π Lab ↗
          </a>
          <span className="mono-label hidden md:inline" style={{ color: "#a39682" }}>
            v1.0.0 · MIT
          </span>
          <Magnetic href={REPO_URL} variant="solid" className="!px-5 !py-2.5">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            Star the repo
          </Magnetic>
        </div>
      </header>
      {/* scroll progress — visible hairline track + crimson fill */}
      <div
        className="fixed inset-x-0 top-0 z-[85] h-[3px]"
        style={{ background: "rgba(25, 20, 16, 0.08)" }}
      >
        <div
          ref={bar}
          className="h-full w-full origin-left"
          style={{ background: "#c8102e", transform: "scaleX(0)" }}
        />
      </div>
    </>
  );
}

/* ── π logo mark — The Π Lab ── */
export function PiMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect x="3" y="3" width="34" height="34" rx="10" fill="#c8102e" />
      <text
        x="20"
        y="27.5"
        textAnchor="middle"
        fontSize="21"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="var(--font-fraunces), Georgia, serif"
      >
        π
      </text>
    </svg>
  );
}
