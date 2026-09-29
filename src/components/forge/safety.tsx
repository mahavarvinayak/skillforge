"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SAFETY_ALWAYS, SAFETY_NEVER } from "./data";
import { SectionHead } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 40, suffix: "", label: "production skills" },
  { value: 10, suffix: "", label: "capability domains" },
  { value: 10, suffix: "+", label: "supported IDEs" },
  { value: 0, suffix: "", label: "runtime dependencies" },
  { value: 100, suffix: "%", label: "portable · MIT licensed" },
];

export function Safety() {
  const root = useRef<HTMLElement>(null);
  const [statsOn, setStatsOn] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-safe-col=always]", {
        x: -90,
        opacity: 0,
        rotate: -2,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-safe-grid]", start: "top 78%" },
      });
      gsap.from("[data-safe-col=never]", {
        x: 90,
        opacity: 0,
        rotate: 2,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-safe-grid]", start: "top 78%" },
      });

      /* the stamp SLAMS in */
      gsap.from("[data-safe-stamp]", {
        scale: 3.2,
        opacity: 0,
        rotation: 24,
        duration: 0.55,
        ease: "power4.in",
        scrollTrigger: { trigger: "[data-safe-stamp]", start: "top 80%" },
      });
      /* ring shock after slam */
      gsap.fromTo(
        "[data-safe-shock]",
        { scale: 0.4, opacity: 0.7 },
        {
          scale: 1.6,
          opacity: 0,
          duration: 0.7,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: "[data-safe-stamp]", start: "top 80%" },
        }
      );

      gsap.from("[data-stat]", {
        y: 50,
        opacity: 0,
        stagger: 0.09,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-stats]", start: "top 82%", onEnter: () => setStatsOn(true) },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative">
      {/* ── safety ── */}
      <div className="py-28 sm:py-36" style={{ background: "#efe8dd" }}>
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
          <SectionHead
            eyebrow="08 / Enterprise Safety"
            title={
              <>
                Compliance isn&apos;t a feature.
                <br />
                It&apos;s the <em className="italic text-ember">foundation</em>.
              </>
            }
          />

          <div data-safe-grid className="mt-16 grid gap-6 lg:grid-cols-2">
            <div
              data-safe-col="always"
              className="card-line p-7 sm:p-9"
              style={{ borderTop: "4px solid #191410" }}
            >
              <div className="mono-label" style={{ color: "#191410" }}>
                Always
              </div>
              <ul className="mt-6 flex flex-col gap-4">
                {SAFETY_ALWAYS.map((x, i) => (
                  <li key={x} className="flex items-start gap-3">
                    <span
                      className="icon-pop mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "#191410", animationDelay: `${0.15 + i * 0.09}s` }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden>
                        <path d="M1 4l2.5 2.5L9 1" stroke="#f7f2ea" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-soot">{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-safe-col="never"
              className="card-line p-7 sm:p-9"
              style={{ borderTop: "4px solid #8d0f21" }}
            >
              <div className="mono-label" style={{ color: "#8d0f21" }}>
                Never — hard-rejected
              </div>
              <ul className="mt-6 flex flex-col gap-4">
                {SAFETY_NEVER.map((x, i) => (
                  <li key={x} className="flex items-start gap-3">
                    <span
                      className="icon-pop mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "#8d0f21", animationDelay: `${0.15 + i * 0.09}s` }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
                        <path d="M1 1l6 6M7 1L1 7" stroke="#f7f2ea" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-soot">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex items-center justify-center gap-8">
            <span className="hidden h-px flex-1 sm:block" style={{ background: "#d9cdbc" }} />
            <div className="relative">
              <span
                data-safe-shock
                className="absolute inset-0 -m-6 rounded-2xl border-2"
                style={{ borderColor: "#8d0f21", opacity: 0 }}
                aria-hidden
              />
              <span data-safe-stamp className="stamp inline-block text-center text-xl sm:text-2xl">
                Fail closed
              </span>
            </div>
            <span className="hidden h-px flex-1 sm:block" style={{ background: "#d9cdbc" }} />
          </div>
        </div>
      </div>

      {/* ── stats band ── */}
      <div data-stats className="py-20" style={{ background: "#c8102e" }}>
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-12 px-5 sm:px-10 md:grid-cols-5 md:gap-x-0">
          {STATS.map((s) => (
            <div
              key={s.label}
              data-stat
              className="flex flex-col items-center gap-3 text-center md:border-l md:border-white/15 md:px-2 md:first:border-l-0"
            >
              <Counter to={s.value} suffix={s.suffix} on={statsOn} />
              <span
                className="font-mono text-[0.62rem] uppercase tracking-[0.22em]"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ to, suffix, on }: { to: number; suffix: string; on: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return;
    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: to,
      duration: 1.6,
      ease: "power3.out",
      onUpdate: () => setV(Math.round(state.v)),
    });
    return () => {
      tween.kill();
    };
  }, [on, to]);
  return (
    <span
      className="font-display font-black tabular-nums leading-none"
      style={{ fontSize: "clamp(3rem, 6vw, 4.6rem)", color: "#ffffff" }}
    >
      {v}
      <span style={{ color: "#f2dfe2" }}>{suffix}</span>
    </span>
  );
}
