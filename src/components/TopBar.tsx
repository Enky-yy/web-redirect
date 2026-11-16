import { memo } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { profile } from "../data";
import { useLocalTime } from "../hooks/useLocalTime";
import { useTheme } from "../hooks/useTheme";
import { cx } from "../lib/cx";

const nav = [
  { href: "#index", label: "Index", number: "01" },
  { href: "#now", label: "Now", number: "02" },
  { href: "#contact", label: "Contact", number: "03" },
];

const LocalTime = memo(function LocalTime() {
  const time = useLocalTime(profile.timeZone);

  return (
    <span className="tabular font-mono text-[11px] leading-none tracking-[0.06em] text-ink">
      {time}
      <span className="ml-1.5 text-[9px] uppercase tracking-[0.12em] text-muted">
        {profile.timeZoneLabel}
      </span>
    </span>
  );
});

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="group flex h-7 w-7 items-center justify-center text-muted transition-colors duration-300 hover:text-ink"
    >
      {theme === "dark" ? (
        <Sun size={15} weight="light" aria-hidden="true" />
      ) : (
        <Moon size={15} weight="light" aria-hidden="true" />
      )}
    </button>
  );
});

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 md:px-10">
        <a
          href="#top"
          aria-label={`${profile.name} — back to top`}
          className="group flex items-baseline gap-3"
        >
          <span className="font-serif text-[1.6rem] italic leading-none transition-transform duration-500 group-hover:-translate-y-0.5">
            {profile.monogram}
          </span>
          <span className="meta-label hidden text-muted transition-colors group-hover:text-ink sm:inline">
            {profile.overline}
          </span>
        </a>

        <nav aria-label="Sections" className="meta-label absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cx(
                "group relative flex items-baseline gap-1.5 text-muted transition-colors duration-300 hover:text-ink",
                "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100",
              )}
            >
              {item.label}
              <span className="text-[8px] text-ink/35 transition-colors group-hover:text-rust">
                {item.number}
              </span>
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <span className="flex items-center gap-2" title={profile.status}>
            <span className="status-ping relative block h-1.5 w-1.5 rounded-full bg-rust text-rust" />
            <span className="sr-only">{profile.status}</span>
            <span className="meta-label hidden text-muted xl:inline">{profile.status}</span>
          </span>
          <span className="h-4 w-px bg-ink/15" />
          <ThemeToggle />
          <LocalTime />
        </div>
      </div>
    </header>
  );
}
