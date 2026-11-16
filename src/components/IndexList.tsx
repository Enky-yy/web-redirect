import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowUpRight, Asterisk, MagnifyingGlass, X } from "@phosphor-icons/react";
import { allLinks, groups, type LinkItem } from "../data";
import { useExitNavigation, shouldIntercept } from "../lib/exit";
import { usePointerFine } from "../hooks/usePointerFine";
import { cx } from "../lib/cx";
import { HoverPreview } from "./HoverPreview";

type Point = { x: number; y: number };

export function IndexList({
  hoveredId,
  onHover,
}: {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [flip, setFlip] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const pointerFine = usePointerFine();
  const reduce = useReducedMotion() === true;
  const previewEnabled = pointerFine && !reduce;

  const { navigate } = useExitNavigation();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 420, damping: 36, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 420, damping: 36, mass: 0.5 });

  const details = useMemo(() => {
    const map = new Map<string, { group: string; index: string }>();
    let position = 0;
    groups.forEach((group) => {
      group.items.forEach((link) => {
        position += 1;
        map.set(link.id, {
          group: group.label,
          index: String(position).padStart(2, "0"),
        });
      });
    });
    return map;
  }, []);

  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((link) =>
          [link.name, link.meta, link.description, group.label]
            .join(" ")
            .toLowerCase()
            .includes(normalized),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [normalized]);

  const shown = filtered.reduce((total, group) => total + group.items.length, 0);
  const total = allLinks.length;

  useEffect(() => {
    setPreviewId(null);
  }, [normalized]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable === true;

      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const showPreview = (link: LinkItem, point: Point) => {
    if (!previewEnabled) return;
    if (!previewId) {
      x.jump(point.x);
      y.jump(point.y);
    }
    rawX.set(point.x);
    rawY.set(point.y);
    setFlip(point.y < 300);
    setPreviewId(link.id);
  };

  const trackPreview = (clientX: number, clientY: number) => {
    if (!previewId) return;
    rawX.set(clientX);
    rawY.set(clientY);
    const nextFlip = clientY < 300;
    setFlip((current) => (current === nextFlip ? current : nextFlip));
  };

  const previewLink = previewId ? allLinks.find((link) => link.id === previewId) ?? null : null;
  const previewDetails = previewId ? details.get(previewId) : undefined;

  return (
    <section id="index" aria-labelledby="index-title" className="relative border-b border-ink/10">
      <div className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-20 md:px-10 md:pb-28 md:pt-28">
        <div className="flex flex-col gap-8 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="meta-label text-rust">01</span>
              <span className="meta-label text-muted">The index</span>
            </div>
            <h2
              id="index-title"
              className="mt-5 font-serif text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.92] tracking-[-0.01em]"
            >
              Everything worth <span className="italic">reaching</span>.
            </h2>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-[286px] md:items-end">
            <div className="flex w-full items-center gap-3 border-b border-ink/20 pb-2 transition-colors duration-300 focus-within:border-rust">
              <MagnifyingGlass size={14} weight="light" className="shrink-0 text-muted" aria-hidden="true" />
              <label htmlFor="index-filter" className="sr-only">
                Filter destinations
              </label>
              <input
                id="index-filter"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter the index"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent font-mono text-[10px] uppercase tracking-[0.16em] text-ink outline-none placeholder:text-muted/65 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear the filter"
                  className="shrink-0 text-muted transition-colors hover:text-rust"
                >
                  <X size={12} weight="light" />
                </button>
              ) : (
                <kbd className="shrink-0 border border-ink/15 px-1.5 py-0.5 font-mono text-[8px] leading-none text-muted">
                  /
                </kbd>
              )}
            </div>
            <p className="tabular font-mono text-[10px] uppercase tracking-[0.16em] text-muted" aria-hidden="true">
              {String(shown).padStart(2, "0")} / {String(total).padStart(2, "0")} entries
            </p>
            <p className="sr-only" role="status">
              {shown} of {total} destinations shown
            </p>
          </div>
        </div>

        <div
          ref={listRef}
          onPointerMove={(event) => trackPreview(event.clientX, event.clientY)}
          onPointerLeave={() => {
            setPreviewId(null);
            onHover(null);
          }}
        >
          {filtered.map((group) => (
            <div key={group.id} className="mt-10 first:mt-4">
              <div className="flex items-center gap-4 py-3">
                <h3 className="meta-label text-ink">{group.label}</h3>
                <span className="tabular meta-label text-rust">
                  {String(group.items.length).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
              </div>

              {group.items.map((link, index) => (
                <IndexRow
                  key={link.id}
                  link={link}
                  number={details.get(link.id)?.index ?? "00"}
                  delay={Math.min(index * 0.045, 0.28)}
                  highlighted={hoveredId === link.id}
                  onHover={onHover}
                  onPreview={showPreview}
                  onNavigate={(target) => {
                    setPreviewId(null);
                    navigate(target);
                  }}
                />
              ))}
            </div>
          ))}

          {shown === 0 ? (
            <div className="flex flex-col items-center justify-center border-b border-ink/10 px-4 py-24 text-center">
              <Asterisk size={30} weight="light" className="spin-slow text-rust" aria-hidden="true" />
              <p className="mt-7 font-serif text-[clamp(1.9rem,4vw,2.6rem)] leading-tight">
                Nothing under that name.
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                No entries match “{query.trim()}”
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  onHover(null);
                }}
                className="mt-7 border-b border-ink/30 pb-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-rust hover:text-rust"
              >
                Clear the filter
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <HoverPreview
        link={previewLink}
        groupLabel={previewDetails?.group ?? ""}
        index={previewDetails?.index ?? ""}
        x={x}
        y={y}
        flip={flip}
        enabled={previewEnabled}
      />
    </section>
  );
}

