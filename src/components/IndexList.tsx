import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import { allLinks, groups, type LinkItem } from "../data";
import { useExitNavigation, shouldIntercept } from "../lib/exit";
import { cx } from "../lib/cx";

const pad = (value: number) => String(value).padStart(2, "0");

export function IndexList({
  hoveredId,
  onHover,
}: {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [sectionInView, setSectionInView] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { navigate } = useExitNavigation();

  const details = useMemo(() => {
    const map = new Map<string, { group: string; number: string }>();
    let position = 0;
    groups.forEach((group) => {
      group.items.forEach((link) => {
        position += 1;
        map.set(link.id, { group: group.label, number: pad(position) });
      });
    });
    return map;
  }, []);

  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return allLinks.filter((link) => {
      const meta = details.get(link.id);
      if (groupFilter && meta?.group !== groupFilter) return false;
      if (!normalized) return true;
      return [link.name, link.meta, link.description, meta?.group ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [normalized, groupFilter, details]);

  const total = allLinks.length;
  const shown = filtered.length;

  useEffect(() => {
    onHover(null);
  }, [normalized, groupFilter, onHover]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const sectionObserver = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      { rootMargin: "-12% 0px -18% 0px", threshold: 0 },
    );
    sectionObserver.observe(node);

    const contact = document.querySelector("#contact");
    const contactObserver = new IntersectionObserver(
      ([entry]) => setContactInView(entry.isIntersecting),
      { rootMargin: "0px 0px -50% 0px", threshold: 0 },
    );
    if (contact) contactObserver.observe(contact);

    const footer = document.querySelector("footer");
    const footerObserver = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0.01 },
    );
    if (footer) footerObserver.observe(footer);

    return () => {
      sectionObserver.disconnect();
      contactObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  const docked = sectionInView && !contactInView && !footerInView;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable === true;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }

      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        setGroupFilter(null);
        inputRef.current?.blur();
        onHover(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onHover]);

  const moveFocus = (direction: 1 | -1) => {
    const rows = Array.from(
      listRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-ledger-row]") ?? [],
    );
    const current = rows.indexOf(document.activeElement as HTMLAnchorElement);
    if (current === -1) {
      rows[direction === 1 ? 0 : rows.length - 1]?.focus();
      return;
    }
    const next = Math.min(rows.length - 1, Math.max(0, current + direction));
    rows[next]?.focus();
  };

  const onListKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(1);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(-1);
    }
  };

  const activeLink = hoveredId
    ? allLinks.find((link) => link.id === hoveredId) ?? null
    : null;
  const activeDetails = activeLink ? details.get(activeLink.id) : undefined;

  return (
    <section
      ref={sectionRef}
      id="index"
      aria-labelledby="index-title"
      className="relative border-b border-ink/10"
    >
      <div className="mx-auto w-full max-w-[1500px] px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <div className="flex flex-col gap-8 border-b border-ink/10 pb-7 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="meta-label text-signal">01</span>
              <span className="meta-label text-muted">The index</span>
              <span className="h-px w-10 bg-ink/20" aria-hidden="true" />
              <span className="meta-label tabular text-muted">{pad(total)} entries</span>
            </div>
            <h2
              id="index-title"
              className="display mt-5 text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[0.92] tracking-[-0.035em]"
            >
              Everywhere I am<span className="text-signal">.</span>
            </h2>
          </div>

          <div className="flex w-full flex-col gap-2.5 lg:w-[320px]">
            <div className="flex w-full items-center gap-3 border border-ink/15 bg-surface/50 px-3 py-2.5 transition-colors duration-300 focus-within:border-signal">
              <MagnifyingGlass
                size={13}
                weight="light"
                className="shrink-0 text-muted"
                aria-hidden="true"
              />
              <label htmlFor="index-filter" className="sr-only">
                Filter destinations
              </label>
              <input
                id="index-filter"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    moveFocus(1);
                  }
                }}
                placeholder="Search links, handles, groups"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent font-mono text-[10px] uppercase tracking-[0.14em] text-ink outline-none placeholder:text-muted/60 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear the filter"
                  className="shrink-0 text-muted transition-colors duration-300 hover:text-signal"
                >
                  <X size={12} weight="light" />
                </button>
              ) : (
                <kbd className="shrink-0 border border-ink/15 px-1.5 py-0.5 font-mono text-[8px] leading-none text-muted">
                  ⌘K
                </kbd>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="tabular font-mono text-[9px] uppercase tracking-[0.18em] text-muted" aria-hidden="true">
                {pad(shown)} / {pad(total)} shown
              </p>
              <p className="sr-only" role="status">
                {shown} of {total} destinations shown
              </p>
              <p className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted/70 sm:block" aria-hidden="true">
                ↑ ↓ to move
              </p>
            </div>
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter by group"
          className="mt-5 flex flex-wrap items-baseline gap-2"
        >
          <span className="meta-label mr-1 hidden text-muted/60 sm:inline">Group</span>
          <GroupChip
            label="All"
            count={total}
            active={groupFilter === null}
            onClick={() => setGroupFilter(null)}
          />
          {groups.map((group) => (
            <GroupChip
              key={group.id}
              label={group.label}
              count={group.items.length}
              active={groupFilter === group.label}
              onClick={() => setGroupFilter(groupFilter === group.label ? null : group.label)}
            />
          ))}
        </div>

        <div className="mt-5 hidden grid-cols-[3rem_minmax(0,1fr)_13rem_6rem_1.5rem] items-center gap-4 border-b border-ink/10 px-2 py-2.5 md:grid xl:grid-cols-[3rem_minmax(0,0.95fr)_11rem_minmax(0,1.05fr)_5rem_1.5rem]">
          <span className="meta-label text-muted/70">No.</span>
          <span className="meta-label text-muted/70">Destination</span>
          <span className="meta-label text-muted/70">Handle</span>
          <span className="meta-label hidden text-muted/70 xl:block">Note</span>
          <span className="meta-label text-muted/70">Group</span>
          <span className="sr-only">Open</span>
        </div>

        <div ref={listRef} onKeyDown={onListKeyDown} onPointerLeave={() => onHover(null)}>
          {filtered.map((link, index) => {
            const meta = details.get(link.id);
            return (
              <LedgerRow
                key={link.id}
                link={link}
                number={meta?.number ?? "00"}
                group={meta?.group ?? ""}
                delay={Math.min(index * 0.035, 0.24)}
                highlighted={hoveredId === link.id}
                onHover={onHover}
                onNavigate={navigate}
              />
            );
          })}

          {shown === 0 ? (
            <div className="flex flex-col items-start border-b border-ink/10 px-2 py-16 md:py-20">
              <div className="flex items-center gap-3">
                <span className="meta-label text-signal">No match</span>
                <span className="h-px w-12 bg-ink/20" aria-hidden="true" />
                <span className="tabular font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                  00 / {pad(total)}
                </span>
              </div>
              <p className="display mt-6 max-w-[24ch] text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[0.98] tracking-[-0.03em]">
                Nothing is filed under “{query.trim()}”.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setGroupFilter(null);
                  onHover(null);
                  inputRef.current?.focus();
                }}
                className="group mt-7 inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:border-signal hover:text-signal active:translate-y-px"
              >
                Reset the filter
                <ArrowRight
                  size={12}
                  weight="light"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {docked ? (
          <motion.div
            initial={{ y: 46 }}
            animate={{ y: 0 }}
            exit={{ y: 46 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/15 bg-paper/90 backdrop-blur-xl"
          >
            <div className="mx-auto flex h-11 max-w-[1500px] items-center gap-4 px-5 md:px-8">
              {activeLink ? (
                <>
                  <span className="tabular font-mono text-[9px] leading-none text-signal">
                    {activeDetails?.number}
                  </span>
                  <span className="display shrink-0 text-[13px] leading-none tracking-[-0.01em]">
                    {activeLink.name}
                  </span>
                  <span className="hidden min-w-0 flex-1 truncate font-mono text-[10px] tracking-[0.01em] text-muted sm:block">
                    {activeLink.description}
                  </span>
                  <span className="ml-auto flex shrink-0 items-center gap-3">
                    <span className="meta-label hidden text-muted sm:inline">
                      {activeDetails?.group}
                    </span>
                    <ArrowUpRight size={12} weight="light" className="text-signal" aria-hidden="true" />
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    <span className="block h-1 w-1 bg-signal" aria-hidden="true" />
                    <span className="meta-label text-muted">Ledger readout</span>
                  </span>
                  <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-muted/70 sm:inline">
                    Hover or focus a row to inspect
                  </span>
                  <span className="ml-auto tabular font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                    {pad(total)} entries · {pad(groups.length)} groups
                  </span>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function GroupChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "inline-flex items-baseline gap-2 border px-2.5 py-1.5 font-mono text-[9px] uppercase leading-none tracking-[0.16em] transition-colors duration-300 active:translate-y-px",
        active
          ? "border-signal bg-signal/10 text-signal"
          : "border-ink/15 text-muted hover:border-ink/30 hover:text-ink",
      )}
    >
      {label}
      <span
        className={cx(
          "tabular text-[8px]",
          active ? "text-signal/70" : "text-muted/50",
        )}
      >
        {pad(count)}
      </span>
    </button>
  );
}

type LedgerRowProps = {
  link: LinkItem;
  number: string;
  group: string;
  delay: number;
  highlighted: boolean;
  onHover: (id: string | null) => void;
  onNavigate: ReturnType<typeof useExitNavigation>["navigate"];
};

function LedgerRow({
  link,
  number,
  group,
  delay,
  highlighted,
  onHover,
  onNavigate,
}: LedgerRowProps) {
  return (
    <motion.a
      href={link.href}
      data-ledger-row=""
      data-highlighted={highlighted ? "" : undefined}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cx(
        "ledger-row group grid scroll-mb-16 grid-cols-[2rem_minmax(0,1fr)_1.25rem] items-center gap-3 border-b border-ink/10 px-2 py-5",
        "md:grid-cols-[3rem_minmax(0,1fr)_13rem_6rem_1.5rem] md:gap-4 md:py-6",
        "xl:grid-cols-[3rem_minmax(0,0.95fr)_11rem_minmax(0,1.05fr)_5rem_1.5rem]",
      )}
      onPointerEnter={() => onHover(link.id)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(link.id)}
      onBlur={() => onHover(null)}
      onClick={(event) => {
        if (!shouldIntercept(event, link.href)) return;
        event.preventDefault();
        onNavigate({ href: link.href, name: link.name, index: number });
      }}
    >
      <span className="ledger-number tabular font-mono text-[10px] leading-none text-muted">
        {number}
      </span>

      <span className="flex min-w-0 items-baseline gap-3">
        <span className="ledger-name display truncate text-[1.15rem] leading-none tracking-[-0.015em] md:text-[1.35rem]">
          {link.name}
        </span>
        <span className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-muted md:hidden">
          {link.meta}
        </span>
      </span>

      <span className="hidden truncate font-mono text-[10px] leading-none tracking-[0.06em] text-muted md:block">
        {link.meta}
      </span>

      <span className="hidden truncate text-[11px] leading-relaxed text-muted/85 xl:block">
        {link.description}
      </span>

      <span className="hidden font-mono text-[9px] uppercase leading-none tracking-[0.16em] text-muted/80 md:block">
        {group}
      </span>

      <span className="flex justify-end">
        <ArrowUpRight
          size={15}
          weight="light"
          className="ledger-arrow text-muted"
          aria-hidden="true"
        />
      </span>

      <span className="sr-only"> — {link.description}</span>
    </motion.a>
  );
}
