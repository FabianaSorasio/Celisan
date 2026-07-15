import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Celisan — Sitio en actualización",
  description: "Estamos mejorando nuestra tienda. Volvemos pronto.",
};

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center"
      style={{ background: "linear-gradient(135deg, #f9f5ef 0%, #f0ebe0 100%)" }}
    >
      {/* Ícono animado */}
      <div className="mb-6 relative">
        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto">
          <span className="text-5xl">🔨</span>
        </div>
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-celisan-red animate-ping opacity-75" />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-celisan-red" />
      </div>

      {/* Título */}
      <h1 className="text-3xl sm:text-4xl font-bold text-olive mb-3 leading-tight">
        ¡Estamos mejorando<br className="hidden sm:block" /> para vos!
      </h1>

      {/* Subtítulo */}
      <p className="text-gray-600 text-base sm:text-lg max-w-md mb-2 leading-relaxed">
        Nuestra tienda está en <strong className="text-celisan-red">remodelación</strong>.
        Pronto vas a poder disfrutar de una experiencia aún mejor.
      </p>
      <p className="text-gray-500 text-sm mb-10">
        Gracias por tu paciencia 🙏
      </p>

      {/* Separador */}
      <div className="flex items-center gap-3 mb-8 w-full max-w-xs">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Mientras tanto</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* CTA WhatsApp */}
      <a
        href="https://wa.me/5493564626508?text=Hola%20Celisan!%20Vi%20que%20el%20sitio%20está%20en%20remodelación,%20quería%20hacer%20un%20pedido."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-white flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.529 5.847L.057 23.5l5.797-1.52A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.493-5.178-1.357l-.371-.22-3.841 1.007 1.027-3.748-.241-.387A9.963 9.963 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Hacé tu pedido por WhatsApp
      </a>

      <p className="mt-4 text-xs text-gray-400">
        También podés escribirnos a{" "}
        <a
          href="https://www.instagram.com/celisan.sf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-celisan-red hover:underline font-medium"
        >
          @celisan.sf
        </a>
      </p>

      {/* Footer mínimo */}
      <p className="mt-16 text-xs text-gray-400">
        © {new Date().getFullYear()} Celisan · Waffles Sin Gluten · San Francisco, Córdoba
      </p>
    </main>
  );
}
