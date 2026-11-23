import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import { profile } from "../data";

/**
 * A dotted wireframe globe rendered as ASCII.
 *
 * The grid is sized so the sphere reads as a circle: monospace cells are
 * roughly 0.6em wide and 1em tall, so the horizontal scale is 1 / 0.6 of the
 * vertical scale. Frames are painted at ~11fps — ASCII reads better slightly
 * stepped than at 60fps.
 */
const ROWS = 28;
const COLS = 46;
const ROW_SCALE = 12.0;
const COL_SCALE = ROW_SCALE / 0.6;
const CENTER_X = COLS / 2;
const CENTER_Y = ROWS / 2;

const BASE_TILT = 20;
const SPIN_PERIOD = 36_000;
const FRAME_INTERVAL = 90;
const PIN = { lat: profile.latitude, lon: profile.longitude };

type Frame = { art: string; pin: string };

const blankGrid = () =>
  Array.from({ length: ROWS }, () => new Array<string>(COLS).fill(" "));

const gridToText = (grid: string[][]) =>
  grid.map((row) => row.join("").replace(/\s+$/, "")).join("\n");

function plot(grid: string[][], col: number, row: number, char: string) {
  const x = Math.round(col);
  const y = Math.round(row);
  if (y >= 0 && y < ROWS && x >= 0 && x < COLS) grid[y][x] = char;
}

/** Connect two projected points so curves stay continuous across the cell grid. */
function drawLine(
  grid: string[][],
  fromCol: number,
  fromRow: number,
  toCol: number,
  toRow: number,
  char: string,
) {
  const steps = Math.max(
    1,
    Math.ceil(Math.max(Math.abs(toCol - fromCol), Math.abs(toRow - fromRow)) * 2),
  );
  for (let step = 0; step <= steps; step += 1) {
    const t = step / steps;
    plot(grid, fromCol + (toCol - fromCol) * t, fromRow + (toRow - fromRow) * t, char);
  }
}

function renderFrame(spinDeg: number, tiltDeg: number, pinChar: string): Frame {
  const art = blankGrid();
  const pin = blankGrid();

  const spin = (spinDeg * Math.PI) / 180;
  const tilt = (tiltDeg * Math.PI) / 180;
  const cosSpin = Math.cos(spin);
  const sinSpin = Math.sin(spin);
  const cosTilt = Math.cos(tilt);
  const sinTilt = Math.sin(tilt);

  const project = (lat: number, lon: number) => {
    const phi = (lat * Math.PI) / 180;
    const lambda = (lon * Math.PI) / 180;
    const cosPhi = Math.cos(phi);

    const x = cosPhi * Math.cos(lambda);
    const y = Math.sin(phi);
    const z = cosPhi * Math.sin(lambda);

    const spunX = x * cosSpin - z * sinSpin;
    const spunZ = x * sinSpin + z * cosSpin;

    const tiltedY = y * cosTilt - spunZ * sinTilt;
    const depth = y * sinTilt + spunZ * cosTilt;

    return {
      col: CENTER_X + spunX * COL_SCALE,
      row: CENTER_Y - tiltedY * ROW_SCALE,
      depth,
    };
  };

  // Meridians: walk each line in 2° steps and connect the projections.
  for (let lon = 0; lon < 360; lon += 30) {
    let previous: ReturnType<typeof project> | null = null;
    for (let lat = -72; lat <= 72; lat += 2) {
      const point = project(lat, lon);
      if (previous && previous.depth > 0.01 && point.depth > 0.01) {
        drawLine(art, previous.col, previous.row, point.col, point.row, ".");
      }
      previous = point;
    }
  }

  // Latitude rings: same treatment, a slightly brighter dot.
  for (let lat = -75; lat <= 75; lat += 25) {
    let previous: ReturnType<typeof project> | null = null;
    for (let lon = 0; lon <= 360; lon += 2) {
      const point = project(lat, lon);
      if (previous && previous.depth > 0.01 && point.depth > 0.01) {
        drawLine(art, previous.col, previous.row, point.col, point.row, "·");
      }
      previous = point;
    }
  }

  // Silhouette: under orthographic projection the limb is always this circle.
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const x = (col + 0.5 - CENTER_X) / COL_SCALE;
      const y = -(row + 0.5 - CENTER_Y) / ROW_SCALE;
      const distance = Math.hypot(x, y);
      if (distance > 0.95 && distance <= 1) art[row][col] = ".";
    }
  }

  const marker = project(PIN.lat, PIN.lon);
  if (marker.depth > 0.02) plot(pin, marker.col, marker.row, pinChar);

  return { art: gridToText(art), pin: gridToText(pin) };
}

const ART_CLASS =
  "m-0 select-none whitespace-pre font-mono text-[8px] leading-none tracking-normal";

export function MeridianGlobe() {
  const reduce = useReducedMotion() === true;
  const [frame, setFrame] = useState<Frame>(() => renderFrame(0, BASE_TILT, "×"));
  const artRef = useRef<HTMLPreElement>(null);
  const tiltTarget = useRef(BASE_TILT);
  const spinTarget = useRef(0);

  useEffect(() => {
    if (reduce) return;

    let raf = 0;
    let last = 0;
    let lastPaint = 0;
    let spin = 0;
    let tilt = BASE_TILT;
    let offset = 0;
    let onScreen = true;

    const tick = (now: number) => {
      if (!last) last = now;
      const delta = Math.min(now - last, 120);
      last = now;

      spin = (spin + (delta / SPIN_PERIOD) * 360) % 360;

      const ease = 1 - Math.exp(-delta / 140);
      tilt += (tiltTarget.current - tilt) * ease;
      offset += (spinTarget.current - offset) * ease;

      if (now - lastPaint >= FRAME_INTERVAL) {
        lastPaint = now;
        setFrame(renderFrame(spin + offset, tilt, now % 2800 < 1400 ? "×" : "+"));
      }

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 },
    );
    if (artRef.current) observer.observe(artRef.current);

    start();

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reduce]);

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    spinTarget.current = x * 30;
    tiltTarget.current = BASE_TILT + y * 16;
  };

  const onPointerLeave = () => {
    spinTarget.current = 0;
    tiltTarget.current = BASE_TILT;
  };

  return (
    <figure className="mb-9 border-y border-ink/15">
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="meta-label flex items-center gap-2 text-ink/55">
          <span className="block h-1 w-1 bg-signal" aria-hidden="true" />
          Meridian
        </span>
        <span className="meta-label text-ink/40">Pin / live</span>
      </div>

      <div
        role="img"
        aria-label={`ASCII wireframe globe of the Earth with a pin on ${profile.location} at ${profile.latitude} degrees north, ${profile.longitude} degrees east.`}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative cursor-crosshair overflow-hidden px-2 py-4"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-paper/30 [mask-image:radial-gradient(closest-side,black,transparent)]"
        />
        <div className="relative mx-auto w-max">
          <pre ref={artRef} aria-hidden="true" className={`${ART_CLASS} text-ink/70`}>
            {frame.art}
          </pre>
          <pre
            aria-hidden="true"
            className={`${ART_CLASS} pointer-events-none absolute inset-0 text-signal`}
          >
            {frame.pin}
          </pre>
        </div>
      </div>

      <figcaption className="flex items-center justify-between gap-6 border-t border-ink/15 py-2">
        <span className="tabular whitespace-nowrap font-mono text-[9px] tracking-[0.06em] text-ink/45">
          {profile.coordinates}
        </span>
        <span className="meta-label hidden whitespace-nowrap text-ink/35 sm:inline">
          Hover to tilt
        </span>
      </figcaption>
    </figure>
  );
}
