"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHead } from "./ui";

gsap.registerPlugin(ScrollTrigger);

export function Architecture() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      /* shared choreography: intent → arrow → intelligence slab → schema
         connector → execution slab → arrow → provenance card → note */
      const steps: Array<[string, gsap.TweenVars]> = [
        ["[data-arch-intent]", { x: -120, opacity: 0, rotate: -4 }],
        ["[data-arch-arrow-1]", { scaleX: 0, transformOrigin: "left center" }],
        ["[data-arch-slab=intel]", { y: 90, opacity: 0, rotate: -1.6 }],
        ["[data-arch-connector]", { scaleY: 0, transformOrigin: "center top" }],
        ["[data-arch-slab=exec]", { y: 90, opacity: 0, rotate: 1.6 }],
        ["[data-arch-arrow-2]", { scaleX: 0, transformOrigin: "left center" }],
        ["[data-arch-json]", { x: 140, opacity: 0, rotate: 5 }],
        ["[data-arch-note]", { y: 40, opacity: 0 }],
      ];

      const mm = gsap.matchMedia();

      /* lg+: content fits one screen, so the whole assembly is pinned and
         scrubbed — the stack builds itself under the user's thumb */
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: "[data-arch-pin]",
              start: "top top",
              end: "+=220%",
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              onLeaveBack: () => {
                steps.forEach(([sel]) => {
                  gsap.set(sel, { clearProps: "transform,opacity" });
                });
              },
            },
        });
        steps.forEach(([sel, vars], i) => {
          tl.from(sel, { ...vars, duration: i === steps.length - 1 ? 1 : 1.2 }, i === 0 ? 0 : "-=0.4");
        });
      });

      /* below lg: the stack is taller than the viewport, so pinning would
         clip it. Each piece instead rises as IT enters the viewport. */
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        steps.forEach(([sel, vars]) => {
          gsap.from(sel, {
            ...vars,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: sel, start: "top 88%", once: true },
          });
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative">
      <div
        data-arch-pin
        className="relative flex min-h-svh items-center overflow-hidden py-24"
        style={{ background: "#f7f2ea" }}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          {/* ── the stack ── */}
          <div>
            <div className="mb-12">
              <SectionHead
                eyebrow="03 / The Architecture"
                title={
                  <>
                    One contract. Two layers.
                    <br />
                    <em className="italic text-ember">Zero</em> provider lock-in.
                  </>
                }
              />
            </div>

            <div className="flex flex-col">
              {/* intent */}
              <div
                data-arch-intent
                className="self-start rounded-full border px-5 py-2.5 font-mono text-[0.72rem] font-bold tracking-[0.16em]"
                style={{ borderColor: "#191410", color: "#191410", background: "#ffffff" }}
              >
                INTENT — &quot;Find VP leads &amp; send tailored outreach&quot;
              </div>

              <div
                data-arch-arrow-1
                className="my-3 h-px w-24 self-start"
                style={{ background: "#191410" }}
              />

              {/* intelligence slab */}
              <div
                data-arch-slab="intel"
                className="rounded-2xl p-6 sm:p-7"
                style={{ background: "#191410", color: "#f7f2ea" }}
              >
                <div className="mono-label mb-3" style={{ color: "#e77c90" }}>
                  Stable intelligence
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Workflow logic", "Decision trees", "Quality heuristics", "Output contracts"].map(
                    (x) => (
                      <span
                        key={x}
                        className="rounded-lg px-3 py-1.5 font-mono text-xs"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#f7f2ea" }}
                      >
                        {x}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* schema connector — the contract pulse */}
              <div data-arch-connector className="relative flex items-center gap-3 py-4 pl-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "#c8102e" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                    <path d="M5 0v10M0 5h10" stroke="#ffffff" strokeWidth="1.6" />
                  </svg>
                </span>
                <span
                  className="rounded-md px-3 py-1.5 font-mono text-[0.68rem] font-bold tracking-[0.14em]"
                  style={{
                    background: "#e77c90",
                    color: "#191410",
                    animation: "schema-pulse 2.4s ease-in-out infinite",
                  }}
                >
                  DRAFT 2020-12 JSON SCHEMA
                </span>
              </div>

              {/* execution slab */}
              <div
                data-arch-slab="exec"
                className="rounded-2xl border-2 border-dashed p-6 sm:p-7"
                style={{ borderColor: "#c8102e", background: "#ffffff" }}
              >
                <div className="mono-label mb-3" style={{ color: "#c8102e" }}>
                  Swappable execution
                </div>
                <div className="flex flex-wrap gap-2">
                  {["LinkedIn API", "HubSpot", "Salesforce", "Browser", "Claude", "Cursor", "Any DB"].map(
                    (x) => (
                      <span key={x} className="chip inline-flex">
                        {x}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div
                data-arch-arrow-2
                className="my-3 h-px w-24"
                style={{ background: "#191410" }}
              />
              <p className="font-mono text-[0.72rem] tracking-[0.16em]" style={{ color: "#7a6f61" }}>
                → Swap GPT-4o for Claude for Gemini. Your LinkedIn logic never
                changes.
              </p>
            </div>
          </div>

          {/* ── provenance card ── */}
          <div className="relative">
            <div
              data-arch-json
              className="card-line overflow-hidden will-change-transform"
              style={{ transform: "rotate(1.5deg)" }}
            >
              <div
                className="flex items-center justify-between border-b px-5 py-3"
                style={{ borderColor: "#d9cdbc", background: "#efe8dd" }}
              >
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em]">
                  provenance.json
                </span>
                <span className="flex gap-1.5" aria-hidden>
                  <i className="h-2.5 w-2.5 rounded-full" style={{ background: "#8d0f21" }} />
                  <i className="h-2.5 w-2.5 rounded-full" style={{ background: "#e77c90" }} />
                  <i className="h-2.5 w-2.5 rounded-full" style={{ background: "#191410" }} />
                </span>
              </div>
              <pre
                className="overflow-x-auto p-5 font-mono text-[0.72rem] leading-relaxed"
                style={{ color: "#191410" }}
              >
{`{
  "`}<span style={{color:"#c8102e"}}>producer_skill</span>{`":
      "linkedin.prospect-research",
  "`}<span style={{color:"#c8102e"}}>producer_version</span>{`": "1.0.0",
  "`}<span style={{color:"#c8102e"}}>confidence</span>{`": 0.94,
  "`}<span style={{color:"#c8102e"}}>gaps</span>{`": [
    "Personal email unavailable;
     verified work email attached"
  ],
  "`}<span style={{color:"#c8102e"}}>assumptions</span>{`": [
    "Lead active in current role"
  ]
}`}
              </pre>
              <div className="border-t px-5 py-3" style={{ borderColor: "#d9cdbc" }}>
                <p className="font-mono text-[0.68rem] leading-relaxed" style={{ color: "#7a6f61" }}>
                  Every skill output carries structured provenance — downstream
                  skills <span className="font-bold text-ink">never act on silent
                  uncertainty</span>.
                </p>
              </div>
            </div>

            <div
              data-arch-note
              className="mt-6 flex items-start gap-3 rounded-xl p-4"
              style={{ background: "#efe8dd" }}
            >
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: "#191410" }} />
              <p className="text-sm leading-relaxed text-soot">
                <span className="font-semibold text-ink">Context-preserving handoffs:</span>{" "}
                multi-skill chains inherit confidence, gaps and assumptions at
                every hop — like passing a notarized dossier down the line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
