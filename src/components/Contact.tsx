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
        : "Usually replies within a day or two.";

  return (
    <div className="flex flex-col items-start gap-4">
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
          "inline-flex min-w-[150px] items-center justify-center gap-2.5 border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300",
          state === "copied"
            ? "border-rust bg-rust text-paper"
            : state === "error"
              ? "border-rust text-rust"
              : "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
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
          state === "error" ? "text-rust" : "text-muted",
        )}
      >
        {note}
      </p>
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-b border-ink/10">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="meta-label text-rust">04</span>
              <span className="meta-label text-muted">Contact</span>
            </div>

            <h2
              id="contact-title"
              className="mt-6 font-serif text-[clamp(3.2rem,8vw,6.25rem)] leading-[0.86] tracking-[-0.015em]"
            >
              Say <span className="italic text-rust">hello</span>.
            </h2>

            <p className="mt-7 max-w-[38ch] text-[1.0625rem] leading-[1.65] text-ink/65">
              I am looking for AI engineering internships and open-source collaborators. If you
              are working on machine learning, agents, or automation, I would like to hear about
              it.
            </p>
          </div>

          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col items-start gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="mail-link group relative inline-flex max-w-full items-center gap-3 font-serif text-[clamp(1.7rem,4.4vw,3.4rem)] leading-none tracking-[-0.01em]"
              >
                <span className="break-all">{profile.email}</span>
                <ArrowUpRight
                  size={22}
                  weight="light"
                  className="shrink-0 text-rust transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>

              {profile.whatsapp ? (
                <a
                  href={profile.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-ink"
                >
                  <span className="h-1 w-1 rounded-full bg-rust" aria-hidden="true" />
                  WhatsApp
                  <ArrowUpRight
                    size={12}
                    weight="light"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : null}
            </div>

            <CopyEmail />
          </div>
        </div>
      </div>
    </section>
  );
}
