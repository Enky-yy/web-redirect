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
      // Private mode; the intro simply plays again next visit.
    }

    const duration = 700;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setCount(Math.round(progress * total));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    const close = window.setTimeout(() => setOpen(false), 1040);

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
          className="fixed inset-0 z-[70] flex flex-col justify-between bg-paper px-5 py-6 text-ink md:px-10 md:py-9"
          initial={false}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.58, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="meta-label flex items-center justify-between text-muted">
            <span>
              {profile.name} — {profile.overline}
            </span>
            <span>{profile.volume}</span>
          </div>

          <div className="flex flex-1 items-center justify-between gap-6">
            <div>
              <p className="font-serif text-[clamp(5rem,15vw,12rem)] leading-[0.78] tracking-tight">
                {profile.monogram.replace(/\.$/, "")}
                <span className="text-rust">.</span>
              </p>
              <p className="meta-label mt-7 text-muted">Filing the index</p>
            </div>
            <div className="text-right">
              <p className="tabular font-mono text-[clamp(2.25rem,6vw,4.5rem)] leading-none">
                {String(count).padStart(2, "0")}
                <span className="text-muted">/{String(total).padStart(2, "0")}</span>
              </p>
              <p className="meta-label mt-3 text-muted">Destinations</p>
            </div>
          </div>

          <div>
            <div className="h-px w-full overflow-hidden bg-ink/15">
              <motion.div
                className="h-full origin-left bg-rust"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
            <div className="meta-label mt-4 flex items-center justify-between text-muted">
              <span>Loading destinations</span>
              <span className="tabular">{Math.round(progress * 100)}%</span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
