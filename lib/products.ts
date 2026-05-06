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
    description: "Berenjena asada, tomates y mucho queso sobre waffle artesanal sin gluten, \u00a1lleno de sabor!\nMedida: 20 x 10 cm",
    price: 13990,
    image: "/waffle-berenjena.png",
    category: "salados",
  },
  {
    id: "jamon-queso",
    name: "Jam\u00f3n y Queso",
    description: "Jam\u00f3n y queso fundido en waffle reci\u00e9n hecho sin gluten.\nMedida: 20 x 10 cm",
    price: 13990,
    image: "/waffle-jyqueso.png",
    category: "salados",
  },
  {
    id: "dulce-banana",
    name: "Banana con Dulce de leche",
    description: "Banana con dulce de leche e hilos de chocolate, con una base de waffle artesanal sin gluten \u00a1Opci\u00f3n para golosos!.\nMedida: 20 x 10 cm",
    price: 13990,
    image: "/waffle-dulce.png",
    category: "dulces",
  },
  {
    id: "frutos-bosque",
    name: "Frutos del Bosque",
    description: "Mix de frutos rojos con toques de crema en una base de waffle artesanal sin gluten.\nMedida: 20 x 10 cm",
    price: 15990,
    image: "/waffle-frutos.png",
    category: "dulces",
  },
  {
    id: "ready-toast-2",
    name: "Armalos como quieras x2.",
    description: "Por 2 unidades.\nMedida: 20 x 10 cm",
    price: 5500,
    image: "/congeladox2.png",
    category: "congelados",
    variant: "x2",
  },
  {
    id: "ready-toast-4",
    name: "Armalos como quieras x4.",
    description: "Por 4 unidades.\nMedida: 20 x 20 cm",
    price: 9990,
    image: "/congeladox4.png",
    category: "congelados",
    variant: "x4",
  },
];

export const categoryLabels: Record<ProductCategory, string> = {
  salados: "SALADOS",
  dulces: "DULCES",
  congelados: "CONGELADOS",
};
