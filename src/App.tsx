import { useState } from "react";
import { MotionConfig } from "motion/react";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Grain } from "./components/Grain";
import { Hero } from "./components/Hero";
import { IndexList } from "./components/IndexList";
import { Intro } from "./components/Intro";
import { NowStrip } from "./components/NowStrip";
import { TopBar } from "./components/TopBar";
import { Uses } from "./components/Uses";
import { ExitProvider } from "./lib/exit";

export default function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <ExitProvider>
        <div className="relative min-h-[100dvh] bg-paper text-ink">
          <a
            href="#index"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-[10px] focus:uppercase focus:tracking-[0.18em] focus:text-paper"
          >
            Skip to the index
          </a>

          <Intro />
          <TopBar />

          <main>
            <Hero hoveredId={hoveredId} onHover={setHoveredId} />
            <IndexList hoveredId={hoveredId} onHover={setHoveredId} />
            <NowStrip />
            <Uses />
            <Contact />
          </main>

          <Footer />
          <Grain />
        </div>
      </ExitProvider>
    </MotionConfig>
  );
}
