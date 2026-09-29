"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

/* ── Section heading kit: mono eyebrow + display title ── */
export function SectionHead({
  eyebrow,
  title,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-head-line]", {
        scrollTrigger: { trigger: el, start: "top 82%" },
        y: 42,
        opacity: 0,
        rotate: 1.5,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-5 ${align === "center" ? "items-center text-center" : "items-start"}`}
    >
      <div
        data-head-line
        className="mono-label flex items-center gap-3"
        style={{ color: "#c8102e" }}
      >
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: "#c8102e" }}
          aria-hidden
        />
        {eyebrow}
      </div>
      <h2
        data-head-line
        className="font-display font-semibold leading-[0.98] tracking-tight text-[clamp(2.4rem,6vw,4.8rem)]"
        style={{ color: dark ? "#f7f2ea" : "#191410" }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ── Magnetic button: follows cursor slightly ── */
export function Magnetic({
  children,
  href,
  variant = "solid",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: "solid" | "ghost" | "ink";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    /* GSAP owns the transform — so the hover "breathe" is also driven
       here (a CSS hover:scale would lose to the inline translate) */
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    const sTo = gsap.quickTo(el, "scale", { duration: 0.3, ease: "power2.out" });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
    };
    const enter = () => sTo(1.04);
    const leave = () => {
      xTo(0);
      yTo(0);
      sTo(1);
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  const styles =
    variant === "solid"
      ? { background: "#c8102e", color: "#ffffff" }
      : variant === "ink"
        ? { background: "#191410", color: "#f7f2ea" }
        : { background: "transparent", color: "#191410", border: "1.5px solid #191410" };

  return (
    <a
      ref={ref}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`group inline-flex items-center gap-3 whitespace-nowrap rounded-full px-7 py-3.5 font-mono text-[0.8rem] font-bold tracking-[0.14em] uppercase will-change-transform ${className}`}
      style={styles}
    >
      {children}
    </a>
  );
}

/* ── Char splitter for big headlines ── */
export function SplitChars({
  text,
  className = "",
  charClass = "",
}: {
  text: string;
  className?: string;
  charClass?: string;
}) {
  return (
    <span className={`inline-block ${className}`} aria-label={text} role="text">
      {text.split("").map((c, i) => (
        <span
          key={i}
          aria-hidden
          data-char
          className={`inline-block will-change-transform ${charClass}`}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}
