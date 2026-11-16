import { useId } from "react";
import { uses } from "../data";

export function Uses() {
  const headingId = useId();

  return (
    <section id="uses" aria-labelledby={headingId} className="border-b border-ink/10">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="mt-1.5 font-mono text-[10px] leading-none tracking-[0.18em] text-rust">
              03
            </span>
            <h2
              id={headingId}
              className="font-serif text-[clamp(2.4rem,5vw,3.5rem)] leading-[0.9]"
            >
              Daily drivers
            </h2>
          </div>
          <p className="meta-label text-muted">The stack behind the work — November 2026</p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pt-8 lg:grid-cols-4 lg:gap-x-10">
          {uses.map((group, index) => (
            <div key={group.id} className="border-t border-ink/10 pt-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="meta-label text-ink">{group.label}</h3>
                <span className="tabular font-mono text-[9px] leading-none text-rust">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <ul className="mt-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group flex items-baseline gap-2.5 border-b border-ink/10 py-2 text-[13px] leading-snug text-ink/80 transition-colors duration-300 last:border-b-0 hover:text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 shrink-0 rounded-full bg-ink/25 transition-colors duration-300 group-hover:bg-rust"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
