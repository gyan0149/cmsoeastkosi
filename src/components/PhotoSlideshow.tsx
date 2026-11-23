import { useEffect, useState, type ReactNode } from "react";

const INTERVAL_MS = 4500;

// A slide is a photo (src) or a drawn card (node).
export interface Slide {
  key: string;
  caption: string;
  src?: string;
  node?: ReactNode;
}

export function PhotoSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const current = Math.min(index, count - 1);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduce || count < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [paused, count]);

  const go = (i: number) => setIndex((i + count) % count);
  const arrow =
    "absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl text-white hover:bg-black/60";

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden bg-brand-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="School photos"
    >
      {slides.map((s, i) => (
        <div key={s.key} aria-hidden={i !== current} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}>
          {s.src ? (
            // Slow zoom on the visible photo gives a video-like feel.
            <img src={s.src} alt={s.caption} loading={i === 0 ? "eager" : "lazy"} className={`h-full w-full object-cover ${i === current ? "animate-kenburns" : ""}`} />
          ) : (
            s.node
          )}
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-10 pb-8 text-sm font-medium text-white">
        {slides[current]?.caption}
      </div>
      {count > 1 && (
        <>
          <button type="button" aria-label="Previous photo" onClick={() => go(current - 1)} className={`${arrow} left-2`}>
            ‹
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(current + 1)} className={`${arrow} right-2`}>
            ›
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-sm text-white hover:bg-black/60"
          >
            {paused ? "▶" : "❚❚"}
          </button>
          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                aria-label={`Show slide ${i + 1}: ${s.caption}`}
                aria-current={i === current}
                onClick={() => {
                  setIndex(i);
                  setPaused(true);
                }}
                className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-accent-400" : "w-2 bg-white/70 hover:bg-white"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Drawn slide used until the school uploads enough real photos.
export function CardSlide({ icon, title, text, tone }: { icon: string; title: string; text: string; tone: string }) {
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br px-8 pb-10 text-center text-white ${tone}`}>
      <span className="animate-kenburns text-6xl md:text-7xl" aria-hidden>
        {icon}
      </span>
      <p className="text-xl font-bold md:text-2xl">{title}</p>
      <p className="max-w-sm text-sm text-white/90 md:text-base">{text}</p>
    </div>
  );
}
