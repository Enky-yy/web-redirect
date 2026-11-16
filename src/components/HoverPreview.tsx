import { createPortal } from "react-dom";
import { AnimatePresence, motion, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { LinkItem } from "../data";
import { cx } from "../lib/cx";

type HoverPreviewProps = {
  link: LinkItem | null;
  groupLabel: string;
  index: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  flip: boolean;
  enabled: boolean;
};

export function HoverPreview({
  link,
  groupLabel,
  index,
  x,
  y,
  flip,
  enabled,
}: HoverPreviewProps) {
  const clampedX = useTransform(x, (value) => {
    const width = typeof window === "undefined" ? 1280 : window.innerWidth;
    return Math.max(168, Math.min(width - 168, value));
  });

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {link && enabled ? (
        <motion.div
          key="preview"
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
          style={{ x: clampedX, y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-hidden="true"
        >
          <div
            className={cx(
              "relative w-[300px] -translate-x-1/2",
              flip ? "translate-y-7" : "-translate-y-[calc(100%+22px)]",
            )}
          >
            <div className="rotate-[-1.4deg]">
              <motion.div
                key={link.id}
                initial={{ opacity: 0.4, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-[300px] border border-paper/10 bg-ink p-5 text-paper shadow-[0_30px_70px_-30px_rgba(20,19,15,0.55)]"
              >
                <span className="absolute inset-x-0 top-0 h-[2px] bg-rust" />

                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-paper/45">
                  <span>{groupLabel}</span>
                  <span className="tabular">{index}</span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <span className="font-serif text-[4rem] italic leading-[0.78]">{link.glyph}</span>
                  <span className="flex items-center gap-1 pb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/70">
                    Open
                    <ArrowUpRight size={12} weight="light" />
                  </span>
                </div>

                <div className="mt-5 border-t border-paper/15 pt-4">
                  <p className="font-serif text-[1.6rem] leading-none">{link.name}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-paper/55">{link.description}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
