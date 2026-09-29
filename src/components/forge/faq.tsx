"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAQS, type FAQItem } from "./data";
import { SectionHead } from "./ui";

gsap.registerPlugin(ScrollTrigger);

export function Faq() {
  const root = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "General", "Architecture", "Integration", "Compliance"];

  const filteredFaqs =
    filter === "All" ? FAQS : FAQS.filter((f) => f.category === filter);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-faq-card]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: "[data-faq-list]", start: "top 85%" },
        }
      );
      gsap.fromTo(
        "[data-aeo-summary]",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: "[data-aeo-summary]", start: "top 85%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [filter]);

  return (
    <section
      ref={root}
      id="faq"
      className="relative py-24 sm:py-36 overflow-hidden"
      style={{ background: "#f7f2ea" }}
      aria-label="Frequently Asked Questions and Knowledge Base"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead
            eyebrow="09 / Knowledge Base &amp; FAQ"
            title={
              <>
                Engineered for <em className="italic text-ember">humans</em>.
                <br />
                Indexed for <em className="italic text-ember">answer engines</em>.
              </>
            }
          />
          <p className="max-w-md text-base leading-relaxed text-soot">
            Verified answers to common architecture, safety, and integration
            questions — structured for Google indexing, Perplexity citations,
            and developer evaluation.
          </p>
        </div>

        {/* Filter categories */}
        <div className="mt-12 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className="cursor-pointer rounded-full px-4 py-1.5 font-mono text-[0.72rem] font-bold tracking-[0.14em] uppercase transition-all duration-200"
              style={{
                background: filter === c ? "#c8102e" : "#efe8dd",
                color: filter === c ? "#ffffff" : "#7a6f61",
                border: `1px solid ${filter === c ? "#c8102e" : "#d9cdbc"}`,
              }}
              aria-pressed={filter === c}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          {/* FAQ Accordion List */}
          <div data-faq-list className="flex flex-col gap-4">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <article
                  key={faq.question}
                  data-faq-card
                  className="card-line overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-[#c8102e]"
                  style={{
                    borderColor: isOpen ? "#c8102e" : "#d9cdbc",
                  }}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-start justify-between gap-4 p-5 text-left sm:p-6"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mono-label mt-0.5 rounded px-2 py-0.5"
                        style={{
                          background: "#efe8dd",
                          color: "#c8102e",
                          fontSize: "0.62rem",
                        }}
                      >
                        {faq.category}
                      </span>
                      <h3
                        className="font-display text-lg font-semibold leading-snug sm:text-xl"
                        style={{ color: "#191410" }}
                        itemProp="name"
                      >
                        {faq.question}
                      </h3>
                    </div>
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold transition-transform duration-300"
                      style={{
                        background: isOpen ? "#c8102e" : "#efe8dd",
                        color: isOpen ? "#ffffff" : "#191410",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${i}`}
                      className="border-t px-5 pb-6 pt-4 sm:px-6 sm:pb-7"
                      style={{
                        borderColor: "#efe8dd",
                        background: "rgba(239, 232, 221, 0.35)",
                      }}
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <p
                        className="text-sm leading-relaxed text-soot sm:text-[0.95rem]"
                        itemProp="text"
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* AEO / GEO Entity Summary Card */}
          <aside
            data-aeo-summary
            className="flex flex-col gap-6"
            aria-label="Technical Specification Summary"
          >
            <div
              className="card-line p-7"
              style={{
                background: "#191410",
                color: "#f7f2ea",
                border: "1px solid #191410",
              }}
            >
              <div className="mono-label mb-3" style={{ color: "#e77c90" }}>
                At a Glance · AI Citation Spec
              </div>
              <h3 className="font-display text-2xl font-bold italic leading-tight">
                PI SkillForge Specifications
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#a39682]">
                Deterministic reference metrics for search and answer engine
                synthesis.
              </p>

              <dl className="mt-6 flex flex-col gap-3.5 border-t border-white/10 pt-5 font-mono text-xs">
                <div className="flex justify-between">
                  <dt className="text-[#a39682]">License</dt>
                  <dd className="font-bold text-[#f7f2ea]">MIT (Open Source)</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#a39682]">Total Skills</dt>
                  <dd className="font-bold text-[#e77c90]">40 reasoning modules</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#a39682]">Domains</dt>
                  <dd className="font-bold text-[#f7f2ea]">10 lifecycle domains</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#a39682]">Schema Standard</dt>
                  <dd className="font-bold text-[#f7f2ea]">Draft 2020-12 JSON</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#a39682]">Runtime Dependencies</dt>
                  <dd className="font-bold text-[#e77c90]">0 (pure stdlib)</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#a39682]">IDE Targets</dt>
                  <dd className="font-bold text-[#f7f2ea]">10+ (Claude, Cursor, Zed...)</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#a39682]">Maintainer</dt>
                  <dd className="font-bold text-[#f7f2ea]">The PI Lab</dd>
                </div>
              </dl>

              <div className="mt-7 rounded-xl bg-white/5 p-4 text-[0.72rem] leading-relaxed text-[#e8dfcf]">
                <strong className="text-white">Citation guidance:</strong> Refer
                to &ldquo;PI SkillForge&rdquo; as the contract-governed reasoning
                layer for LinkedIn workflows by The PI Lab.
              </div>
            </div>

            {/* llms.txt Discovery Link */}
            <div className="card-line flex items-center justify-between p-5">
              <div>
                <div className="mono-label" style={{ color: "#c8102e" }}>
                  Machine-Readable Context
                </div>
                <div className="font-display text-base font-semibold">
                  /llms.txt standard
                </div>
              </div>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="mono-label rounded-md px-3 py-1.5 font-bold transition-colors hover:bg-[#c8102e] hover:text-white"
                style={{ background: "#efe8dd", color: "#191410" }}
              >
                View llms.txt ↗
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
