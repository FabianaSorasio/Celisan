import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products, categoryLabels } from "@/lib/products";
import type { ProductCategory } from "@/lib/products";
import Image from "next/image";

const categories: ProductCategory[] = ["salados", "dulces", "congelados"];

export default function Home() {
  return (
    <>
      <Banner />
      <Header />
      <div className="w-full bg-cream px-3 sm:px-6 flex justify-center">
        <div className="w-full max-w-6xl min-w-0">
          {/* Móvil: dos tiras 750×215 apiladas */}
          <div className="flex flex-col md:hidden">
            <Image
              src="/banner_responsive_celular1.png"
              alt="Waffles salados sin gluten"
              width={750}
              height={215}
              className="w-full h-auto max-w-full object-contain object-center block"
              sizes="calc(100vw - 1.5rem)"
              priority
            />
            <Image
              src="/banner_responsive_celular2.png"
              alt="Waffles dulces sin gluten"
              width={750}
              height={215}
              className="w-full h-auto max-w-full object-contain object-center block"
              sizes="calc(100vw - 1.5rem)"
            />
          </div>
          {/* Tablet/desktop: banner panorámico */}
          <div className="hidden md:block">
            <Image
              src="/banner.png"
              alt="Celisan — Waffles artesanales sin gluten"
              width={1920}
              height={279}
              className="w-full h-auto max-w-full object-contain object-center align-top"
              sizes="(max-width: 1152px) 100vw, 72rem"
            />
          </div>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-4 pt-14 sm:pt-16 pb-20 md:pb-32">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-olive mb-2">
            Waffles sin gluten
          </h1>
          <p className="text-gray-700 text-lg font-bold">Entrega Take Away</p>
        </div>

        {categories.map((cat) => {
          const list = products.filter((p) => p.category === cat);
          if (list.length === 0) return null;
          return (
            <section key={cat} className="mb-20">
              <h2
                className={`text-3xl sm:text-4xl font-bold mb-10 border-b-2 pb-3 text-center uppercase tracking-tight ${
                  cat === "dulces"
                    ? "text-celisan-red border-celisan-red/20"
                    : cat === "congelados"
                      ? "text-black border-black/20"
                      : "text-olive border-olive/20"
                }`}
              >
                {categoryLabels[cat]}
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {list.map((product) => (
                  <div key={product.id} className="w-full sm:w-[min(100%,20rem)] lg:w-[min(100%,18rem)]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}