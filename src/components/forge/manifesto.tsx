"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TICKER =
  "PROMPTS ARE VOLATILE SCRIPTS ✦ SKILLS ARE ENDURING INFRASTRUCTURE ✦ 40 CONTRACT-GOVERNED MODULES ✦ GOVERNED SELF-EVOLUTION ✦ ZERO RUNTIME DEPENDENCIES ✦ ";

/* hot words ignite in crimson as the scrub passes them */
const WORDS: { w: string; hot?: boolean }[] = (
  "Most agents don't fail at LinkedIn execution because they lack intelligence. They fail because prompts conflate reasoning with API mechanics — volatile strings that rot, drift, and hallucinate with every model update."
).split(" ").map((w) => ({
  w,
  hot: ["fail", "volatile", "rot,", "drift,", "hallucinate"].includes(w),
}));

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ONE pinned timeline drives the word-scrub AND the spark — a separate
           trigger on a pinned element can be mis-measured after refresh (same
           root cause as the hero scroll-up bug) */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-manifesto-pin]",
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 0.4,
            onUpdate: (self) => {
              if (self.progress <= 0.001) {
                gsap.set("[data-word]", { opacity: 0.14, y: 6 });
                gsap.set("[data-spark]", { scale: 0 });
              }
            },
            onLeaveBack: () => {
              gsap.set("[data-word]", { opacity: 0.14, y: 6 });
              gsap.set("[data-spark]", { scale: 0 });
            },
          },
        });

        /* word-by-word scrub fill — explicit from keeps the mapping exact
           even if a refresh fires while the user is scrolled mid-way */
        tl.fromTo(
          "[data-word]",
          { opacity: 0.14, y: 6 },
          { opacity: 1, y: 0, stagger: 0.6, duration: 0.5, immediateRender: false },
          0
        );
        /* ember dot chases the reveal across the full range */
        tl.fromTo("[data-spark]", { scale: 0 }, { scale: 1, duration: tl.duration() }, 0);

        /* punchline */
        gsap.from("[data-punch]", {
          opacity: 0,
          y: 40,
          rotate: -2,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-punch]", start: "top 85%" },
        });

        /* ticker strips shear with scroll velocity — the press rolls faster
           when you push it, then settles back square as motion stops */
        const strips = gsap.utils.toArray<HTMLElement>("[data-ticker-strip]");
        if (strips.length) {
          const setters = strips.map((s) => gsap.quickSetter(s, "skewX", "deg"));
          const clampV = gsap.utils.clamp(-6, 6);
          const proxy = { skew: 0 };
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate(self) {
              const v = clampV(self.getVelocity() / 260);
              gsap.to(proxy, {
                skew: v,
                duration: 0.25,
                ease: "power1.out",
                overwrite: "auto",
                onUpdate: () => setters.forEach((set) => set(proxy.skew)),
              });
            },
          });
        }
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative">
      {/* ══ crossing ticker strips ══ */}
      <div className="relative overflow-hidden py-14 sm:py-20 w-full" aria-hidden>
        <div
          data-ticker-strip
          className="w-[120%] -ml-[10%] border-y py-4 will-change-transform sm:py-5"
          style={{
            background: "#191410",
            transform: "rotate(-2deg)",
            borderColor: "#191410",
          }}
        >
          <div className="marquee-track" style={{ "--marquee-dur": "36s" } as React.CSSProperties}>
            {[0, 1].map((n) => (
              <span
                key={n}
                className="whitespace-nowrap pr-4 font-mono text-sm font-bold tracking-[0.28em] sm:text-base"
                style={{ color: "#f7f2ea" }}
              >
                {TICKER}
              </span>
            ))}
          </div>
        </div>
        <div
          data-ticker-strip
          className="w-[120%] -ml-[10%] -mt-8 border-y py-4 will-change-transform sm:py-5"
          style={{
            background: "#c8102e",
            transform: "rotate(1.4deg)",
            borderColor: "#c8102e",
          }}
        >
          <div
            className="marquee-track reverse"
            style={{ "--marquee-dur": "42s" } as React.CSSProperties}
          >
            {[0, 1].map((n) => (
              <span
                key={n}
                className="whitespace-nowrap pr-4 font-mono text-sm font-bold tracking-[0.28em] sm:text-base"
                style={{ color: "#ffffff" }}
              >
                {TICKER}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ pinned manifesto ══ */}
      <div data-manifesto-pin className="dotgrid relative flex min-h-svh items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-10">
          <div className="mono-label mb-10 flex items-center gap-4" style={{ color: "#c8102e" }}>
            <span>01 / The Manifesto</span>
            <span className="h-px flex-1" style={{ background: "#d9cdbc" }} />
            <span style={{ color: "#7a6f61" }}>why skillforge exists</span>
          </div>

          <h2 className="sr-only">
            The Manifesto — Why Prompts Are Volatile Scripts and Skills Are Enduring Infrastructure
          </h2>

          <p
            className="font-display text-[clamp(1.8rem,4.6vw,3.6rem)] font-medium leading-[1.18] tracking-tight"
            aria-label={WORDS.map((x) => x.w).join(" ")}
          >
            {WORDS.map((x, i) => (
              <span
                key={i}
                data-word
                aria-hidden
                className="inline-block will-change-transform"
                style={{
                  opacity: 0.14,
                  transform: "translateY(6px)",
                  color: x.hot ? "#c8102e" : undefined,
                }}
              >
                {x.w}
                {"\u00A0"}
              </span>
            ))}
          </p>

          <div className="mt-12 flex items-center gap-4">
            <span
              data-spark
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: "#c8102e" }}
            />
            <p
              data-punch
              className="font-display text-2xl font-semibold italic sm:text-3xl"
              style={{ color: "#c8102e" }}
            >
              SkillForge decouples the two — forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
