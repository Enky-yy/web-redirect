import { motion, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { profile } from "../data";
import { useCopy } from "../hooks/useCopy";
import { usePointerFine } from "../hooks/usePointerFine";
import { cx } from "../lib/cx";

function CopyEmail() {
  const { state, copy } = useCopy();
  const fine = usePointerFine();
  const reduce = useReducedMotion() === true;

  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 });

  const note =
    state === "copied"
      ? "Copied to the clipboard."
      : state === "error"
        ? "Clipboard blocked — select the address above."
        : "Replies usually land within two days.";

  return (
    <div className="flex flex-col items-start gap-3">
      <motion.button
        type="button"
        onClick={() => copy(profile.email)}
        onPointerMove={(event) => {
          if (!fine || reduce) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const dx = (event.clientX - rect.left - rect.width / 2) * 0.28;
          const dy = (event.clientY - rect.top - rect.height / 2) * 0.28;
          x.set(Math.max(-7, Math.min(7, dx)));
          y.set(Math.max(-5, Math.min(5, dy)));
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
        whileTap={{ scale: 0.98 }}
        style={{ x, y }}
        className={cx(
          "inline-flex min-w-[158px] items-center justify-center gap-2.5 border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 active:translate-y-px",
          state === "copied"
            ? "border-paper bg-paper text-signal"
            : state === "error"
              ? "border-paper text-paper"
              : "border-paper/40 text-paper hover:bg-paper hover:text-signal",
        )}
      >
        {state === "copied" ? (
          <Check size={13} weight="light" aria-hidden="true" />
        ) : (
          <Copy size={13} weight="light" aria-hidden="true" />
        )}
        {state === "copied" ? "Copied" : state === "error" ? "Try again" : "Copy email"}
      </motion.button>

      <p
        aria-live="polite"
        className={cx(
          "font-mono text-[9px] uppercase tracking-[0.16em]",
          state === "error" ? "text-paper underline" : "text-paper/60",
        )}
      >
        {note}
      </p>
    </div>
  );
}

const details = [
  { label: "Open to", value: "AI engineering internships" },
  { label: "Also", value: "Open-source collaborations" },
  { label: "Based", value: "Varanasi, India · IST" },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-signal relative bg-signal text-paper">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-16 md:px-8 md:py-24">
        <div className="flex items-center justify-between border-b border-paper/20 pb-3.5">
          <div className="flex items-center gap-3">
            <span className="meta-label text-paper/65">02</span>
            <span className="meta-label text-paper/65">Contact</span>
          </div>
          <span className="meta-label flex items-center gap-2 text-paper/65">
            <span className="status-ping relative block h-1.5 w-1.5 rounded-full bg-paper text-paper" />
            Channel open
          </span>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <h2
              id="contact-title"
              className="display text-[clamp(3rem,8.4vw,7rem)] uppercase leading-[0.82] tracking-[-0.045em]"
            >
              Say
              <br />
              hello<span className="text-paper/40">.</span>
            </h2>

            <p className="mt-7 max-w-[40ch] text-[15px] leading-[1.65] text-paper/70">
              Open to AI engineering internships and open-source work. Mail is the fastest way
              to reach me — if you would rather talk, say so and we can set up a call.
            </p>

            <div className="mt-9 flex flex-col items-start gap-5">
              <a
                href={`mailto:${profile.email}`}
                className="link-sweep group inline-flex max-w-full items-baseline gap-3"
              >
                <span className="break-all font-mono text-[clamp(0.95rem,2.8vw,1.6rem)] leading-none tracking-[-0.01em]">
                  {profile.email}
                </span>
                <ArrowUpRight
                  size={18}
                  weight="light"
                  className="shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>

              {profile.whatsapp ? (
                <a
                  href={profile.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/70 transition-colors duration-300 hover:text-paper"
                >
                  <span className="h-1 w-1 bg-paper" aria-hidden="true" />
                  WhatsApp
                  <ArrowUpRight
                    size={12}
                    weight="light"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : null}

              <CopyEmail />
            </div>
          </div>

          <dl className="border-t border-paper/25">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 border-b border-paper/20 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <dt className="meta-label text-paper/60">{item.label}</dt>
                <dd className="font-mono text-[11px] leading-relaxed text-paper sm:text-right">
                  {item.value}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-6 py-4">
              <dt className="meta-label text-paper/60">Coordinates</dt>
              <dd className="tabular font-mono text-[10px] text-paper/85">{profile.coordinates}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
