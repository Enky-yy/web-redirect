import { memo } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { allLinks, profile } from "../data";
import { useCopy } from "../hooks/useCopy";
import { useLocalTime } from "../hooks/useLocalTime";
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
    <div className="flex flex-col items-start gap-2.5">
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
          "inline-flex min-w-[150px] items-center justify-center gap-2.5 border px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors duration-300 active:translate-y-px",
          state === "copied"
            ? "border-paper bg-paper text-signal"
            : state === "error"
              ? "border-paper text-paper"
              : "border-paper/40 text-paper/80 hover:bg-paper hover:text-signal",
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
          "font-mono text-[8px] uppercase tracking-[0.16em]",
          state === "error" ? "text-paper underline" : "text-paper/60",
        )}
      >
        {note}
      </p>
    </div>
  );
}

const LocalTime = memo(function LocalTime() {
  const time = useLocalTime(profile.timeZone);

  return (
    <span className="tabular font-mono text-[10px] leading-none tracking-[0.06em] text-paper/80">
      {time}
      <span className="ml-1.5 text-[8px] uppercase tracking-[0.14em] text-paper/60">
        {profile.timeZoneLabel}
      </span>
    </span>
  );
});

const channels = [
  {
    id: "mail",
    label: "Mail",
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
  },
  ...["github", "discord", "instagram"].map((id) => {
    const link = allLinks.find((item) => item.id === id);
    return {
      id,
      label: link?.name ?? id,
      value: `${link?.handle ?? ""}@${(link?.name ?? id).toLowerCase()}`,
      href: link?.href ?? "#",
      external: true,
    };
  }),
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative border-b border-ink/10">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-14 md:px-8 md:py-20">
        <div className="on-signal relative overflow-hidden border border-ink/20 bg-glacier text-paper">
          <div
            aria-hidden="true"
            className="panel-grid-ink pointer-events-none absolute inset-0 opacity-70"
          />

          <div className="relative px-5 pt-6 md:px-10 md:pt-8">
            <div className="flex items-center justify-between border-b border-paper/20 pb-3">
              <div className="flex items-center gap-3">
                <span className="meta-label text-paper/65">02</span>
                <span className="meta-label text-paper/65">Contact</span>
              </div>
              <span className="meta-label flex items-center gap-2 text-paper/65">
                <span className="status-ping relative block h-1.5 w-1.5 rounded-full bg-paper text-paper" />
                Channel open
              </span>
            </div>

            <div className="grid gap-10 py-9 md:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div>
                <h2
                  id="contact-title"
                  className="display text-[clamp(2.9rem,7vw,5.8rem)] uppercase leading-[0.82] tracking-[-0.045em]"
                >
                  Say
                  <br />
                  hello<span className="text-paper/30">.</span>
                </h2>

                <p className="mt-6 max-w-[34ch] text-[14px] leading-[1.65] text-paper/70">
                  Internships, collaborations, or something you are stuck on. Mail is fastest;
                  Discord is a close second.
                </p>

                <div className="mt-7 flex flex-col items-start gap-4">
                  <a
                    href={`mailto:${profile.email}`}
                    className="link-sweep group inline-flex max-w-full items-baseline gap-2.5"
                  >
                    <span className="break-all font-mono text-[clamp(0.9rem,2.4vw,1.2rem)] leading-none tracking-[-0.01em]">
                      {profile.email}
                    </span>
                    <ArrowUpRight
                      size={16}
                      weight="light"
                      className="shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>

                  <CopyEmail />
                </div>
              </div>

              <div className="lg:self-end">
                <p className="meta-label text-paper/60">Direct channels</p>

                <ul className="mt-3 border-t border-paper/20">
                  {channels.map((channel) => (
                    <li key={channel.id}>
                      <a
                        href={channel.href}
                        target={channel.external ? "_blank" : undefined}
                        rel={channel.external ? "noreferrer" : undefined}
                        className="group flex items-baseline gap-3 border-b border-paper/20 py-3.5"
                      >
                        <span className="w-14 shrink-0 font-mono text-[8px] uppercase leading-none tracking-[0.18em] text-paper/60">
                          {channel.label}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-mono text-[11px] leading-none tracking-[0.01em] text-paper/90">
                          {channel.value}
                        </span>
                        <ArrowUpRight
                          size={13}
                          weight="light"
                          className="shrink-0 self-center text-paper/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-paper/60">
                  No forms. No funnels. Just mail.
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col gap-2.5 border-t border-paper/20 px-5 py-3.5 md:flex-row md:items-center md:justify-between md:px-10">
            <span className="meta-label tabular text-paper/60">
              Varanasi, India — {profile.coordinates}
            </span>
            <div className="flex items-center gap-3">
              <span className="meta-label hidden text-paper/60 sm:inline">Local time</span>
              <span className="hidden h-3 w-px bg-paper/25 sm:block" aria-hidden="true" />
              <LocalTime />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
