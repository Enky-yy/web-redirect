import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type ExitTarget = {
  href: string;
  name: string;
  index: string;
};

type ExitContextValue = {
  navigate: (target: ExitTarget) => void;
};

const ExitContext = createContext<ExitContextValue | null>(null);

export function ExitProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [target, setTarget] = useState<ExitTarget | null>(null);

  const navigate = useCallback(
    (next: ExitTarget) => {
      if (reduce) {
        window.location.assign(next.href);
        return;
      }
      setTarget(next);
    },
    [reduce],
  );

  useEffect(() => {
    if (!target) return;
    const id = window.setTimeout(() => {
      window.location.assign(target.href);
    }, 420);
    return () => window.clearTimeout(id);
  }, [target]);

  return (
    <ExitContext.Provider value={{ navigate }}>
      {children}
      <AnimatePresence>{target ? <ExitWipe target={target} /> : null}</AnimatePresence>
    </ExitContext.Provider>
  );
}

export function useExitNavigation() {
  const context = useContext(ExitContext);
  if (!context) throw new Error("useExitNavigation must be used inside ExitProvider");
  return context;
}

/** True for a plain left click on an http(s) link, the only case we animate. */
export function shouldIntercept(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
): boolean {
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (event.defaultPrevented) return false;
  return /^https?:\/\//i.test(href);
}

function ExitWipe({ target }: { target: ExitTarget }) {
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[80] flex flex-col justify-between overflow-hidden bg-ink px-6 py-7 text-paper md:px-10 md:py-9"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.44, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-center justify-between">
        <span className="meta-label text-paper/50">Leaving the index</span>
        <span className="meta-label tabular text-paper/50">{target.index}</span>
      </div>

      <div className="flex flex-1 items-center">
        <div className="w-full border-t border-paper/15 pt-8">
          <span className="meta-label text-rust">Opening</span>
          <p className="mt-4 font-serif text-[clamp(3.25rem,9vw,8rem)] leading-[0.88] tracking-tight">
            {target.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-paper/15 pt-5">
        <span className="meta-label text-paper/50">Taking you there</span>
        <motion.span
          className="block h-px w-24 origin-left bg-rust md:w-40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}
