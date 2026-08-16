"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_MS = 5000;

type SlideAction = "dulce" | "historia" | "desayunos" | "catalog" | "postres" | "waffles" | "viandas";
type TextPosition = "left" | "right";

interface Slide {
  id: number;
  /** Imagen de fondo (usar image O video, no ambos) */
  image?: string;
  /** Video de fondo en loop (muted, autoplay) */
  video?: string;
  /** Video chico flotante sobre la imagen de fondo (recuadro, no ocupa todo el slide) */
  insetVideo?: string;
  imageAlt: string;
  imageClassName?: string;
  overlayClassName?: string;
  /** Texto chico opcional arriba del título (ej: "Waffles congelados salados:") */
  kicker?: string;
  title: string;
  subtitle: string;
  /** Si true, el subtitle se muestra debajo del botón CTA en lugar de arriba */
  subtitleBelow?: boolean;
  cta: string;
  action: SlideAction;
  /** Enlace externo (ej. WhatsApp). Abre en pestaña nueva. */
  ctaHref?: string;
  /** Posición del texto: izquierda (default) o derecha */
  textPosition?: TextPosition;
  /** Logo pequeño que aparece debajo del botón CTA */
  logo?: string;
  /** Muestra la placa "Sin Lácteos" junto a la de "Sin Gluten", solo en este slide */
  sinLactosa?: boolean;
}

