"use client";

import Image from "next/image";

export default function Hero() {
  const scrollToCatalog = () => {
    const el = document.getElementById("productos");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", "/#productos");
      window.dispatchEvent(new Event("hashchange"));
    }
  };

  return (
    <section
      id="inicio"
      className="relative w-full bg-white border-b border-gray-100 scroll-mt-[4.25rem]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-cream/80 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center py-12 sm:py-16 lg:py-20">
          <div className="max-w-xl">
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-olive/10 text-olive text-xs font-semibold tracking-wide uppercase">
              100% libre de gluten · San Francisco
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-olive leading-tight tracking-tight">
              Sabor Auténtico, 100% Libre de Gluten.
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
              Descubrí el placer de comer rico y seguro con Celisan. Elaboración
              artesanal para disfrutar sin preocupaciones desde San Francisco.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-celisan-red text-white font-semibold text-base shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Ver Catálogo
              </button>
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-olive text-olive font-semibold text-base hover:bg-olive hover:text-cream transition-colors"
              >
                Comprar Ahora
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-2xl overflow-hidden shadow-antigravity border border-gray-100">
              <Image
                src="/waffle-berenjena.png"
                alt="Waffle artesanal sin gluten con cobertura"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 50vw"
                priority
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                aria-hidden
              />
            </div>
            <div className="absolute -bottom-3 -left-2 sm:left-4 bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100 flex items-center gap-3">
              <img
                src="/sin_gluten_legal-01.png"
                alt="Sin TACC"
                className="h-10 w-10 object-contain"
              />
              <p className="text-xs sm:text-sm font-semibold text-olive leading-snug">
                Elaboración artesanal
                <br />
                <span className="text-celisan-red">Certificado Sin TACC</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
