import { stack } from "../data";

export function Ticker() {
  return (
    <section aria-labelledby="ticker-label" className="border-b border-border bg-well/70">
      <div className="flex items-stretch">
        <div className="hidden shrink-0 items-center gap-2 border-r border-border px-5 md:flex md:px-8">
          <span className="block h-1 w-1 bg-signal" aria-hidden="true" />
          <h2 id="ticker-label" className="meta-label text-signal">
            Focus
          </h2>
        </div>

        <div className="marquee relative flex-1 py-3 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div className="marquee-track items-center">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0 items-center"
              >
                {stack.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center gap-5 whitespace-nowrap px-5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink/55"
                  >
                    <span className="h-1 w-1 shrink-0 bg-signal/70" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
