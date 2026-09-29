"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHead } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const PROBLEMS = [
  {
    code: "PROMPT_ROT",
    title: "Volatile strings",
    body: "Copy-pasted prompts mutate across chats and repos until nobody knows which version actually worked — knowledge with no home.",
    from: { x: -220, y: 90, r: -9 },
  },
  {
    code: "SILENT_DRIFT",
    title: "Model upgrades break flows",
    body: "A new model version ships and workflows quietly degrade overnight. No diff to review, no test to catch it, no rollback to trust.",
    from: { x: 240, y: -70, r: 7 },
  },
  {
    code: "HALLUCINATED_ACTIONS",
    title: "Invented capabilities",
    body: "Agents improvise tool behavior that doesn't exist — then act on the fiction. Mission-critical pipelines shatter in silence.",
    from: { x: -180, y: -110, r: 6 },
  },
  {
    code: "API_CHAOS",
    title: "Reasoning fused to plumbing",
    body: "When thinking and execution share one blob of text, changing your LLM means rewriting your LinkedIn logic from scratch.",
    from: { x: 200, y: 120, r: -6 },
  },
];

export function Problem() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      /* phones get proportionally shorter flight paths */
      const shrink = () => (window.innerWidth < 640 ? 0.45 : 1);

      gsap.utils.toArray<HTMLElement>("[data-pcard]").forEach((card, i) => {
        const p = PROBLEMS[i % PROBLEMS.length].from;
        /* entrance owns x / rotation / opacity … */
        gsap.from(card, {
          x: () => p.x * shrink(),
          rotation: p.r,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
        /* … while the scroll scrub owns y only — no shared props, so the
           tweens can never fight when the user scrolls back up */
        gsap.fromTo(
          card,
          { y: 0 },
          {
            y: (i + 1) % 2 === 0 ? -46 : 42,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 60%",
              end: "bottom 30%",
              scrub: 0.6,
              onLeaveBack: () => gsap.set(card, { y: 0 }),
            },
          }
        );
      });

      gsap.from("[data-problem-note]", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: "[data-problem-note]", start: "top 90%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-cream py-28 sm:py-36">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead
            eyebrow="02 / The Rot"
            title={
              <>
                Your agent doesn&apos;t have a
                <br />
                knowledge problem. It has a{" "}
                <em className="italic text-ember">structure</em> problem.
              </>
            }
          />
          <p className="max-w-sm text-base leading-relaxed text-soot">
            Four failure modes doom every prompt-driven LinkedIn workflow.
            SkillForge was forged to kill each one at the root.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p, i) => (
            <article
              key={p.code}
              data-pcard
              className="card-line group relative flex flex-col gap-4 p-6 transition-[border-color,box-shadow] duration-300 will-change-transform hover:border-[#c8102e] hover:shadow-[0_24px_50px_-28px_rgba(200,16,46,0.35)]"
              style={{ marginTop: i % 2 === 1 ? "2.5rem" : 0 }}
            >
              <span
                className="mono-label"
                style={{ color: "#8d0f21" }}
              >
                {p.code}
              </span>
              <h3 className="font-display text-xl font-semibold leading-snug">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-soot">{p.body}</p>
              <span
                className="absolute right-5 top-5 font-display text-4xl font-black transition-colors duration-300 group-hover:text-[#e77c90]"
                style={{ color: "#e2d8c8" }}
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>

        <div data-problem-note className="mt-16 h-px w-full" style={{ background: "#d9cdbc" }} />
        <p className="mono-label mt-6 text-center" style={{ color: "#7a6f61" }}>
          Sound familiar? Keep scrolling — the fix is a forge away.
        </p>
      </div>
    </section>
  );
}
