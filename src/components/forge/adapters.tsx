"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CAPABILITIES } from "./data";
import { SectionHead } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const ADAPTERS = [
  { name: "Official LinkedIn API", tag: "compliant channel", note: "First-party, ToS-safe execution." },
  { name: "CRM Webhook", tag: "HubSpot · Salesforce", note: "Leads sync straight into your pipeline." },
  { name: "Headless Browser", tag: "local runtime", note: "Your own operator-supplied tooling." },
];

export function Adapters() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-adp-skill]", {
        scale: 0.7,
        opacity: 0,
        rotate: -3,
        duration: 0.8,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: "[data-adp-skill]", start: "top 78%" },
      });
      gsap.from("[data-adp-line]", {
        scaleX: 0,
        transformOrigin: "top",
        duration: 0.9,
        stagger: 0.15,
        ease: "power2.inOut",
        scrollTrigger: { trigger: "[data-adp-lines]", start: "top 60%" },
      });
      gsap.from("[data-adp-card]", {
        y: 70,
        opacity: 0,
        rotate: (i) => [-2, 1.5, -1][i % 3],
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-adp-cards]", start: "top 78%" },
      });
      gsap.from("[data-adp-cap]", {
        y: 18,
        opacity: 0,
        stagger: 0.045,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-adp-caps]", start: "top 85%" },
      });
      gsap.from("[data-adp-fallback]", {
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-adp-fallback]", start: "top 85%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative py-28 sm:py-36" style={{ background: "#efe8dd" }}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
        <SectionHead
          eyebrow="06 / The Adapter Boundary"
          title={
            <>
              Skills <em className="italic text-ember">think</em>.
              <br />
              Adapters <em className="italic text-ember">act</em>.
            </>
          }
        />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-soot">
          A skill never touches an API directly. It declares abstract
          capabilities — and the adapter layer supplies the muscle. Credentials
          absent? The skill gracefully degrades instead of hallucinating.
        </p>

        {/* skill node */}
        <div className="mt-16 flex justify-center">
          <div
            data-adp-skill
            className="w-full max-w-md rounded-2xl p-6 sm:p-7"
            style={{ background: "#c8102e", color: "#ffffff" }}
          >
            <div className="mono-label mb-2" style={{ color: "#f2dfe2" }}>
              Skill module — pure reasoning
            </div>
            <div className="font-display text-2xl font-semibold italic">cold-messaging</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["requires: get_profile()", "requires: send_message()"].map((r) => (
                <span
                  key={r}
                  className="rounded-lg px-3 py-1.5 font-mono text-[0.7rem]"
                  style={{ background: "rgba(255,255,255,0.16)", color: "#ffffff" }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* connector lines — each wire carries a travelling signal pulse */}
        <div data-adp-lines className="mx-auto grid h-16 max-w-4xl grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative flex justify-center">
              <div
                data-adp-line
                className="h-full w-px origin-top"
                style={{ background: "#c8102e", opacity: 0.55 }}
              />
              <span
                className="line-pulse-dot"
                style={{ animationDelay: `${i * 0.55}s` }}
                aria-hidden
              />
            </div>
          ))}
        </div>

        {/* adapter cards */}
        <div data-adp-cards className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
          {ADAPTERS.map((a) => (
            <article key={a.name} data-adp-card className="card-line p-6">
              <div className="mono-label" style={{ color: "#c8102e" }}>
                adapter
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug">{a.name}</h3>
              <div className="mt-2 font-mono text-[0.7rem]" style={{ color: "#7a6f61" }}>
                {a.tag}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-soot">{a.note}</p>
            </article>
          ))}
        </div>

        {/* capabilities */}
        <div data-adp-caps className="mx-auto mt-14 max-w-4xl">
          <div className="mono-label mb-4" style={{ color: "#7a6f61" }}>
            Abstract capability families — swappable across every adapter
          </div>
          <div className="flex flex-wrap gap-2.5">
            {CAPABILITIES.map((c) => (
              <span key={c} data-adp-cap className="chip inline-flex">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* fallback callout */}
        <div
          data-adp-fallback
          className="mx-auto mt-12 flex max-w-4xl items-start gap-4 rounded-xl p-5"
          style={{ background: "#ffffff", border: "1px dashed #c8102e" }}
        >
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold" style={{ background: "#e77c90", color: "#191410" }}>
            !
          </span>
          <p className="text-sm leading-relaxed text-soot sm:text-base">
            <span className="font-semibold text-ink">Analysis-only fallback mode:</span>{" "}
            when no physical tool is configured, the skill still delivers full
            reasoning outputs — it never fakes an action and never crashes.
          </p>
        </div>
      </div>
    </section>
  );
}