type IndexRowProps = {
  link: LinkItem;
  number: string;
  delay: number;
  highlighted: boolean;
  onHover: (id: string | null) => void;
  onPreview: (link: LinkItem, point: Point) => void;
  onNavigate: ReturnType<typeof useExitNavigation>["navigate"];
};

function IndexRow({
  link,
  number,
  delay,
  highlighted,
  onHover,
  onPreview,
  onNavigate,
}: IndexRowProps) {
  return (
    <motion.a
      href={link.href}
      data-highlighted={highlighted ? "" : undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cx(
        "index-row group relative grid grid-cols-[2rem_1fr_1.75rem] items-center gap-3 overflow-hidden border-b border-ink/10 py-5 pl-1 pr-2",
        "md:grid-cols-[3.25rem_1fr_13rem_2rem] md:gap-4 md:py-6",
      )}
      onPointerEnter={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const relativeX = event.clientX - rect.left;
        event.currentTarget.style.setProperty(
          "--fill-origin",
          relativeX < rect.width / 2 ? "left" : "right",
        );
        onHover(link.id);
        onPreview(link, { x: event.clientX, y: event.clientY });
      }}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(link.id)}
      onBlur={() => onHover(null)}
      onClick={(event) => {
        if (!shouldIntercept(event, link.href)) return;
        event.preventDefault();
        onNavigate({ href: link.href, name: link.name, index: number });
      }}
    >
      <span className="row-fill" aria-hidden="true" />

      <span className="row-number relative font-mono text-[10px] tabular">
        {number}
      </span>

      <span className="relative flex min-w-0 flex-col">
        <span className="text-[1.3rem] leading-[1.15] tracking-[-0.02em] md:text-[1.6rem]">
          {link.name}
        </span>
        <span className="row-muted mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] md:hidden">
          {link.meta}
        </span>
      </span>

      <span className="row-muted relative hidden font-mono text-[10px] uppercase tracking-[0.16em] md:block">
        {link.meta}
      </span>

      <span className="relative flex justify-end">
        <ArrowUpRight size={18} weight="light" className="row-arrow" aria-hidden="true" />
      </span>

      <span className="sr-only"> — {link.description}</span>

      {highlighted ? (
        <span
          className="absolute left-8 top-1/2 h-5 w-px -translate-y-1/2 bg-rust md:left-[3.25rem]"
          aria-hidden="true"
        />
      ) : null}
    </motion.a>
  );
}

