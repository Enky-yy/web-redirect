import { ArrowUp } from "@phosphor-icons/react";
import { profile } from "../data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper">
      <div className="mx-auto w-full max-w-[1500px] px-5 md:px-8">
        <div className="flex flex-col gap-6 border-t border-ink/10 py-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex h-8 w-8 items-center justify-center border border-ink/20 font-mono text-[9px] uppercase leading-none tracking-[0.08em] text-ink">
              HS
            </span>
            <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted">
              © {year} {profile.name}
              <span className="mx-2 text-ink/25" aria-hidden="true">
                /
              </span>
              {profile.location}
            </p>
          </div>

          <p className="meta-label text-muted">{profile.footerNote}</p>

          <div className="flex items-center gap-6">
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-muted/70 sm:inline">
              Set in Bricolage Grotesque &amp; Geist
            </span>
            <a
              href="#top"
              className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-signal"
            >
              Back to top
              <ArrowUp
                size={12}
                weight="light"
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
