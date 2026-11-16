import { memo, useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react";
import { allLinks, profile } from "../data";
import { OrbitSystem } from "./OrbitSystem";

const RotatingLine = memo(function RotatingLine() {
  const reduce = useReducedMotion() === true;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % profile.descriptors.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [reduce]);

  if (reduce) {
    return (
      <span className="meta-label text-ink">{profile.descriptors[0]}</span>
    );
  }

  return (
    <span className="relative block h-4 w-[216px] overflow-hidden sm:w-[228px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="meta-label absolute left-0 top-0 whitespace-nowrap text-ink"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {profile.descriptors[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

export function Hero({
  hoveredId,
  onHover,
}: {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col border-b border-ink/10"
    >
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-10 px-5 pb-12 pt-14 md:px-10 md:pt-16 lg:grid-cols-[1.06fr_0.94fr] lg:gap-8 lg:py-10 xl:gap-16">
        <div className="relative z-10 max-w-[46rem]">
          <div
            className="reveal flex items-center gap-4"
            style={{ "--delay": "60ms" } as CSSProperties}
          >
            <span className="block h-px w-9 bg-rust" aria-hidden="true" />
            <p className="meta-label text-ink/70">
              {profile.overline}
              <span className="mx-2.5 text-ink/25">/</span>
              {profile.volume}
            </p>
          </div>

          <h1 className="mt-6 font-serif text-[clamp(4.1rem,12.5vw,9.5rem)] leading-[0.84] tracking-[-0.015em] md:mt-8">
            {profile.name.split(/\s+/).map((part, index, parts) => (
              <span
                key={`${part}-${index}`}
                className="mask-line"
                style={{ "--delay": `${120 + index * 90}ms` } as CSSProperties}
              >
                <span>
                  {part}
                  {index === parts.length - 1 ? <span className="text-rust">.</span> : null}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="reveal mt-7 max-w-[42ch] text-[1.0625rem] leading-[1.65] text-ink/70 md:mt-9 md:text-[1.2rem]"
            style={{ "--delay": "260ms" } as CSSProperties}
          >
            {profile.tagline}
          </p>

          <div
            className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 md:mt-10"
            style={{ "--delay": "340ms" } as CSSProperties}
          >
            <span className="meta-label text-muted">Currently</span>
            <span className="block h-px w-5 bg-ink/20" aria-hidden="true" />
            <RotatingLine />
          </div>

          <p
            className="reveal mt-10 hidden max-w-[34ch] border-l border-ink/15 pl-4 text-[11px] leading-relaxed text-muted md:mt-14 md:block"
            style={{ "--delay": "420ms" } as CSSProperties}
          >
            {profile.based}
          </p>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <OrbitSystem hoveredId={hoveredId} onHover={onHover} />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 border-t border-ink/10 px-5 py-4 md:px-10">
        <span className="meta-label tabular hidden text-muted sm:block">{profile.coordinates}</span>
        <a
          href="#index"
          className="group flex items-center gap-2 text-muted transition-colors duration-300 hover:text-ink"
        >
          <span className="meta-label">Scroll to the index</span>
          <ArrowDown
            size={13}
            weight="light"
            className="bob transition-transform duration-300 group-hover:translate-y-0.5"
          />
        </a>
        <span className="meta-label tabular text-muted">
          {String(allLinks.length).padStart(2, "0")} destinations
        </span>
      </div>
    </section>
  );
}
