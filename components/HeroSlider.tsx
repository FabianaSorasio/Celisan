"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_MS = 5000;

type SlideAction = "dulce" | "historia" | "desayunos" | "catalog";

interface Slide {
  id: number;
  image: string;
  imageAlt: string;
  imageClassName?: string;
  overlayClassName?: string;
  title: string;
  subtitle: string;
  cta: string;
  action: SlideAction;
}

const SLIDES: Slide[] = [
  {
    id: 0,
    image: "/waffle-dulce.png",
    imageAlt: "Waffle de chocolate sin TACC",
    overlayClassName: "from-[#3d2314]/85 via-[#5c3a2a]/60 to-black/40",
    title: "¡Llegaron los Waffles de Chocolate!",
    subtitle:
      "Crocantes, calentitos y bañados con el chocolate más tentador. 100% Sin TACC.",
    cta: "Ver Menú Dulce",
    action: "dulce",
  },
  {
    id: 1,
    image: "/logo-celisan.png",
    imageAlt: "Celisan — Soy Sin Gluten",
    imageClassName: "object-contain object-center scale-90 sm:scale-100 p-8 sm:p-12",
    overlayClassName: "from-olive/90 via-olive/70 to-celisan-red/50",
    title: "Sabor real, 100% Sin TACC",
    subtitle:
      "La seguridad que necesitás con la textura artesanal que te encanta.",
    cta: "Conocé más",
    action: "historia",
  },
  {
    id: 2,
    image: "/waffle-jyqueso.png",
    imageAlt: "Waffle salado jamón y queso",
    overlayClassName: "from-black/75 via-black/45 to-olive/30",
    title: "Sorprendé a Papá en su día",
    subtitle:
      "Desayunos artesanales completos listos para regalar este Junio. Reservá el suyo con tiempo.",
    cta: "Reservar Desayuno",
    action: "desayunos",
  },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `/#${id}`);
    window.dispatchEvent(new Event("hashchange"));
  }
}

export default function HeroSlider() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setActive((index + SLIDES.length) % SLIDES.length);
  }, []);

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  const handleCta = (action: SlideAction) => {
    switch (action) {
      case "dulce":
        router.push(
          `/?categoria=${encodeURIComponent("Waffles con Cobertura")}#productos`
        );
        scrollToId("productos");
        break;
      case "historia":
        scrollToId("historia");
        break;
      case "desayunos":
        router.push(
          `/?categoria=${encodeURIComponent("Desayunos")}#productos`
        );
        scrollToId("productos");
        break;
      default:
        scrollToId("productos");
    }
  };

  return (
    <section
      id="inicio"
      className="relative w-full scroll-mt-[4.25rem]"
      aria-roledescription="carrusel"
      aria-label="Promociones Celisan"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden bg-gray-900">
        {SLIDES.map((slide, index) => {
          const isActive = index === active;
          return (
            <article
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                className={`object-cover ${slide.imageClassName ?? ""}`}
                sizes="100vw"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.overlayClassName ?? "from-black/70 via-black/40 to-transparent"}`}
                aria-hidden
              />

              <div className="absolute inset-0 z-10 flex items-center">
                <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-14">
                  <div className="max-w-xl text-white">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight tracking-tight drop-shadow-sm">
                      {slide.title}
                    </h1>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-lg">
                      {slide.subtitle}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCta(slide.action)}
                      className="mt-6 sm:mt-8 inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-celisan-red text-white font-semibold text-sm sm:text-base shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* Flechas */}
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-olive shadow-md hover:bg-white hover:scale-105 transition-all"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-olive shadow-md hover:bg-white hover:scale-105 transition-all"
          aria-label="Slide siguiente"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              className={`rounded-full transition-all duration-300 ${
                index === active
                  ? "w-8 sm:w-10 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Ir al slide ${index + 1}: ${slide.title}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