const SLIDES: Slide[] = [
  // 1 — Desayunos y Meriendas
  {
    id: 0,
    image: "/images/banner/banner-box-proteico.png",
    imageAlt: "Box proteico con waffle integral sin gluten y sin lácteos para regalar",
    overlayClassName: "from-black/75 via-black/45 to-olive/30",
    kicker: "¡Novedad!",
    title: "Box proteico con waffle integral",
    subtitle: "Ideal para tu dieta fitness — con waffle integral, sin gluten y sin lácteos. También tenés el clásico de jamón y queso y más opciones para regalar.",
    subtitleBelow: true,
    sinLactosa: true,
    cta: "Ver Desayunos y Meriendas",
    action: "desayunos",
  },
  // 2 — Waffles salados congelados (foto de fondo)
  {
    id: 1,
    image: "/images/banner/banner-waffle-salado-foto.jpg",
    imageAlt: "Waffle salado congelado sin gluten",
    overlayClassName: "from-[#3d2314]/85 via-[#5c3a2a]/60 to-black/40",
    kicker: "Waffles congelados salados:",
    title: "La base perfecta y sin gluten para tus sándwiches más creativos.",
    subtitle: "",
    cta: "Ver Waffles",
    action: "waffles",
  },
  // 3 — Soy Sin Gluten
  {
    id: 2,
    image: "/images/banner/banner-soysingluten.jpg",
    imageAlt: "Sorrentinos sin gluten con salsa — Soy Sin Gluten",
    overlayClassName: "from-black/55 via-black/25 to-transparent",
    title: "Sabor casero,\n100% sin gluten",
    subtitle:
      "Todo un abanico de posibilidades de comidas congeladas sin gluten.",
    cta: "Ver Viandas Sin Gluten",
    action: "viandas",
    logo: "/images/banner/logo-soysingluten.png",
  },
  // 4 — Postres individuales
  {
    id: 3,
    image: "/images/banner/banner-postres.jpg",
    imageAlt: "Postre individual de chocolate con crema mascarpone sin gluten",
    overlayClassName: "from-black/75 via-black/40 to-transparent",
    title: "Postres que enamoran",
    subtitle:
      "Individuales de 10×10 cm, se pueden agrandar por unidad a medida. 100% sin gluten. Por encargo anticipado — consultanos.",
    cta: "Ver Postres",
    action: "postres",
  },
  // 5 — Delivery
  {
    id: 4,
    image: "/images/banner/banner-delivery.png",
    imageAlt: "Delivery Celisan — llevamos el sabor a tu puerta",
    overlayClassName: "from-black/80 via-olive/55 to-black/35",
    title: "¡Llevamos el sabor a tu puerta!",
    subtitle:
      "Consultá por nuestro servicio de delivery para conocer los días, horarios y costos. Válido sólo en la ciudad de San Francisco.",
    cta: "Consultar por WhatsApp",
    action: "catalog",
    ctaHref:
      "https://wa.me/5493564626508?text=Hola%20Celisan!%20Quería%20consultar%20los%20días,%20horarios%20y%20costos%20del%20servicio%20de%20delivery",
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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const insetVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goTo = useCallback((index: number) => {
    setActive((index + SLIDES.length) % SLIDES.length);
  }, []);

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Pausa/reanuda el video (de fondo o flotante) según slide activo
  useEffect(() => {
    SLIDES.forEach((slide, i) => {
      const vid = slide.video ? videoRefs.current[i] : slide.insetVideo ? insetVideoRefs.current[i] : null;
      if (!vid) return;
      if (i === active) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [active]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  const navigateToCategory = (categoria: string) => {
    const params = new URLSearchParams({ categoria });
    router.push(`/?${params.toString()}`, { scroll: false });
    // El elemento #productos siempre está en el DOM (fuera del Suspense),
    // así que podemos scrollear inmediatamente sin esperar la navegación.
    const el = document.getElementById("productos");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCta = (action: SlideAction) => {
    switch (action) {
      case "dulce":
        navigateToCategory("Waffles con Cobertura");
        break;
      case "waffles":
        navigateToCategory("Waffles Congelados");
        break;
      case "viandas":
        navigateToCategory("Viandas Soy Sin Gluten");
        break;
      case "desayunos":
        navigateToCategory("Desayunos y Meriendas");
        break;
      case "postres":
        navigateToCategory("Postres individuales");
        break;
      case "historia":
        scrollToId("historia");
        break;
      case "catalog":
      default:
        router.push("/", { scroll: false });
        document.getElementById("productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
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
              {/* Fondo: video o imagen. El video usa object-contain (no cover) porque
                  suele venir en formato vertical de celular: recortarlo a pantalla
                  completa lo mostraba demasiado "pegado"/zoomeado. Así se ve entero,
                  centrado sobre el fondo oscuro del banner. */}
              {slide.video ? (
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={slide.video}
                  muted
                  loop
                  playsInline
                  autoPlay={isActive}
                  className="absolute inset-0 w-full h-full object-contain object-center bg-gray-900"
                />
              ) : slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />
              ) : null}

              {/* Video flotante sobre la imagen de fondo, en un recuadro chico */}
              {slide.insetVideo && (
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-10 w-24 h-32 sm:w-32 sm:h-44 lg:w-40 lg:h-56 rounded-2xl overflow-hidden shadow-2xl z-[5]">
                  <video
                    ref={(el) => { insetVideoRefs.current[index] = el; }}
                    src={slide.insetVideo}
                    muted
                    loop
                    playsInline
                    autoPlay={isActive}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </div>
              )}

              {/* Overlay degradé */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.overlayClassName ?? "from-black/70 via-black/40 to-transparent"}`}
                aria-hidden
              />

              {/* Contenido */}
              <div className="absolute inset-0 z-10 flex items-center">
                <div className={`max-w-7xl mx-auto w-full pl-16 pr-6 sm:pl-20 sm:pr-10 lg:pl-24 lg:pr-14 flex ${slide.textPosition === "right" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-xl text-white">
                    {slide.kicker && (
                      <p className="text-sm sm:text-base font-semibold tracking-wide text-white/90 mb-1.5 drop-shadow-sm">
                        {slide.kicker}
                      </p>
                    )}
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight tracking-tight drop-shadow-sm whitespace-pre-line">
                      {slide.title}
                    </h1>
                    {!slide.subtitleBelow && slide.subtitle && (
                      <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-lg">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.ctaHref ? (
                      <a
                        href={slide.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 sm:mt-8 inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-celisan-red text-white font-semibold text-sm sm:text-base shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                        {slide.cta}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCta(slide.action)}
                        className="mt-6 sm:mt-8 inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-celisan-red text-white font-semibold text-sm sm:text-base shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                        {slide.cta}
                      </button>
                    )}
                    {slide.subtitleBelow && (
                      <p className="mt-3 text-sm sm:text-base text-white/90 font-medium leading-snug">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.logo && (
                      <img
                        src={slide.logo}
                        alt="Logo"
                        className="mt-3 h-20 sm:h-28 lg:h-36 w-auto object-contain drop-shadow-md"
                      />
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* Placa "Sin Gluten" — fija, visible en todos los slides */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-11 h-11 sm:w-14 sm:h-14 drop-shadow-lg">
          <img
            src="/images/banner/badge-sin-gluten.png"
            alt="Certificado Sin Gluten"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Placa "Sin Lácteos" — solo en los slides que la necesitan */}
        {SLIDES[active]?.sinLactosa && (
          <div className="absolute top-16 right-3 sm:top-20 sm:right-4 z-20 w-11 h-11 sm:w-14 sm:h-14 drop-shadow-lg">
            <img
              src="/images/banner/badge-sin-lacteos.png"
              alt="Sin Lácteos"
              className="w-full h-full object-contain"
            />
          </div>
        )}

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
