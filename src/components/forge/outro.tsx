"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REPO_URL, PI_LAB_URL, PI_LAB_LINKEDIN_URL, FOUNDER_LINKEDIN_URL } from "./data";
import { Magnetic } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { cmd: "git clone https://github.com/the-pi-lab/linkedin-skillforge.git", note: "grab the forge" },
  { cmd: "python -m unittest discover -s tests", note: "verify integrity" },
  { cmd: "python ide/install.py install --skill cold-messaging --ide auto --apply", note: "forge a skill" },
];

export function Outro() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState<number | null>(null);

  /* one-shot clipboard write with a graceful fallback */
  const copyCmd = async (i: number, cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = cmd;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(i);
    window.setTimeout(() => setCopied((c) => (c === i ? null : c)), 1600);
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-cta-title] > *", {
        y: 60,
        opacity: 0,
        rotate: 1.4,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-cta-title]", start: "top 80%" },
      });
      const isMobile = window.innerWidth < 768;
      gsap.fromTo(
        "[data-step]",
        {
          x: isMobile ? 0 : -50,
          y: isMobile ? 24 : 0,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.65,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: "[data-steps]", start: "top 80%" },
        }
      );
      gsap.fromTo(
        "[data-cta-actions] > *",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.55,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: "[data-cta-actions]", start: "top 88%" },
        }
      );

      /* giant wordmark fills from the bottom as you scroll to the end */
      gsap.fromTo(
        "[data-wordmark-fill]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-footer]",
            start: "top 80%",
            end: "bottom bottom",
            scrub: 0.4,
          },
        }
      );
      gsap.from("[data-foot-meta]", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-footer]", start: "top 55%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden" style={{ background: "#f7f2ea" }}>
      {/* ══ quickstart CTA ══ */}
      <div className="dotgrid py-28 sm:py-36">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div data-cta-title>
              <div className="mono-label mb-5 flex items-center gap-3" style={{ color: "#c8102e" }}>
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#c8102e" }} />
                10 / Quickstart · 60 seconds
              </div>
              <h2
                className="font-display font-semibold leading-[0.98] tracking-tight"
                style={{ fontSize: "clamp(2.6rem,6vw,4.8rem)" }}
              >
                Forge your
                <br />
                first skill
                <em className="italic text-ember"> tonight</em>.
              </h2>
            </div>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-soot">
              No heavyweight frameworks. No node dependency hell. Pure Python
              stdlib, two passing test suites, and forty skills waiting to be
              dropped into your agent.
            </p>

            <div data-cta-actions className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic href={REPO_URL} variant="solid">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
                Star on GitHub
              </Magnetic>
              <Magnetic href={`${REPO_URL}/blob/main/README.md`} variant="ghost">
                Read the docs ↗
              </Magnetic>
              <Magnetic href={PI_LAB_URL} variant="ink">
                Visit The Π Lab ↗
              </Magnetic>
            </div>
          </div>

          {/* steps card — click a command to copy it */}
          <div
            data-steps
            className="card-line flex flex-col gap-0 overflow-hidden"
          >
            {STEPS.map((s, i) => (
              <div
                key={s.cmd}
                data-step
                className="group/step flex flex-col gap-1.5 px-6 py-5 sm:px-7"
                style={{
                  borderTop: i === 0 ? "none" : "1px dashed #d9cdbc",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-[0.65rem] font-bold"
                    style={{ background: i === 2 ? "#c8102e" : "#191410", color: "#f7f2ea" }}
                  >
                    {i + 1}
                  </span>
                  <span className="mono-label" style={{ color: "#7a6f61" }}>
                    {s.note}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCmd(i, s.cmd)}
                    className="ml-auto cursor-pointer rounded-md px-2.5 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] transition-colors"
                    style={{
                      background: copied === i ? "#c8102e" : "transparent",
                      color: copied === i ? "#ffffff" : "#7a6f61",
                      border: `1px solid ${copied === i ? "#c8102e" : "#d9cdbc"}`,
                    }}
                    aria-label={`Copy command: ${s.cmd}`}
                  >
                    {copied === i ? "copied ✓" : "copy"}
                  </button>
                </div>
                <code
                  className="break-all pl-9 font-mono text-[0.78rem] leading-relaxed"
                  style={{ color: "#191410" }}
                >
                  <span style={{ color: "#c8102e" }}>$ </span>
                  {s.cmd}
                </code>
              </div>
            ))}
            <div
              className="flex items-center gap-3 px-6 py-4 font-mono text-[0.72rem]"
              style={{ background: "#efe8dd", color: "#7a6f61", borderTop: "1px dashed #d9cdbc" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#191410" }} />
              Ran 2 tests in 0.803s — OK · all 40 skills conform to SKILL_SPEC §12
            </div>
          </div>
        </div>
      </div>

      {/* ══ footer ══ */}
      <footer data-footer className="relative overflow-hidden pt-20" style={{ background: "#efe8dd" }}>
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
          <div data-foot-meta className="grid gap-10 pb-16 md:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr]">
            <div>
              <p className="font-display text-2xl font-medium italic leading-snug" style={{ color: "#191410" }}>
                &quot;Reason better. Compose freely.
                <br />
                Evolve responsibly.&quot;
              </p>
              <p className="mt-4 font-mono text-[0.72rem] tracking-[0.14em]" style={{ color: "#7a6f61" }}>
                ENGINEERED WITH PRECISION BY THE PI LAB
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="mono-label" style={{ color: "#c8102e" }}>
                The Π Lab
              </span>
              <a href={PI_LAB_URL} target="_blank" rel="noreferrer" className="link-draw w-fit text-sm text-soot transition-colors hover:text-ember">
                🌐 thepilab.in
              </a>
              <a href={PI_LAB_LINKEDIN_URL} target="_blank" rel="noreferrer" className="link-draw w-fit text-sm text-soot transition-colors hover:text-ember">
                💼 The Π Lab on LinkedIn
              </a>
              <a href={FOUNDER_LINKEDIN_URL} target="_blank" rel="noreferrer" className="link-draw w-fit text-sm text-soot transition-colors hover:text-ember">
                ✉️ Founder — Vinayak Mahavar
              </a>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="mono-label" style={{ color: "#c8102e" }}>
                Repository
              </span>
              <a href={REPO_URL} target="_blank" rel="noreferrer" className="link-draw w-fit text-sm text-soot transition-colors hover:text-ember">
                github.com/the-pi-lab/linkedin-skillforge
              </a>
              <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer" className="link-draw w-fit text-sm text-soot transition-colors hover:text-ember">
                Contributing guide
              </a>
              <a href={`${REPO_URL}/blob/main/SECURITY.md`} target="_blank" rel="noreferrer" className="link-draw w-fit text-sm text-soot transition-colors hover:text-ember">
                Security &amp; compliance
              </a>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="mono-label" style={{ color: "#c8102e" }}>
                The stack
              </span>
              <span className="text-sm text-soot">40 skills · 27-section contract</span>
              <span className="text-sm text-soot">Draft 2020-12 schemas</span>
              <span className="text-sm text-soot">Zero runtime dependencies</span>
            </div>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="relative select-none overflow-hidden" aria-hidden>
          <div
            className="font-display text-center font-black leading-[0.78] tracking-tight text-outline"
            style={{ fontSize: "clamp(2.2rem, 12.2vw, 15rem)", whiteSpace: "nowrap" }}
          >
            SKILLFORGE
          </div>
          <div
            data-wordmark-fill
            className="font-display absolute inset-0 text-center font-black leading-[0.78] tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 12.2vw, 15rem)", whiteSpace: "nowrap", color: "#c8102e" }}
          >
            SKILLFORGE
          </div>
        </div>

        <div className="border-t" style={{ borderColor: "#d9cdbc" }}>
          <div
            className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 font-mono text-[0.65rem] tracking-[0.16em] sm:flex-row sm:px-10"
            style={{ color: "#7a6f61" }}
          >
            <span>
              © 2026{' '}
              <a href={PI_LAB_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-ember">
                THE PI LAB
              </a>{' '}
              · MIT LICENSE
            </span>
            <span>BUILT IN THE OPEN · FAILS CLOSED · NEVER SPAMS</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
