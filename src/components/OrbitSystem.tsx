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
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { allLinks, orbitLinks, profile, type LinkItem } from "../data";
import { useElementWidth } from "../hooks/useElementWidth";
import { usePointerFine } from "../hooks/usePointerFine";
import { useExitNavigation, shouldIntercept } from "../lib/exit";
import { cx } from "../lib/cx";
import { BrandIcon } from "./BrandIcon";

const DESIGN = 520;
const CENTER = DESIGN / 2;
const TILT = -14;
const RINGS = [
  { rx: 124, ry: 96, speed: 3.4 },
  { rx: 174, ry: 132, speed: -2.2 },
  { rx: 222, ry: 166, speed: 1.5 },
] as const;

const TICKS = Array.from({ length: 72 }, (_, index) => {
  const angle = (index * 5 * Math.PI) / 180;
  const major = index % 6 === 0;
  const start = major ? 1.035 : 1.02;
  const end = major ? 1.07 : 1.045;

  return {
    x1: CENTER + 240 * start * Math.cos(angle),
    y1: CENTER + 188 * start * Math.sin(angle),
    x2: CENTER + 240 * end * Math.cos(angle),
    y2: CENTER + 188 * end * Math.sin(angle),
    major,
  };
});

type OrbitProps = {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
};

export function OrbitSystem({ hoveredId, onHover }: OrbitProps) {
  const reduce = useReducedMotion() === true;
  const pointerFine = usePointerFine();
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

  const tiltX = useSpring(0, { stiffness: 90, damping: 20, mass: 0.7 });
  const tiltY = useSpring(0, { stiffness: 90, damping: 20, mass: 0.7 });

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

  const angleAt = useCallback((clientX: number, clientY: number) => {
    const rect = plateRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  }, [plateRef]);

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
    tiltX.set(0);
    tiltY.set(0);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerFine && !reduce && !dragging.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      tiltY.set(nx * 3.5);
      tiltX.set(ny * -2.5);
    }

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
  const nodeSize = width > 0 ? Math.max(34, Math.min(46, Math.round(46 * Math.max(0.8, scale)))) : 44;
  const indexOf = (link: LinkItem) => {
    const position = allLinks.findIndex((item) => item.id === link.id);
    return String(position + 1).padStart(2, "0");
  };

  return (
    <div
      ref={plateRef}
      role="group"
      aria-label="Featured destinations. Drag with a mouse to spin the orbit; the full index below is keyboard accessible."
      className={cx(
        "relative w-full max-w-[560px] touch-pan-y select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={(event) => {
        tiltX.set(0);
        tiltY.set(0);
        if (dragging.current) endDrag(event);
      }}
      onClickCapture={onClickCapture}
    >
      <motion.div
        className="relative aspect-square w-full"
        style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
        initial={{ opacity: 0, scale: 0.955 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg
          viewBox={`0 0 ${DESIGN} ${DESIGN}`}
          className="absolute inset-0 h-full w-full text-ink"
          aria-hidden="true"
        >
          <g transform={`rotate(${TILT} ${CENTER} ${CENTER})`}>
            {RINGS.map((ring, index) => (
              <ellipse
                key={ring.rx}
                cx={CENTER}
                cy={CENTER}
                rx={ring.rx}
                ry={ring.ry}
                fill="none"
                stroke="currentColor"
                strokeWidth={index === 1 ? 0.9 : 0.7}
                strokeOpacity={index === 0 ? 0.24 : index === 1 ? 0.14 : 0.16}
              />
            ))}

            <ellipse
              cx={CENTER}
              cy={CENTER}
              rx={238}
              ry={186}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.26}
              strokeWidth={0.9}
              strokeDasharray="1.5 5.5"
            />

            <circle cx={CENTER} cy={CENTER} r={58} fill="none" stroke="currentColor" strokeOpacity={0.1} />

            {TICKS.map((tick, index) => (
              <line
                key={index}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke="currentColor"
                strokeOpacity={tick.major ? 0.38 : 0.18}
                strokeWidth={tick.major ? 0.9 : 0.6}
              />
            ))}
          </g>
        </svg>

        {width > 0 ? (
          <>
            {orbitLinks.map((link) => {
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
                  rx={ring.rx * scale}
                  ry={ring.ry * scale}
                  tilt={TILT}
                  size={nodeSize}
                  index={indexOf(link)}
                  highlighted={hoveredId === link.id}
                  onHover={onHover}
                  navigate={navigate}
                />
              );
            })}
          </>
        ) : null}

        <a
          href="#top"
          aria-label="Back to top"
          className="absolute left-1/2 top-1/2 z-20 flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 hover:scale-[1.04] focus-visible:scale-[1.04]"
        >
          <span className="absolute -inset-2 rounded-full border border-ink/20" />
          <span className="spin-slow absolute -inset-4 rounded-full border border-dashed border-rust/35" />
          <span className="font-serif text-[clamp(1.5rem,3.2vw,2.5rem)] italic leading-none">
            {profile.monogram.replace(/\.$/, "")}
            <span className="text-rust">.</span>
          </span>
        </a>
      </motion.div>

      <div className="mt-3 flex items-center justify-between px-1">
        <span className="meta-label text-muted">Featured — {String(orbitLinks.length).padStart(2, "0")}</span>
        <span className="meta-label hidden text-muted md:inline">Drag to spin</span>
      </div>
    </div>
  );
}

type OrbitNodeProps = {
  link: LinkItem;
  angle: MotionValue<number>;
  base: number;
  rx: number;
  ry: number;
  tilt: number;
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
  rx,
  ry,
  tilt,
  size,
  index,
  highlighted,
  onHover,
  navigate,
}: OrbitNodeProps) {
  const x = useTransform(angle, (value) => {
    const theta = ((value + base) * Math.PI) / 180;
    const px = rx * Math.cos(theta);
    const py = ry * Math.sin(theta);
    const tiltRadians = (tilt * Math.PI) / 180;
    return px * Math.cos(tiltRadians) - py * Math.sin(tiltRadians);
  });

  const y = useTransform(angle, (value) => {
    const theta = ((value + base) * Math.PI) / 180;
    const px = rx * Math.cos(theta);
    const py = ry * Math.sin(theta);
    const tiltRadians = (tilt * Math.PI) / 180;
    return px * Math.sin(tiltRadians) + py * Math.cos(tiltRadians);
  });

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
          "group relative flex h-full w-full cursor-pointer items-center justify-center rounded-full border bg-paper text-ink transition-[transform,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.09] hover:border-ink hover:bg-ink hover:text-paper focus-visible:scale-[1.09] focus-visible:border-ink focus-visible:bg-ink focus-visible:text-paper",
          highlighted ? "scale-[1.09] border-ink bg-ink text-paper" : "border-ink/25",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute -inset-1.5 rounded-full border transition-colors duration-500",
            highlighted ? "border-rust/45" : "border-transparent group-hover:border-rust/45",
          )}
        />

        {link.brand ? (
          <BrandIcon brand={link.brand} className="h-[46%] w-[46%]" />
        ) : (
          <span className="font-serif italic leading-none" style={{ fontSize: size * 0.46 }}>
            {link.glyph}
          </span>
        )}

        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 whitespace-nowrap bg-ink px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-paper transition-opacity duration-300",
            highlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        >
          {link.name}
        </span>
      </a>
    </motion.div>
  );
});
