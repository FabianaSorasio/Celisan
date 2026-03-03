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

// Rutas de imagen vía /img/ (Route Handler sirve desde /public). Nombres = archivos en public.
export const products: Product[] = [
  {
    id: "morado-veggie",
    name: "Morado Veggie",
    description: "Berenjena asada, tomates cherry y mucho queso sobre waffle artesanal",
    price: 1300, 
    image: "/img/waffle-palta.png", 
    category: "salados",
  },
  {
    id: "jamon-queso",
    name: "Jamón y Queso",
    description: "Jamón y queso fundido en waffle recién hecho",
    price: 1100,
    image: "/img/waffle-jyqueso.png",
    category: "salados",
  },
  {
    id: "dulce-banana",
    name: "Dulce de Leche y Banana",
    description: "Dulce de leche artesanal con banana e hilos de chocolate",
    price: 1000,
    image: "/img/waffle-dulce.png",
    category: "dulces",
  },
  {
    id: "frutos-bosque",
    name: "Frutos del Bosque",
    description: "Mix de frutos rojos con toques de crema",
    price: 1100,
    image: "/img/waffle-frutos.png",
    category: "dulces",
  },
  {
    id: "ready-toast-2",
    name: "Listos para que prepares x2 unidades",
    description: "Por 2 unidades",
    price: 2800,
    image: "/img/waffle-solo.png",
    category: "congelados",
    variant: "x2",
  },
  {
    id: "ready-toast-4",
    name: "Listos para que prepares x4 unidades",
    description: "Por 4 unidades",
    price: 3900,
    image: "/img/waffle-solo.png",
    category: "congelados",
    variant: "x4",
  },
];

export const categoryLabels: Record<ProductCategory, string> = {
  salados: "SALADOS",
  dulces: "DULCES",
  congelados: "CONGELADOS ¡Preparalos vos mismo!",
};
