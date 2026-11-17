import { memo } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { profile } from "../data";
import { useLocalTime } from "../hooks/useLocalTime";
import { cx } from "../lib/cx";

const nav = [
  { href: "#index", label: "Index", number: "01" },
  { href: "#contact", label: "Contact", number: "02" },
];

const LocalTime = memo(function LocalTime() {
  const time = useLocalTime(profile.timeZone);

  return (
    <span className="tabular font-mono text-[11px] leading-none tracking-[0.06em] text-ink/80">
      {time}
      <span className="ml-1.5 text-[9px] uppercase tracking-[0.14em] text-muted">
        {profile.timeZoneLabel}
      </span>
    </span>
  );
});

export function TopBar() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between gap-4 px-5 md:px-8">
        <a
          href="#top"
          aria-label={`${profile.name} — back to top`}
          className="group flex items-center gap-3"
        >
          <span className="relative flex h-7 w-7 items-center justify-center border border-ink/25 font-mono text-[9px] leading-none tracking-[0.08em] text-ink transition-colors duration-300 group-hover:border-signal group-hover:text-signal">
            HS
            <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          <span className="meta-label hidden text-muted transition-colors duration-300 group-hover:text-ink sm:inline">
            {profile.overline}
          </span>
        </a>

        <nav
          aria-label="Sections"
          className="meta-label absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cx(
                "group flex items-baseline gap-1.5 text-muted transition-colors duration-300 hover:text-ink",
                "relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-signal after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100",
              )}
            >
              {item.label}
              <span className="text-[8px] text-ink/30 transition-colors duration-300 group-hover:text-signal">
                {item.number}
              </span>
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <span className="hidden items-center gap-2 xl:flex" title={profile.status}>
            <span className="status-ping relative block h-1.5 w-1.5 rounded-full bg-signal text-signal" />
            <span className="meta-label text-muted">{profile.status}</span>
          </span>
          <span className="hidden h-3.5 w-px bg-ink/15 xl:block" />
          <LocalTime />
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-signal"
      />
    </header>
  );
}
