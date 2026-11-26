import { memo } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Moon, Sun } from "@phosphor-icons/react";
import { profile } from "../data";
import { useLocalTime } from "../hooks/useLocalTime";
import { useTheme } from "../hooks/useTheme";
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
  const { theme, toggle } = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between gap-4 px-5 md:px-8">
        <a
          href="#top"
          aria-label={`${profile.name} — back to top`}
          className="group flex items-center gap-2.5"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-ink/20 bg-surface font-mono text-[10px] font-semibold leading-none tracking-[0.04em] text-ink transition-colors duration-300 group-hover:border-signal group-hover:text-signal">
            HS
            <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          <span className="hidden items-center font-mono text-sm font-semibold tracking-tight text-signal sm:flex">
            ~/
            <span className="text-ink transition-colors duration-300 group-hover:text-signal">
              index
            </span>
            <span className="caret ml-0.5 inline-block h-3.5 w-[2px] bg-signal" aria-hidden="true" />
          </span>
        </a>

        <nav
          aria-label="Sections"
          className="meta-label absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cx(
                "link-underline group flex items-baseline gap-1.5 rounded-md px-2.5 py-1.5 text-body transition-colors duration-200 hover:bg-well hover:text-ink",
              )}
            >
              {item.label}
              <span className="text-[8px] text-muted transition-colors duration-300 group-hover:text-signal">
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
          <motion.button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            whileTap={{ scale: 0.85, rotate: 180 }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-well text-ink ring-1 ring-border transition-colors hover:text-signal"
          >
            {theme === "dark" ? (
              <Sun size={15} weight="bold" aria-hidden="true" />
            ) : (
              <Moon size={15} weight="bold" aria-hidden="true" />
            )}
          </motion.button>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-signal"
      />
    </header>
  );
}
