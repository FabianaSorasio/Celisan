import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

const testProduct: Product = {
  id: "box-armado-desayuno",
  name: "Box Proteico Base",
  category: "Desayunos y Meriendas",
  price: 28000,
  description:
    "Infusión + 2 waffles salados + queso crema, palta y endulzantes + delivery a domicilio. Sumá extras a tu gusto.",
  image: "/images/productos/desayunos/box-proteico-base.webp",
  stock: 99,
  available: true,
  imageX: 50,
  imageY: 50,
  imageZoom: 1,
};

export default function TestBoxPage() {
  return (
    <div className="max-w-sm mx-auto my-12 px-4">
      <p className="text-xs text-gray-400 mb-4">
        Página de prueba — no es parte del sitio final, solo para previsualizar la tarjeta y el modal.
      </p>
      <ProductCard product={testProduct} />
    </div>
  );
}
