import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { allLinks, profile } from "../data";

const STORAGE_KEY = "harsh-shah:seen";

function hasVisited() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

const pad = (value: number) => String(value).padStart(2, "0");

export function Intro() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(() => !reduce && !hasVisited());
  const [count, setCount] = useState(0);
  const total = allLinks.length;

  useEffect(() => {
    if (!open) return;

    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage unavailable; the intro simply plays again next visit.
    }

    const duration = 820;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setCount(Math.round(progress * total));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    const close = window.setTimeout(() => setOpen(false), 1180);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(close);
    };
  }, [open, total]);

  const progress = total === 0 ? 0 : count / total;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col justify-between bg-paper px-5 py-6 text-ink md:px-8 md:py-8"
          initial={false}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="meta-label flex items-center justify-between text-muted">
            <span className="flex items-center gap-3">
              <span className="status-ping relative block h-1.5 w-1.5 rounded-full bg-signal text-signal" />
              {profile.name} — personal index
            </span>
            <span>Boot / 001</span>
          </div>

          <div className="grid flex-1 items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <p className="display text-[clamp(4rem,12vw,9rem)] uppercase leading-[0.8] tracking-[-0.05em]">
                H<span className="outline-type">S</span>
                <span className="text-signal">.</span>
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-10 bg-signal" aria-hidden="true" />
                <p className="meta-label text-muted">Mounting destinations</p>
              </div>
              <div className="mt-6 space-y-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
                <p>
                  <span className="text-signal">›</span> index.ready
                </p>
                <p>
                  <span className="text-signal">›</span> orbit.sync
                </p>
                <p>
                  <span className="text-signal">›</span> uplink.open
                </p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="tabular font-mono text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
                {pad(count)}
                <span className="text-muted/60">/{pad(total)}</span>
              </p>
              <p className="meta-label mt-3 text-muted">Destinations</p>
            </div>
          </div>

          <div>
            <div className="meta-label flex items-center justify-between text-muted">
              <span>Calibrating orbit</span>
              <span className="tabular">{Math.round(progress * 100)}%</span>
            </div>
            <div className="mt-3 h-px w-full overflow-hidden bg-ink/15">
              <motion.div
                className="h-full origin-left bg-signal"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
