import { memo } from "react";
import { now } from "../data";
import { cx } from "../lib/cx";

const Equalizer = memo(function Equalizer() {
  return (
    <span className="flex h-[11px] items-end gap-[2px] text-rust" aria-hidden="true">
      <span className="eq-bar" />
      <span className="eq-bar" />
      <span className="eq-bar" />
      <span className="eq-bar" />
    </span>
  );
});

export function NowStrip() {
  return (
    <section id="now" aria-labelledby="now-title" className="bg-ink text-paper">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col gap-4 border-b border-paper/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="mt-1.5 font-mono text-[10px] leading-none tracking-[0.18em] text-rust">02</span>
            <h2 id="now-title" className="font-serif text-[clamp(2.4rem,5vw,3.5rem)] leading-[0.9]">
              Now
            </h2>
          </div>
          <p className="meta-label text-paper/40">A snapshot, not a feed — November 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {now.map((item, index) => (
            <article
              key={item.id}
              className={cx(
                "py-8 md:py-12",
                index > 0 &&
                  "border-t border-paper/15 md:border-l md:border-t-0 md:pl-8 lg:pl-12",
              )}
            >
              <div className="flex items-center gap-2.5">
                {index === 0 ? (
                  <Equalizer />
                ) : (
                  <span className="h-1.5 w-1.5 bg-rust" aria-hidden="true" />
                )}
                <span className="meta-label text-rust">{item.label}</span>
              </div>

              <p className="mt-6 font-serif text-[clamp(2rem,3.4vw,2.9rem)] leading-[0.95] tracking-[-0.01em]">
                {item.value}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">
                {item.meta}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
