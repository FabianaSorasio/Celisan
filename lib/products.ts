export type ProductCategory = "salados" | "dulces" | "congelados";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  variant?: string; // e.g. "x4" | "x6" for congelados
}

// Rutas de imagen directas desde `/public/`.
export const products: Product[] = [
  {
    id: "morado-veggie",
    name: "Morado Veggie",
    description:
      "Berenjena asada, tomates y mucho queso sobre waffle artesanal sin gluten, ¡lleno de sabor!",
    price: 11900,
    image: "/waffle-berenjena.png",
    category: "salados",
  },
  {
    id: "jamon-queso",
    name: "Jamón y Queso",
    description: "Jamón y queso fundido en waffle recién hecho sin gluten.",
    price: 11900,
    image: "/waffle-jyqueso.png",
    category: "salados",
  },
  {
    id: "dulce-banana",
    name: "Banana con Dulce de leche",
    description:
      "Banana con dulce de leche e hilos de chocolate, con una base de waffle artesanal sin gluten, ¡Opción para golosos!",
    price: 11900,
    image: "/waffle-dulce.png",
    category: "dulces",
  },
  {
    id: "frutos-bosque",
    name: "Frutos del Bosque",
    description:
      "Mix de frutos rojos con toques de crema en una base de waffle artesanal sin gluten.",
    price: 13900,
    image: "/waffle-frutos.png",
    category: "dulces",
  },
  {
    id: "ready-toast-2",
    name: "Listos para que prepares x2 unidades",
    description: "Por 2 unidades",
    price: 4000,
    image: "/waffle-solo-01.png",
    category: "congelados",
    variant: "x2",
  },
  {
    id: "ready-toast-4",
    name: "Listos para que prepares x4 unidades",
    description: "Por 4 unidades",
    price: 7500,
    image: "/waffle-solo-01.png",
    category: "congelados",
    variant: "x4",
  },
];

export const categoryLabels: Record<ProductCategory, string> = {
  salados: "SALADOS",
  dulces: "DULCES",
  congelados: "CONGELADOS ¡Preparalos vos mismo!",
};
