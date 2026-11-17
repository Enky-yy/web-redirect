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
            ? "border-signal bg-signal text-paper"
            : state === "error"
              ? "border-signal text-signal"
              : "border-ink/30 text-ink/75 hover:border-signal hover:bg-signal hover:text-paper",
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
          state === "error" ? "text-signal underline" : "text-ink/50",
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
    <span className="tabular font-mono text-[10px] leading-none tracking-[0.06em] text-ink/80">
      {time}
      <span className="ml-1.5 text-[8px] uppercase tracking-[0.14em] text-ink/45">
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
        <div className="sunset-panel relative overflow-hidden border border-ink/15 text-ink">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-signal via-ember to-signal"
          />
          <div
            aria-hidden="true"
            className="panel-grid pointer-events-none absolute inset-0 opacity-80"
          />

          <div className="relative px-5 pt-6 md:px-10 md:pt-8">
            <div className="flex items-center justify-between border-b border-ink/15 pb-3">
              <div className="flex items-center gap-3">
                <span className="meta-label text-ink/50">02</span>
                <span className="meta-label text-ink/50">Contact</span>
              </div>
              <span className="meta-label flex items-center gap-2 text-ink/50">
                <span className="status-ping relative block h-1.5 w-1.5 rounded-full bg-signal text-signal" />
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
                  hello<span className="text-ember">.</span>
                </h2>

                <p className="mt-6 max-w-[34ch] text-[14px] leading-[1.65] text-ink/65">
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
                <p className="meta-label text-ink/50">Direct channels</p>

                <ul className="mt-3 border-t border-ink/15">
                  {channels.map((channel) => (
                    <li key={channel.id}>
                      <a
                        href={channel.href}
                        target={channel.external ? "_blank" : undefined}
                        rel={channel.external ? "noreferrer" : undefined}
                        className="group flex items-baseline gap-3 border-b border-ink/15 py-3.5"
                      >
                        <span className="w-14 shrink-0 font-mono text-[8px] uppercase leading-none tracking-[0.18em] text-ink/50">
                          {channel.label}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-mono text-[11px] leading-none tracking-[0.01em] text-ink/90">
                          {channel.value}
                        </span>
                        <ArrowUpRight
                          size={13}
                          weight="light"
                          className="shrink-0 self-center text-ink/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-ink/50">
                  No forms. No funnels. Just mail.
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col gap-2.5 border-t border-ink/15 px-5 py-3.5 md:flex-row md:items-center md:justify-between md:px-10">
            <span className="meta-label tabular text-ink/50">
              <span className="hidden sm:inline">Varanasi, India — </span>
              {profile.coordinates}
            </span>
            <div className="flex items-center gap-3">
              <span className="meta-label hidden text-ink/45 sm:inline">Local time</span>
              <span className="hidden h-3 w-px bg-ink/20 sm:block" aria-hidden="true" />
              <LocalTime />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
