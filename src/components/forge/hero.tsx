"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createForgeCore } from "./forge-core";
import { SplitChars } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const FLOAT_CHIPS = [
  { label: "prospect-research", left: "6%", top: "24%", depth: 0.55, rot: -7 },
  { label: "cold-messaging", left: "78%", top: "18%", depth: 0.9, rot: 5 },
  { label: "workflow-automation", left: "12%", top: "68%", depth: 0.8, rot: 4 },
  { label: "profile-optimization", left: "85%", top: "79%", depth: 0.45, rot: -5 },
  { label: "lead-qualification", left: "46%", top: "12%", depth: 1.1, rot: -3 },
  { label: "analytics-reporting", left: "60%", top: "82%", depth: 1.0, rot: 6 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const mobile = window.innerWidth < 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const core = createForgeCore(canvas, { mobile, reduced });

    /* pointer parallax — fine pointers only, ignites the ember field */
    let offPointer: (() => void) | null = null;
    if (!reduced && window.matchMedia("(pointer: fine)").matches) {
      const onMove = (e: PointerEvent) => {
        core.setPointer(
          e.clientX / window.innerWidth - 0.5,
          e.clientY / window.innerHeight - 0.5
        );
      };
      el.addEventListener("pointermove", onMove);
      offPointer = () => el.removeEventListener("pointermove", onMove);
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* intro: animates on mount, then unconditionally clears all transforms
           on completion so elements return to pure CSS baseline and can never
           pollute or collide with the scroll-pinned timeline below */
        const introTl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            const chars = el.querySelectorAll<HTMLElement>("[data-hero-title] [data-char]");
            if (chars.length) gsap.set(chars, { clearProps: "transform" });
            const subAndBadge = el.querySelectorAll<HTMLElement>("[data-hero-sub], [data-hero-badge]");
            if (subAndBadge.length) gsap.set(subAndBadge, { clearProps: "transform,opacity" });
            const cue = el.querySelector<HTMLElement>("[data-hero-cue]");
            if (cue) gsap.set(cue, { clearProps: "transform,opacity" });
            const eyebrow = el.querySelector<HTMLElement>("[data-hero-eyebrow]");
            if (eyebrow) gsap.set(eyebrow, { clearProps: "transform,opacity" });
            const chips = el.querySelectorAll<HTMLElement>("[data-chip]");
            if (chips.length) gsap.set(chips, { clearProps: "opacity,scale" });
          },
        });
        introTl
          .from("[data-hero-eyebrow]", { y: 24, opacity: 0, duration: 0.7 }, 0.1)
          .from(
            "[data-hero-title] [data-char]",
            { yPercent: 118, rotate: 4, duration: 1.1, stagger: 0.045, ease: "power4.out" },
            0.2
          )
          .from("[data-hero-sub]", { y: 30, opacity: 0, duration: 0.8 }, 0.75)
          .from("[data-hero-badge]", { y: 18, opacity: 0, duration: 0.5, stagger: 0.07 }, 0.9)
          .from("[data-chip]", { scale: 0.6, opacity: 0, duration: 0.7, stagger: 0.08, ease: "back.out(1.8)" }, 1.0)
          .from("[data-hero-cue]", { opacity: 0, duration: 0.8 }, 1.4);

        // If the page boots while scrolled, skip intro immediately
        if (window.scrollY > 20) {
          introTl.progress(1);
        }

        /* idle float on the chip's INNER wrapper — the outer element stays
           owned by the scroll parallax below, so the two tweens never fight
           over the same `y` (that clash used to break the hero on scroll-up) */
        gsap.utils.toArray<HTMLElement>("[data-chip-float]").forEach((float, i) => {
          gsap.to(float, {
            y: "+=12",
            rotation: "+=2.5",
            duration: 2.6 + i * 0.35,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        });

        /* helper to force pristine rest state whenever scroll is at top */
        const resetHeroAtRest = () => {
          if (!el || !document.contains(el)) return;
          const chars = el.querySelectorAll<HTMLElement>("[data-hero-title] [data-char]");
          if (chars.length) gsap.set(chars, { yPercent: 0, rotate: 0 });
          const subAndBadge = el.querySelectorAll<HTMLElement>("[data-hero-sub], [data-hero-badge]");
          if (subAndBadge.length) gsap.set(subAndBadge, { y: 0, opacity: 1 });
          const cue = el.querySelector<HTMLElement>("[data-hero-cue]");
          if (cue) gsap.set(cue, { opacity: 1 });
          const pi = el.querySelector<HTMLElement>("[data-hero-pi]");
          if (pi) gsap.set(pi, { y: 0, rotate: 0 });
          el.querySelectorAll<HTMLElement>("[data-chip]").forEach((c) => {
            gsap.set(c, {
              y: 0,
              rotation: Number(c.dataset.rot || 0),
            });
          });
        };

        /* ── scroll choreography — ONE pinned timeline drives every exit
           animation. NEVER use invalidateOnRefresh here: start values are
           constant rest coordinates (0, 0, 1) and must NEVER be corrupted
           by a refresh while scrolled! ── */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              if (self.progress > 0.005 && introTl.isActive()) {
                introTl.progress(1);
              }
              core.setScroll(self.progress);
              if (self.progress <= 0.001) {
                resetHeroAtRest();
              }
            },
            onLeave: () => core.setScroll(1),
            onLeaveBack: () => {
              core.setScroll(0);
              resetHeroAtRest();
            },
          },
        });
        core.setScroll(tl.scrollTrigger ? tl.scrollTrigger.progress : 0);

        /* title chars lift & tilt off-screen, staggered like falling type */
        tl.fromTo(
          "[data-hero-title] [data-char]",
          { yPercent: 0, rotate: 0 },
          {
            yPercent: -160,
            rotate: (i: number) => (i % 2 === 0 ? -8 : 7),
            duration: 1.16,
            stagger: { each: 0.06, from: "start" },
            immediateRender: false,
          },
          0
        );
        /* sub-copy & badges drift away, done by ~70% of the pin */
        tl.fromTo(
          "[data-hero-sub], [data-hero-badge]",
          { y: 0, opacity: 1 },
          { y: -70, opacity: 0, duration: 1.2, immediateRender: false },
          0
        );
        /* chips parallax out at depth-dependent speeds & angles */
        tl.fromTo(
          "[data-chip]",
          {
            y: 0,
            rotation: (_i, tgt) => Number(tgt.dataset.rot || 0),
          },
          {
            y: (i, tgt) =>
              (i % 2 === 0 ? -260 : -160) * Number(tgt.dataset.depth || 0.5),
            rotation: (i, tgt) =>
              Number(tgt.dataset.rot || 0) +
              (i % 2 === 0 ? 12 : -12) * Number(tgt.dataset.depth || 0.5),
            duration: 1.7,
            immediateRender: false,
          },
          0
        );
        /* scroll cue fades early */
        tl.fromTo(
          "[data-hero-cue]",
          { opacity: 1 },
          { opacity: 0, duration: 0.4, immediateRender: false },
          0
        );
        /* π watermark — slow counter-drift */
        tl.fromTo(
          "[data-hero-pi]",
          { y: 0, rotate: 0 },
          { y: -140, rotate: 6, duration: 1.7, immediateRender: false },
          0
        );
      });
    }, el);

    return () => {
      offPointer?.();
      core.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="dotgrid relative flex min-h-svh flex-col justify-center overflow-hidden"
    >
      {/* canvas core */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />

      {/* soft radial warmth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(52% 42% at 62% 50%, rgba(200,16,46,0.10), rgba(255,255,255,0) 70%)",
        }}
        aria-hidden
      />

      {/* π watermark — The Π Lab signature (replaces the old lattice) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[4%] top-1/2 z-0 hidden -translate-y-1/2 select-none md:block"
      >
        <div
          data-hero-pi
          className="font-display font-black italic leading-none will-change-transform"
          style={{
            fontSize: "clamp(20rem, 38vw, 34rem)",
            color: "transparent",
            WebkitTextStroke: "2px rgba(200,16,46,0.12)",
          }}
        >
          π
        </div>
      </div>

      {/* floating chips */}
      {FLOAT_CHIPS.map((c) => (
        <div
          key={c.label}
          data-chip
          data-depth={c.depth}
          data-rot={c.rot}
          className="chip absolute hidden md:inline-flex will-change-transform"
          style={{ left: c.left, top: c.top, transform: `rotate(${c.rot}deg)` }}
        >
          <span data-chip-float className="inline-flex items-center gap-[0.35em]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#c8102e" }} />
            {c.label}
          </span>
        </div>
      ))}

      {/* content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-10">
        <div data-hero-eyebrow className="mono-label mb-6 flex items-center gap-3" style={{ color: "#c8102e" }}>
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#c8102e" }} />
          Open Source · The PI Lab · MIT
        </div>

        <h1
          data-hero-title
          className="font-display font-black leading-[0.9] tracking-tight"
          style={{ fontSize: "clamp(3.4rem, 11.5vw, 10.5rem)" }}
        >
          <SplitChars text="SKILL" className="text-ink" />
          <SplitChars text="FORGE" className="italic text-ember" charClass="!text-ember" />
        </h1>

        <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-sub
            className="max-w-xl text-lg leading-relaxed text-soot sm:text-xl"
          >
            The modular intelligence &amp; reasoning layer for LinkedIn
            workflows — <span className="font-semibold text-ink">40
            contract-governed skills</span> that decouple{" "}
            <em className="font-display italic text-ink">what an agent thinks</em>{" "}
            from <em className="font-display italic text-ink">how it executes</em>.
          </p>

          <div data-hero-badge className="flex flex-wrap gap-2.5">
            {["40 SKILLS", "10 DOMAINS", "ZERO DEPS", "SCHEMA-GOVERNED"].map((b) => (
              <span
                key={b}
                className="rounded-full px-4 py-2 font-mono text-[0.68rem] font-bold tracking-[0.18em]"
                style={{ background: "#191410", color: "#f7f2ea" }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue — ember dash gliding down a hairline */}
      <div
        data-hero-cue
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="mono-label" style={{ color: "#7a6f61" }}>
          Scroll to forge
        </span>
        <div className="relative h-12 w-px overflow-hidden" style={{ background: "#d9cdbc" }}>
          <div className="cue-dash absolute inset-x-0 top-0 h-2/5" style={{ background: "#c8102e" }} />
        </div>
      </div>
    </section>
  );
}
