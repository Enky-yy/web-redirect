import {
  memo,
  useCallback,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { allLinks, orbitLinks, profile, type LinkItem } from "../data";
import { useElementWidth } from "../hooks/useElementWidth";
import { useExitNavigation, shouldIntercept } from "../lib/exit";
import { cx } from "../lib/cx";
import { BrandIcon } from "./BrandIcon";

const DESIGN = 520;
const CENTER = DESIGN / 2;
const RINGS = [
  { radius: 118, speed: 3.4 },
  { radius: 166, speed: -2.2 },
  { radius: 214, speed: 1.5 },
] as const;

const TICKS = Array.from({ length: 72 }, (_, index) => {
  const angle = (index * 5 * Math.PI) / 180;
  const major = index % 6 === 0;
  const start = major ? 228 : 232;
  const end = major ? 248 : 240;

  return {
    x1: CENTER + start * Math.cos(angle),
    y1: CENTER + start * Math.sin(angle),
    x2: CENTER + end * Math.cos(angle),
    y2: CENTER + end * Math.sin(angle),
    major,
  };
});

const CONTACTS = [
  { angle: -128, radius: 142 },
  { angle: 34, radius: 190 },
  { angle: 152, radius: 84 },
] as const;

type OrbitProps = {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
};

export function OrbitSystem({ hoveredId, onHover }: OrbitProps) {
  const reduce = useReducedMotion() === true;
  const [plateRef, width] = useElementWidth<HTMLDivElement>();

  const angle0 = useMotionValue(0);
  const angle1 = useMotionValue(0);
  const angle2 = useMotionValue(0);

  const dragging = useRef(false);
  const moved = useRef(false);
  const captured = useRef(false);
  const lastPointer = useRef(0);
  const lastTime = useRef(0);
  const dragVelocity = useRef(0);
  const velocity = useRef(0);
  const pointerId = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const { navigate } = useExitNavigation();

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const dt = Math.min(delta, 48) / 1000;

    if (Math.abs(velocity.current) > 0.15) {
      const boost = velocity.current;
      velocity.current *= 0.94;
      angle0.set(angle0.get() + boost * dt);
      angle1.set(angle1.get() + boost * dt);
      angle2.set(angle2.get() + boost * dt);
    } else {
      velocity.current = 0;
    }

    if (dragging.current) return;

    angle0.set(angle0.get() + RINGS[0].speed * dt);
    angle1.set(angle1.get() + RINGS[1].speed * dt);
    angle2.set(angle2.get() + RINGS[2].speed * dt);
  });

  const angleAt = useCallback(
    (clientX: number, clientY: number) => {
      const rect = plateRef.current?.getBoundingClientRect();
      if (!rect) return 0;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
    },
    [plateRef],
  );

  const applyDelta = useCallback(
    (delta: number) => {
      angle0.set(angle0.get() + delta);
      angle1.set(angle1.get() + delta);
      angle2.set(angle2.get() + delta);
    },
    [angle0, angle1, angle2],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    dragging.current = true;
    moved.current = false;
    captured.current = false;
    pointerId.current = event.pointerId;
    lastPointer.current = angleAt(event.clientX, event.clientY);
    lastTime.current = performance.now();
    dragVelocity.current = 0;
    velocity.current = 0;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;

    const next = angleAt(event.clientX, event.clientY);
    let delta = next - lastPointer.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    if (Math.abs(delta) > 0.6) moved.current = true;

    const now = performance.now();
    const elapsed = Math.max(8, now - lastTime.current) / 1000;
    dragVelocity.current = Math.max(-420, Math.min(420, delta / elapsed));
    applyDelta(delta);
    lastPointer.current = next;
    lastTime.current = now;

    if (moved.current && !captured.current && pointerId.current !== null) {
      try {
        event.currentTarget.setPointerCapture(pointerId.current);
        captured.current = true;
        setIsDragging(true);
      } catch {
        // Pointer capture can fail if the pointer was already released.
      }
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;

    dragging.current = false;
    setIsDragging(false);
    velocity.current = reduce ? 0 : Math.max(-210, Math.min(210, dragVelocity.current * 0.32));

    if (
      captured.current &&
      pointerId.current !== null &&
      event.currentTarget.hasPointerCapture(pointerId.current)
    ) {
      event.currentTarget.releasePointerCapture(pointerId.current);
    }

    captured.current = false;
    pointerId.current = null;
    window.setTimeout(() => {
      moved.current = false;
    }, 0);
  };

  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!moved.current) return;
    event.preventDefault();
    event.stopPropagation();
    moved.current = false;
  };

  const scale = width > 0 ? width / DESIGN : 1;
  const nodeSize =
    width > 0 ? Math.max(34, Math.min(46, Math.round(46 * Math.max(0.8, scale)))) : 44;
  const indexOf = (link: LinkItem) => {
    const position = allLinks.findIndex((item) => item.id === link.id);
    return String(position + 1).padStart(2, "0");
  };

  return (
    <div className="w-full max-w-[560px]">
      <div className="mb-2.5 flex items-center justify-between px-0.5">
        <span className="meta-label flex items-center gap-2 text-muted">
          <span className="block h-1 w-1 bg-signal" aria-hidden="true" />
          Featured / {String(orbitLinks.length).padStart(2, "0")}
        </span>
        <span className="meta-label flex items-center gap-2 text-signal">
          <span className="status-ping relative block h-1.5 w-1.5 rounded-full bg-signal text-signal" />
          Autonomous
        </span>
      </div>

      <div
        ref={plateRef}
        role="group"
        aria-label="Featured destinations on a rotating scope. Drag with a mouse to spin it; the full index below is keyboard accessible."
        className={cx(
          "relative aspect-square w-full touch-pan-y select-none border border-ink/15 bg-surface/50",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(event) => {
          if (dragging.current) endDrag(event);
        }}
        onClickCapture={onClickCapture}
      >
        <div className="panel-grid pointer-events-none absolute inset-0" aria-hidden="true" />

        <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-signal/70" />
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-signal/70" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-signal/70" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-signal/70" />

        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg
            viewBox={`0 0 ${DESIGN} ${DESIGN}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="scope-sweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.32" />
                <stop offset="60%" stopColor="var(--color-signal)" stopOpacity="0.08" />
                <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="scope-edge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <g stroke="var(--color-ink)">
              {RINGS.map((ring, index) => (
                <circle
                  key={ring.radius}
                  cx={CENTER}
                  cy={CENTER}
                  r={ring.radius}
                  fill="none"
                  strokeOpacity={index === 0 ? 0.16 : index === 1 ? 0.1 : 0.14}
                  strokeWidth={0.8}
                  strokeDasharray={index === 1 ? "2 6" : undefined}
                />
              ))}

              <circle cx={CENTER} cy={CENTER} r={252} fill="none" strokeOpacity={0.16} strokeWidth={0.8} />
              <circle cx={CENTER} cy={CENTER} r={58} fill="none" strokeOpacity={0.1} strokeWidth={0.8} />

              <line x1={CENTER} y1={8} x2={CENTER} y2={DESIGN - 8} strokeOpacity={0.07} strokeWidth={0.8} strokeDasharray="1 7" />
              <line x1={8} y1={CENTER} x2={DESIGN - 8} y2={CENTER} strokeOpacity={0.07} strokeWidth={0.8} strokeDasharray="1 7" />

              {TICKS.map((tick, index) => (
                <line
                  key={index}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  strokeOpacity={tick.major ? 0.4 : 0.18}
                  strokeWidth={tick.major ? 1 : 0.6}
                />
              ))}
            </g>

            <g className="radar-sweep">
              <path
                d={`M ${CENTER} ${CENTER} L ${CENTER} 8 A 252 252 0 0 1 ${CENTER + 252 * Math.cos((-76 * Math.PI) / 180)} ${CENTER + 252 * Math.sin((-76 * Math.PI) / 180)} Z`}
                fill="url(#scope-sweep)"
              />
              <line
                x1={CENTER}
                y1={CENTER}
                x2={CENTER}
                y2={8}
                stroke="url(#scope-edge)"
                strokeWidth={1.2}
              />
            </g>

            {CONTACTS.map((contact, index) => (
              <circle
                key={index}
                cx={CENTER + contact.radius * Math.cos((contact.angle * Math.PI) / 180)}
                cy={CENTER + contact.radius * Math.sin((contact.angle * Math.PI) / 180)}
                r={1.8}
                fill="var(--color-signal)"
                fillOpacity={0.55}
              />
            ))}
          </svg>

          {width > 0
            ? orbitLinks.map((link) => {
                const placement = link.orbit;
                if (!placement) return null;
                const ring = RINGS[placement.ring];
                const angles = [angle0, angle1, angle2];
                return (
                  <OrbitNode
                    key={link.id}
                    link={link}
                    angle={angles[placement.ring]}
                    base={placement.angle}
                    radius={ring.radius * scale}
                    size={nodeSize}
                    index={indexOf(link)}
                    highlighted={hoveredId === link.id}
                    onHover={onHover}
                    navigate={navigate}
                  />
                );
              })
            : null}

          <a
            href="#top"
            aria-label={`${profile.name} — back to top`}
            className="absolute left-1/2 top-1/2 z-20 flex h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-signal text-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] focus-visible:scale-[1.05] active:scale-[0.98]"
          >
            <span className="absolute -inset-2 rounded-full border border-ink/15" aria-hidden="true" />
            <span className="spin-slow absolute -inset-4 rounded-full border border-dashed border-ink/20" aria-hidden="true" />
            <span className="display text-[clamp(1.1rem,2.6vw,1.75rem)] leading-none tracking-[-0.06em]">
              {profile.monogram.replace(/\.$/, "")}
              <span className="text-paper/50">.</span>
            </span>
          </a>
        </motion.div>
      </div>

      <div className="mt-2.5 flex items-center justify-between px-0.5">
        <span className="meta-label text-muted">
          Scope / {profile.coordinates.split(" · ")[0]}
        </span>
        <span className="meta-label hidden items-center gap-2 text-muted sm:flex">
          <span className="h-px w-5 bg-ink/25" aria-hidden="true" />
          Drag to spin
        </span>
      </div>
    </div>
  );
}

type OrbitNodeProps = {
  link: LinkItem;
  angle: MotionValue<number>;
  base: number;
  radius: number;
  size: number;
  index: string;
  highlighted: boolean;
  onHover: (id: string | null) => void;
  navigate: ReturnType<typeof useExitNavigation>["navigate"];
};

const OrbitNode = memo(function OrbitNode({
  link,
  angle,
  base,
  radius,
  size,
  index,
  highlighted,
  onHover,
  navigate,
}: OrbitNodeProps) {
  const x = useTransform(angle, (value) => radius * Math.cos(((value + base) * Math.PI) / 180));
  const y = useTransform(angle, (value) => radius * Math.sin(((value + base) * Math.PI) / 180));

  return (
    <motion.div
      style={{ x, y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      className="absolute left-1/2 top-1/2 z-10"
    >
      <a
        href={link.href}
        aria-label={`${link.name} — ${link.meta}`}
        onPointerEnter={() => onHover(link.id)}
        onPointerLeave={() => onHover(null)}
        onFocus={() => onHover(link.id)}
        onBlur={() => onHover(null)}
        onClick={(event) => {
          if (!shouldIntercept(event, link.href)) return;
          event.preventDefault();
          navigate({ href: link.href, name: link.name, index });
        }}
        className={cx(
          "group relative flex h-full w-full cursor-pointer items-center justify-center rounded-full border bg-surface text-ink/75 transition-[transform,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.08] hover:border-signal hover:bg-paper hover:text-signal focus-visible:scale-[1.08] focus-visible:border-signal focus-visible:text-signal",
          highlighted
            ? "scale-[1.08] border-signal bg-signal text-paper hover:bg-signal hover:text-paper"
            : "border-ink/20",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute -inset-[5px] rounded-full border transition-colors duration-500",
            highlighted ? "border-signal/40" : "border-transparent group-hover:border-signal/40",
          )}
        />

        {link.brand ? (
          <BrandIcon brand={link.brand} className="h-[44%] w-[44%]" />
        ) : (
          <span
            className="display lowercase leading-none"
            style={{ fontSize: size * 0.42 }}
            aria-hidden="true"
          >
            {link.glyph}
          </span>
        )}

        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute left-1/2 top-[calc(100%+9px)] -translate-x-1/2 whitespace-nowrap border border-ink/15 bg-ink px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-paper transition-opacity duration-300",
            highlighted
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        >
          {link.name}
        </span>
      </a>
    </motion.div>
  );
});
