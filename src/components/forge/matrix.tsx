"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DOMAINS } from "./data";

gsap.registerPlugin(ScrollTrigger);

export function Matrix() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const getDist = () => tr.scrollWidth - window.innerWidth;

        const tween = gsap.fromTo(
          tr,
          { x: 0 },
          {
            x: () => -getDist(),
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () => `+=${getDist()}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              onUpdate: (self) => {
                const idx = Math.min(
                  DOMAINS.length - 1,
                  Math.floor(self.progress * DOMAINS.length)
                );
                setActive(idx);
                gsap.set("[data-mx-bar]", { scaleX: self.progress });
              },
              onLeaveBack: () => {
                setActive(0);
                gsap.set(tr, { x: 0 });
                gsap.set("[data-mx-bar]", { scaleX: 0 });
              },
            },
          }
        );

        /* intro panel text */
        gsap.from("[data-mx-intro] > *", {
          opacity: 0,
          y: 40,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 70%" },
        });

        return () => tween.kill();
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const current = DOMAINS[active];

  return (
    <section ref={root} className="relative overflow-hidden" style={{ background: "#efe8dd" }}>
      <div
        className="flex h-svh flex-col justify-center py-16"
        style={{
          /* cinematic entry/exit: the rail dissolves at the viewport edges */
          maskImage:
            "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <div
          ref={track}
          className="flex w-max items-stretch gap-6 px-[6vw] will-change-transform sm:gap-8"
        >
          {/* intro panel */}
          <div data-mx-intro className="flex w-[86vw] shrink-0 flex-col justify-center sm:w-[34rem] lg:w-[38rem]">
            <div className="mono-label mb-6 flex items-center gap-3" style={{ color: "#c8102e" }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#c8102e" }} />
              04 / The Catalog
            </div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tight"
              style={{ fontSize: "clamp(2.6rem, 6.5vw, 5rem)" }}
            >
              The <span className="italic text-ember">40-skill</span> matrix.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-soot">
              Ten domains spanning the complete LinkedIn operational lifecycle —
              every skill a strict 27-section contract with typed schemas,
              adversarial evals and reproducible examples.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span
                className="font-display text-6xl font-black tabular-nums sm:text-7xl"
                style={{ color: "#c8102e" }}
              >
                {current.index}
              </span>
              <span className="h-10 w-px" style={{ background: "#d9cdbc" }} />
              <div>
                <div className="font-display text-2xl font-semibold">{current.name}</div>
                <div className="mono-label" style={{ color: "#7a6f61" }}>
                  {String(DOMAINS.length).padStart(2, "0")} domains · scroll →
                </div>
              </div>
            </div>
          </div>

          {/* domain cards — the focused card rises, the rest recede */}
          {DOMAINS.map((d, i) => {
            const isActive = i === active;
            return (
              <article
                key={d.index}
                className="card-line relative flex w-[80vw] shrink-0 flex-col p-6 sm:w-[26rem] sm:p-7 lg:w-[28rem]"
                style={{
                  marginTop: i % 2 === 0 ? "0rem" : "2.75rem",
                  transform: `rotate(${i % 2 === 0 ? -0.7 : 0.7}deg) scale(${isActive ? 1.025 : 1})`,
                  opacity: isActive ? 1 : 0.72,
                  filter: isActive ? "none" : "saturate(0.85)",
                  boxShadow: isActive
                    ? "0 30px 60px -30px rgba(25,20,16,0.35)"
                    : "0 1px 0 rgba(25,20,16,0.04), 0 18px 44px -28px rgba(25,20,16,0.22)",
                  transition:
                    "transform 0.45s cubic-bezier(0.2,0.7,0.2,1), opacity 0.45s, filter 0.45s, box-shadow 0.45s",
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs font-bold" style={{ color: "#c8102e" }}>
                    {d.index}
                  </span>
                  <span className="mono-label" style={{ color: "#7a6f61" }}>
                    {d.skills.length} skills
                  </span>
                </div>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                  {d.name}
                </h3>
                <p className="mt-3 min-h-[3.5rem] text-sm leading-relaxed text-soot">
                  {d.purpose}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {d.skills.map((s) => (
                    <span key={s} className="chip inline-flex">
                      {s}
                    </span>
                  ))}
                </div>
                <div
                  className="mt-6 h-1 w-full rounded-full"
                  style={{
                    background: isActive ? "#c8102e" : "#e2d8c8",
                    transition: "background 0.4s",
                  }}
                />
              </article>
            );
          })}

          {/* outro */}
          <div className="flex w-[70vw] shrink-0 flex-col items-start justify-center sm:w-[24rem]">
            <p className="font-display text-3xl font-medium italic leading-snug" style={{ color: "#191410" }}>
              …every one drop-in ready for your IDE.
            </p>
            <span className="mono-label mt-6" style={{ color: "#7a6f61" }}>
              40 / 40 verified against SKILL_SPEC §12
            </span>
          </div>
        </div>

        {/* progress rail */}
        <div className="mx-auto mt-12 w-[86vw] max-w-3xl px-0 sm:px-4">
          <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: "#d9cdbc" }}>
            <div
              data-mx-bar
              className="h-full origin-left"
              style={{ background: "#c8102e", transform: "scaleX(0)" }}
            />
          </div>
          <div className="mt-3 hidden justify-between font-mono text-[0.65rem] tracking-[0.2em] sm:flex" style={{ color: "#7a6f61" }}>
            <span>FOUNDATION</span>
            <span>PROSPECTING</span>
            <span>OUTREACH</span>
            <span>PAID CAMPAIGNS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
