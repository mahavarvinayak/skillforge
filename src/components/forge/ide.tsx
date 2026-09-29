"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IDES } from "./data";
import { SectionHead } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const CMD = "python ide/install.py install --skill prospect-research --ide auto --apply";
const OUT = [
  "detected workspace : Claude Code",
  "destination        : .claude/skills/prospect-research",
  "SKILL.md parsed    : 27/27 sections valid",
  "schema.json        : draft 2020-12 — passed",
  "registry updated   : 10/10 ide hosts healthy",
];

export function Ide() {
  const root = useRef<HTMLElement>(null);
  const [chars, setChars] = useState(0);
  const [outN, setOutN] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      /* tiles fly in at alternating angles; clearProps afterwards so the
         CSS hover lift isn't blocked by GSAP's inline transform */
      gsap.from("[data-ide-tile]", {
        y: 80,
        opacity: 0,
        rotation: (i: number) => (i % 2 === 0 ? -4 : 4),
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: "[data-ide-grid]", start: "top 80%" },
      });

      /* terminal typing — triggered once as you reach the console */
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setChars(CMD.length);
        setOutN(OUT.length);
      } else {
        ScrollTrigger.create({
          trigger: "[data-term]",
          start: "top 75%",
          once: true,
          onEnter: () => {
            const state = { c: 0 };
            gsap.to(state, {
              c: CMD.length,
              duration: 1.6,
              ease: "none",
              onUpdate: () => setChars(Math.round(state.c)),
              onComplete: () => {
                const oState = { o: 0 };
                gsap.to(oState, {
                  o: OUT.length,
                  duration: 1.4,
                  ease: "none",
                  onUpdate: () => setOutN(Math.round(oState.o)),
                });
              },
            });
          },
        });
      }

      gsap.from("[data-term]", {
        y: 60,
        opacity: 0,
        rotate: -1.2,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-term]", start: "top 80%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative py-28 sm:py-36" style={{ background: "#f7f2ea" }}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead
            eyebrow="07 / Universal Deployment"
            title={
              <>
                Drop-in for
                <br />
                <em className="italic text-ember">every</em> environment.
              </>
            }
          />
          <p className="max-w-sm text-base leading-relaxed text-soot">
            The built-in CLI auto-detects your workspace and wires the skill
            wherever your assistant looks for it. One command, ten targets.
          </p>
        </div>

        {/* ide grid */}
        <div data-ide-grid className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {IDES.map((ide) => (
            <article
              key={ide.name}
              data-ide-tile
              className="card-line group flex flex-col gap-2 p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[#c8102e]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-semibold">{ide.name}</span>
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-[0.58rem] font-bold tracking-[0.12em] uppercase"
                  style={
                    ide.status === "Universal"
                      ? { background: "#e77c90", color: "#191410" }
                      : { background: "#efe8dd", color: "#7a6f61" }
                  }
                >
                  {ide.status}
                </span>
              </div>
              <code
                className="font-mono text-[0.68rem] transition-colors group-hover:text-ember"
                style={{ color: "#7a6f61" }}
              >
                {ide.dest}
              </code>
            </article>
          ))}
        </div>

        {/* terminal */}
        <div
          data-term
          className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl will-change-transform"
          style={{ background: "#191410", boxShadow: "0 30px 70px -30px rgba(25,20,16,0.5)" }}
        >
          <div
            className="flex items-center justify-between border-b px-5 py-3"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.14em]" style={{ color: "#e77c90" }}>
              forge@pilab ~ %
            </span>
            <span className="flex gap-1.5" aria-hidden>
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: "#8d0f21" }} />
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: "#e77c90" }} />
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: "#191410" }} />
            </span>
          </div>
          <div className="p-5 font-mono text-[0.78rem] leading-loose sm:p-6 sm:text-[0.85rem]">
            <div className="flex flex-wrap items-start">
              <span style={{ color: "#c8102e" }}>$&nbsp;</span>
              <span style={{ color: "#f7f2ea" }}>{CMD.slice(0, chars)}</span>
              <span className="caret" style={chars < CMD.length ? undefined : { animationDuration: "1.6s" }} />
            </div>
            {OUT.slice(0, outN).map((line) => (
              /* each new line lands with its own rise-in */
              <div
                key={line}
                className="flex items-start gap-2"
                style={{ animation: "term-line 0.3s ease-out both" }}
              >
                <span style={{ color: "#e77c90" }} aria-hidden>
                  ✓
                </span>
                <span style={{ color: "#e8dfcf" }}>{line}</span>
              </div>
            ))}
            {outN === OUT.length && (
              <div style={{ color: "#7a6f61", animation: "term-line 0.3s ease-out both" }}>
                skill ready — invoke from your agent runtime.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
