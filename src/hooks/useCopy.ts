import { useCallback, useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "error";

export function useCopy(resetAfter = 2200) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const field = document.createElement("textarea");
          field.value = text;
          field.setAttribute("readonly", "");
          field.style.position = "fixed";
          field.style.opacity = "0";
          document.body.appendChild(field);
          field.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(field);
          if (!ok) throw new Error("copy failed");
        }
        setState("copied");
      } catch {
        setState("error");
      }

      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState("idle"), resetAfter);
    },
    [resetAfter],
  );

  return { state, copy };
}
