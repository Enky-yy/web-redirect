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
      className="fixed inset-0 z-[80] flex flex-col justify-between overflow-hidden bg-signal px-5 py-6 text-white md:px-8 md:py-8"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.44, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-center justify-between">
        <span className="meta-label flex items-center gap-2 text-white/75">
          <span className="block h-1 w-1 bg-white" aria-hidden="true" />
          Leaving the index
        </span>
        <span className="meta-label tabular text-white/75">{target.index}</span>
      </div>

      <div className="flex flex-1 items-center">
        <div className="w-full border-t border-white/25 pt-8">
          <span className="meta-label text-white/75">Opening</span>
          <p className="display mt-4 text-[clamp(2.6rem,9vw,7rem)] uppercase leading-[0.84] tracking-[-0.045em]">
            {target.name}
            <span className="text-white/50">.</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/25 pt-5">
        <span className="meta-label text-white/75">Taking you there</span>
        <motion.span
          className="block h-px w-24 origin-left bg-white md:w-40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}
