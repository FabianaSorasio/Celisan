import Catalog from "@/components/Catalog";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import { fetchProducts } from "@/lib/sheets";
import { Suspense } from "react";

export default async function Home() {
  const products = await fetchProducts();

  return (
    <>
      <HeroSlider />

      <main className="bg-cream">
        <section
          id="productos"
          className="scroll-mt-[4.25rem] max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20 md:pb-28"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-olive">
              Nuestros Productos
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
              Elegí una categoría y armá tu pedido sin gluten. Retirá en San
              Francisco o coordiná por WhatsApp.
            </p>
          </div>
          <Suspense
            fallback={
              <p className="text-center text-gray-500 py-16">
                Cargando catálogo…
              </p>
            }
          >
            <Catalog products={products} />
          </Suspense>
        </section>
      </main>

      <Footer />
    </>
  );
}
