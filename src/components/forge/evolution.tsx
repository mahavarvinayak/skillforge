"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVOLUTION_STAGES } from "./data";

gsap.registerPlugin(ScrollTrigger);

const R = 132; // ring radius (svg units)
const C = 2 * Math.PI * R; // ring circumference

/* Cross-environment determinism: Math.sin/cos last-digit drift differs between
   the Node SSR runtime and the browser, which trips React hydration on SVG
   attributes. Rounding every render-time coordinate to 2 decimals makes server
   and client output byte-identical. */
const n2 = (v: number) => Number(v.toFixed(2));

export function Evolution() {
  const root = useRef<HTMLElement>(null);
  const rotorRef = useRef<SVGGElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const sparkRef = useRef<SVGCircleElement>(null);
  const progressRef = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const gateCount = EVOLUTION_STAGES.length;
  const labelRadius = R + 40;

  // Direct mathematical sync of rotor, arc, spark, and labels
  const updateDial = (p: number) => {
    progressRef.current = p;
    const deg = p * 360;
    const phi = p * Math.PI * 2;

    // 1. Update active stage (0 to 5)
    const newActive = Math.min(gateCount - 1, Math.floor(p * gateCount));
    if (newActive !== activeRef.current) {
      activeRef.current = newActive;
      setActive(newActive);
    }

    // 2. Rotate rotor strictly around SVG center (160, 160) via native SVG attribute
    if (rotorRef.current) {
      rotorRef.current.setAttribute(
        "transform",
        `rotate(${deg.toFixed(2)} 160 160)`
      );
    }

    // 3. Smooth arc dashoffset
    if (arcRef.current) {
      arcRef.current.style.strokeDashoffset = `${(C * (1 - p)).toFixed(2)}`;
    }

    // 4. Position glowing ember spark at leading arc edge
    if (sparkRef.current) {
      const arcAngle = p * Math.PI * 2 - Math.PI / 2;
      const sx = 160 + Math.cos(arcAngle) * R;
      const sy = 160 + Math.sin(arcAngle) * R;
      sparkRef.current.setAttribute("cx", sx.toFixed(2));
      sparkRef.current.setAttribute("cy", sy.toFixed(2));
      sparkRef.current.style.opacity = p > 0.005 ? "1" : "0";
    }

    // 5. Position labels upright along the orbit (translation delta from base)
    const labels = gsap.utils.toArray<SVGTextElement>("[data-evo-label]");
    labels.forEach((el, i) => {
      const a = (i / gateCount) * Math.PI * 2 - Math.PI / 2;
      const bx = Math.cos(a) * labelRadius;
      const by = Math.sin(a) * labelRadius;
      const nx = Math.cos(a + phi) * labelRadius;
      const ny = Math.sin(a + phi) * labelRadius;
      el.setAttribute(
        "transform",
        `translate(${(nx - bx).toFixed(2)} ${(ny - by).toFixed(2)})`
      );
    });
  };

  // Re-apply rotation & label transforms after React state re-renders
  useEffect(() => {
    updateDial(progressRef.current);
  }, [active]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const build = (pin: boolean) => {
          const proxy = { p: 0 };
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: pin ? "+=260%" : "+=140%",
              pin,
              scrub: 0.5,
              anticipatePin: pin ? 1 : 0,
              onUpdate: (self) => {
                if (self.progress <= 0.001) updateDial(0);
              },
              onLeaveBack: () => updateDial(0),
            },
          });

          tl.to(proxy, {
            p: 1,
            duration: 1,
            ease: "none",
            onUpdate: () => updateDial(proxy.p),
          });
        };

        mm.add("(min-width: 1024px)", () => build(true));
        mm.add("(max-width: 1023px)", () => build(false));

        // Initial paint
        updateDial(0);

        // Header and stamp entrance
        gsap.from("[data-evo-stamp]", {
          scale: 2.6,
          opacity: 0,
          rotation: 18,
          duration: 0.65,
          ease: "power4.in",
          scrollTrigger: { trigger: el, start: "top 45%" },
        });
        gsap.from("[data-evo-head] > *", {
          y: 44,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 62%" },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        updateDial(0);
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const stage = EVOLUTION_STAGES[active];

  return (
    <section
      ref={root}
      className="relative overflow-hidden py-24"
      style={{ background: "#f7f2ea" }}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
        <div data-evo-head className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mono-label mb-5 flex items-center gap-3" style={{ color: "#c8102e" }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#c8102e" }} />
              05 / Governed Self-Evolution
            </div>
            <h2
              className="font-display font-semibold leading-[0.98] tracking-tight"
              style={{ fontSize: "clamp(2.4rem,6vw,4.6rem)" }}
            >
              It gets better on its own.
              <br />
              <em className="italic text-ember">Never</em> on its own terms.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-soot">
            Uncontrolled mutation breeds silent drift. SkillForge&apos;s six-gate
            loop turns production evidence into scorecards, bounded proposals and
            human-approved releases.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
          {/* ── the precision instrument dial ── */}
          <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
            <svg viewBox="-50 -50 420 420" className="h-full w-full overflow-visible">
              <defs>
                <filter id="evoGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* instrument ticks — 48 faint marks give the dial a machined precision feel */}
              {Array.from({ length: 48 }).map((_, i) => {
                const a = (i / 48) * Math.PI * 2;
                const isGate = i % 8 === 0;
                const inner = isGate ? 116 : 122;
                return (
                  <line
                    key={i}
                    x1={n2(160 + Math.cos(a) * inner)}
                    y1={n2(160 + Math.sin(a) * inner)}
                    x2={n2(160 + Math.cos(a) * 128)}
                    y2={n2(160 + Math.sin(a) * 128)}
                    stroke={isGate ? "#a39682" : "#d9cdbc"}
                    strokeWidth={isGate ? 1.8 : 0.9}
                  />
                );
              })}

              {/* Inner concentric technical ring */}
              <circle
                cx="160"
                cy="160"
                r={R - 18}
                fill="none"
                stroke="#d9cdbc"
                strokeWidth="0.75"
                strokeDasharray="2 5"
                opacity="0.6"
              />

              {/* Base guide ring */}
              <circle
                cx="160"
                cy="160"
                r={R}
                fill="none"
                stroke="#e2d8c8"
                strokeWidth="2"
              />

              {/* Active crimson progress arc — sweeps clockwise from 12 o'clock */}
              <circle
                ref={arcRef}
                data-evo-arc
                cx="160"
                cy="160"
                r={R}
                fill="none"
                stroke="#c8102e"
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C}
                transform="rotate(-90 160 160)"
              />

              {/* Glowing spark that glides at the leading edge of the arc */}
              <circle
                ref={sparkRef}
                cx="160"
                cy={160 - R}
                r="4.5"
                fill="#c8102e"
                filter="url(#evoGlow)"
                style={{ opacity: 0, transition: "opacity 0.2s" }}
              />

              {/* ── Rotor group: rotates STRICTLY around SVG center (160, 160) ── */}
              <g ref={rotorRef} data-evo-rotor>
                {EVOLUTION_STAGES.map((s, i) => {
                  const a = (i / EVOLUTION_STAGES.length) * Math.PI * 2 - Math.PI / 2;
                  const nx = n2(160 + Math.cos(a) * R);
                  const ny = n2(160 + Math.sin(a) * R);
                  const isActive = i === active;
                  const isPast = i < active;

                  return (
                    <g key={s.key}>
                      {/* Active breathing halo ring */}
                      {isActive && (
                        <circle
                          cx={nx}
                          cy={ny}
                          r="22"
                          fill="none"
                          stroke="#c8102e"
                          strokeWidth="1.5"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="r"
                            values="15;26;15"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.7;0.1;0.7"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Main node circle: locked 100% on circle perimeter */}
                      <circle
                        cx={nx}
                        cy={ny}
                        r={isActive ? 13 : isPast ? 9.5 : 8}
                        fill={isActive ? "#c8102e" : isPast ? "#c8102e" : "#f7f2ea"}
                        stroke={isActive ? "#ffffff" : isPast ? "#e77c90" : "#d9cdbc"}
                        strokeWidth={isActive ? 2.5 : 2}
                        style={{
                          filter: isActive ? "drop-shadow(0 0 6px rgba(200, 16, 46, 0.45))" : undefined,
                          transition: "r 0.3s ease, fill 0.3s ease, stroke 0.3s ease",
                        }}
                      />

                      {/* White center pip/jewel */}
                      {isActive && (
                        <circle cx={nx} cy={ny} r="3.5" fill="#ffffff" />
                      )}
                      {isPast && (
                        <circle cx={nx} cy={ny} r="2" fill="#ffffff" />
                      )}
                    </g>
                  );
                })}
              </g>

              {/* ── Gate labels: always upright, orbit around outer radius ── */}
              <g data-evo-labels>
                {EVOLUTION_STAGES.map((s, i) => {
                  const a = (i / EVOLUTION_STAGES.length) * Math.PI * 2 - Math.PI / 2;
                  const lx = n2(160 + Math.cos(a) * labelRadius);
                  const ly = n2(160 + Math.sin(a) * labelRadius);
                  const isActive = i === active;
                  return (
                    <text
                      key={s.key}
                      x={lx}
                      y={ly}
                      dy="0.35em"
                      textAnchor="middle"
                      data-evo-label
                      className="font-mono transition-colors duration-300 select-none"
                      style={{
                        fontSize: isActive ? "12px" : "10.5px",
                        letterSpacing: "0.14em",
                        fontWeight: isActive ? 800 : 600,
                        fill: isActive ? "#c8102e" : "#7a6f61",
                      }}
                    >
                      {s.key}
                    </text>
                  );
                })}
              </g>
            </svg>

            {/* Center readout — flips on every gate change */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span
                key={active}
                className="font-display font-black tabular-nums leading-none"
                style={{
                  fontSize: "5.5rem",
                  color: "#191410",
                  animation: "readout-flip 0.45s cubic-bezier(0.2,0.7,0.2,1) both",
                }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="mono-label mt-1" style={{ color: "#7a6f61" }}>
                / 06 gates
              </span>
            </div>
          </div>

          {/* ── Stage panel ── */}
          <div className="flex flex-col gap-6">
            <div
              key={stage.key}
              className="card-line p-7 sm:p-9"
              style={{ animation: "fadeUp 0.45s cubic-bezier(0.2,0.7,0.2,1) both" }}
            >
              <div className="mono-label" style={{ color: "#c8102e" }}>
                Gate {String(active + 1).padStart(2, "0")} — {stage.key}
              </div>
              <h3 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
                {stage.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-soot">{stage.desc}</p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-sm leading-relaxed text-soot">
                <span className="font-semibold text-ink">The evolution engine fails closed.</span>{" "}
                Attempts to weaken compliance, skip review or break schemas are
                rejected automatically.
              </p>
              <span data-evo-stamp className="stamp shrink-0 text-sm">
                Fails
                <br />
                Closed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
