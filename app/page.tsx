import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products, categoryLabels } from "@/lib/products";
import type { ProductCategory } from "@/lib/products";

const categories: ProductCategory[] = ["salados", "dulces", "congelados"];

export default function Home() {
  return (
    <>
      <Banner />
      <Header />
      <div className="flex justify-center w-full bg-cream">
        <img
          src="/img/banner.png"
          alt=""
          className="w-full max-w-6xl object-contain"
        />
      </div>
      <main className="max-w-6xl mx-auto px-4 py-20 md:py-32 pb-20">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-olive mb-2">
            Waffles sin gluten
          </h1>
          <h3 className="text-gray-700 text-lg font-bold">Pedidos sólo martes y viernes</h3>
          <h3 className="text-gray-600 text-lg font-normal">Cupos limitados, take away</h3>
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