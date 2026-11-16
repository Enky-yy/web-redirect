import { ArrowUp } from "@phosphor-icons/react";
import { profile } from "../data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-5 py-7 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-4">
          <span className="font-serif text-2xl italic leading-none">{profile.monogram}</span>
          <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted">
            © {year} {profile.name} · {profile.location}
          </p>
        </div>

        <p className="meta-label text-muted">{profile.footerNote}</p>

        <div className="flex items-center gap-6">
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-muted sm:inline">
            Set in Instrument Serif &amp; Geist
          </span>
          <a
            href="#top"
            className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
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
    </footer>
  );
}
