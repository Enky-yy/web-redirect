import { memo, useEffect, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
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
    return <span className="meta-label text-ink/80">{profile.descriptors[0]}</span>;
  }

  return (
    <span className="relative block h-4 w-[232px] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="meta-label absolute left-0 top-0 whitespace-nowrap text-ink/80"
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

function MagneticCTA() {
  const reduce = useReducedMotion() === true;
  const x = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });

  return (
    <div className="group relative inline-block">
      <div
        aria-hidden="true"
        className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-signal to-purple-600 opacity-50 blur transition duration-700 group-hover:opacity-100 group-hover:duration-200"
      />
      <motion.a
        href="#index"
        style={{ x, y }}
        onPointerMove={(event) => {
          if (reduce) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const dx = (event.clientX - rect.left - rect.width / 2) * 0.2;
          const dy = (event.clientY - rect.top - rect.height / 2) * 0.3;
          x.set(Math.max(-6, Math.min(6, dx)));
          y.set(Math.max(-5, Math.min(5, dy)));
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="relative inline-flex items-center gap-3 rounded-lg border border-border bg-surface px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors duration-300 group-hover:text-signal active:translate-y-px"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
        Open the index
        <ArrowDown
          size={13}
          weight="light"
          className="transition-transform duration-300 group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      </motion.a>
    </div>
  );
}

export function Hero({
  hoveredId,
  onHover,
}: {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const parts = profile.name.trim().split(/\s+/);

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden border-b border-ink/10"
    >
      <div className="grid-field pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-[1500px] flex-1 grid-cols-1 items-center gap-12 px-5 pb-10 pt-12 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-12">
        <div className="max-w-[44rem]">
          <div
            className="reveal flex items-center gap-3"
            style={{ "--delay": "60ms" } as CSSProperties}
          >
            <span className="block h-1.5 w-1.5 bg-signal" aria-hidden="true" />
            <p className="meta-label text-ink/70">{profile.overline}</p>
            <span className="h-px w-8 bg-ink/20" aria-hidden="true" />
            <p className="meta-label text-muted">
              {profile.volume} / 2026
            </p>
          </div>

          <h1 className="display mt-7 text-[clamp(3.6rem,8.4vw,7.4rem)] leading-[0.88] tracking-[-0.04em] md:mt-8">
            {parts.map((part, index) => {
              const last = index === parts.length - 1;
              return (
                <span
                  key={`${part}-${index}`}
                  className="mask-line"
                  style={{ "--delay": `${120 + index * 90}ms` } as CSSProperties}
                >
                  <span>
                    <span className={last ? "brand-gradient-text" : undefined}>{part}</span>
                    {last ? <span className="text-signal">.</span> : null}
                  </span>
                </span>
              );
            })}
          </h1>

          <p
            className="reveal mt-7 max-w-[46ch] text-[15px] leading-[1.7] text-body md:mt-8 md:text-[17px]"
            style={{ "--delay": "260ms" } as CSSProperties}
          >
            {profile.tagline}
          </p>

          <div
            className="reveal mt-7 flex flex-wrap items-center gap-x-3 gap-y-2"
            style={{ "--delay": "320ms" } as CSSProperties}
          >
            <span className="meta-label text-muted">Currently</span>
            <span className="h-px w-4 bg-ink/20" aria-hidden="true" />
            <RotatingLine />
          </div>

          <dl
            className="reveal mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/10 pt-5 sm:grid-cols-3"
            style={{ "--delay": "380ms" } as CSSProperties}
          >
            <div>
              <dt className="meta-label text-muted">Based</dt>
              <dd className="mt-2 font-mono text-[11px] leading-relaxed text-ink/80">
                {profile.location}
                <span className="mt-0.5 block text-[9px] tracking-[0.08em] text-muted">
                  {profile.coordinates}
                </span>
              </dd>
            </div>
            <div>
              <dt className="meta-label text-muted">Focus</dt>
              <dd className="mt-2 font-mono text-[11px] leading-relaxed text-ink/80">
                AI/ML systems
                <span className="mt-0.5 block text-[9px] tracking-[0.08em] text-muted">
                  agentic automation
                </span>
              </dd>
            </div>
            <div>
              <dt className="meta-label text-muted">Status</dt>
              <dd className="mt-2 flex items-center gap-2 font-mono text-[11px] leading-relaxed text-signal">
                <span className="status-ping relative block h-1.5 w-1.5 rounded-full bg-signal text-signal" />
                {profile.status}
              </dd>
            </div>
          </dl>

          <div
            className="reveal mt-9 flex flex-wrap items-center gap-6"
            style={{ "--delay": "440ms" } as CSSProperties}
          >
            <MagneticCTA />
            <a
              href={`mailto:${profile.email}`}
              className="link-underline meta-label inline-flex items-center gap-2 py-1 text-muted transition-colors duration-300 hover:text-ink"
            >
              Email me
              <ArrowUpRight size={12} weight="light" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <OrbitSystem hoveredId={hoveredId} onHover={onHover} />
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 border-t border-ink/10 px-5 py-4 md:px-8">
        <span className="meta-label tabular whitespace-nowrap text-muted">{profile.coordinates}</span>
        <a
          href="#index"
          className="group hidden items-center gap-2 text-muted transition-colors duration-300 hover:text-ink sm:flex"
        >
          <span className="meta-label">Scroll to the ledger</span>
          <ArrowDown
            size={13}
            weight="light"
            className="bob transition-transform duration-300 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
        <span className="meta-label tabular whitespace-nowrap text-muted">
          {String(allLinks.length).padStart(2, "0")} destinations
        </span>
      </div>
    </section>
  );
}
