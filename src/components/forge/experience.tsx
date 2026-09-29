"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Preloader, Nav } from "./chrome";
import { Hero } from "./hero";
import { Manifesto } from "./manifesto";
import { Problem } from "./problem";
import { Architecture } from "./architecture";
import { Matrix } from "./matrix";
import { Evolution } from "./evolution";
import { Adapters } from "./adapters";
import { Ide } from "./ide";
import { Safety } from "./safety";
import { Faq } from "./faq";
import { Outro } from "./outro";

gsap.registerPlugin(ScrollTrigger);
/* pin smoothing both directions — prevents pinned sections from jumping
   when users scroll back up fast */
ScrollTrigger.defaults({ anticipatePin: 1 });

export default function Experience() {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  /* ── smooth scroll engine ── */
  useEffect(() => {
    /* kill browser scroll restoration — reloading mid-page must boot at
       the top or the preloader + ScrollTriggers initialize desynced */
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    ScrollTrigger.clearScrollMemory?.();
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.09,
      smoothWheel: !reduced,
      wheelMultiplier: 1,
      touchMultiplier: 1.0,
    });
    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.stop();

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      if (e.scroll <= 2) {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.start === 0) {
            st.animation?.progress(0);
          }
        });
      }
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.config({ ignoreMobileResize: true });

    document.documentElement.style.overflow = "hidden";

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      document.documentElement.style.overflow = "";
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  /* ── unlock after preloader ── */
  useEffect(() => {
    if (!loaded) return;
    document.documentElement.style.overflow = "";
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
    lenisRef.current?.start();
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(t);
  }, [loaded]);

  const handleDone = useCallback(() => setLoaded(true), []);

  return (
    <>
      <Preloader onDone={handleDone} />
      <Nav visible={loaded} />
      <main className="relative w-full overflow-x-clip">
        <Hero />
        <Manifesto />
        <Problem />
        <Architecture />
        <Matrix />
        <Evolution />
        <Adapters />
        <Ide />
        <Safety />
        <Faq />
        <Outro />
      </main>
    </>
  );
}
