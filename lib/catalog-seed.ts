import type { Product } from "@/lib/products";

const PLACEHOLDER = "/logo-celisan.png";

/** Dataset de referencia hasta conectar la planilla de Google Sheets. */
export const catalogSeed: Product[] = [
  // Línea Soy Sin Gluten
  { id: "ssg-lasagna", name: "Lasagna con bolognesa", category: "Línea Soy Sin Gluten", price: 11600, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-sorrentinos", name: "Sorrentinos c/ salsa roja (jamón y queso / verduras)", category: "Línea Soy Sin Gluten", price: 10800, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-canelones", name: "Canelones (de carne / acelga bolognesa)", category: "Línea Soy Sin Gluten", price: 10800, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-bollitos", name: "Bollitos de pan (50 gr)", category: "Línea Soy Sin Gluten", price: 400, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-sand-bondiola", name: "Sandwich de bondiola cerdo (chico)", category: "Línea Soy Sin Gluten", price: 8600, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-sand-hamburguesa", name: "Sandwich Hamburguesa (casera / queso)", category: "Línea Soy Sin Gluten", price: 7200, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-sand-pollo", name: "Sandwich Pollo, verdeo (queso azul, cebolla)", category: "Línea Soy Sin Gluten", price: 7500, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-sand-vegetales", name: "Sandwich de vegetales (asados / queso)", category: "Línea Soy Sin Gluten", price: 6500, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-sand-jyq", name: "Sandwich de jamón y queso", category: "Línea Soy Sin Gluten", price: 7200, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-tarta-jyq", name: "1/2 Tarta de jamón y queso", category: "Línea Soy Sin Gluten", price: 11500, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-tarta-anco", name: "1/2 Tarta de anco, acelga y queso", category: "Línea Soy Sin Gluten", price: 12200, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-tarta-zapallito", name: "1/2 Tarta de zapallito, cebolla y queso", category: "Línea Soy Sin Gluten", price: 11500, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-tarta-pollo", name: "1/2 Tarta de pollo y acelga", category: "Línea Soy Sin Gluten", price: 12200, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-pizza", name: "Pizza lista x4 porciones", category: "Línea Soy Sin Gluten", price: 7900, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-emp-dulce", name: "Empanadas (3 unidades) carne Dulce", category: "Línea Soy Sin Gluten", price: 7200, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-emp-salada", name: "Empanadas (3 unidades) carne Salada", category: "Línea Soy Sin Gluten", price: 7200, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-emp-arabes", name: "Empanadas (3 unidades) árabes", category: "Línea Soy Sin Gluten", price: 7200, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-tacos", name: "Tacos de verdura (3 unidades)", category: "Línea Soy Sin Gluten", price: 7900, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-prepizzas", name: "Pre pizzas", category: "Línea Soy Sin Gluten", price: 2700, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-noquis", name: "Ñoquis crudos x 250gr", category: "Línea Soy Sin Gluten", price: 5800, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-sorrentinos-crudos", name: "Sorrentinos crudos X 8 unidades (jamón y queso / verduras)", category: "Línea Soy Sin Gluten", price: 8600, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-hamb-legumbres", name: "Hamburguesas de legumbres (4 unidades)", category: "Línea Soy Sin Gluten", price: 4000, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-emp-crudas", name: "Empanadas crudas (x 4 unidades)", category: "Línea Soy Sin Gluten", price: 11500, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-medialunas", name: "Medialunas x 50gr.", category: "Línea Soy Sin Gluten", price: 1900, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-mafalda", name: "Mafalda x unidad", category: "Línea Soy Sin Gluten", price: 2400, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-pan-lactal", name: "Tipo Pan Lactal x 700gr.", category: "Línea Soy Sin Gluten", price: 6000, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-pan-baguette", name: "Pan baguette x 200gr.", category: "Línea Soy Sin Gluten", price: 1900, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "ssg-pan-hamburguesa", name: "Pan hamburguesa 130gr.", category: "Línea Soy Sin Gluten", price: 1400, description: "", image: PLACEHOLDER, stock: 1 },
  // Waffles Congelados
  {
    id: "wc-x2",
    name: "Armalos como quieras x2.",
    category: "Waffles Congelados",
    price: 5500,
    description: "Por 2 unidades.\nMedida: 20 x 10 cm",
    image: "/congeladox2.png",
    stock: 1,
  },
  {
    id: "wc-x4",
    name: "Armalos como quieras x4.",
    category: "Waffles Congelados",
    price: 9990,
    description: "Por 4 unidades.\nMedida: 20 x 20 cm",
    image: "/congeladox4.png",
    stock: 1,
  },
  // Waffles con Cobertura (orden: Morado Veggie → JyQ → Banana → Frutos Rojos)
  { id: "wcb-veggie", name: "Waffle Salado Morado Veggie", category: "Waffles con Cobertura", price: 13990, description: "Berenjena asada, tomates y queso sobre waffle artesanal sin gluten.", image: "/waffle-berenjena.png", stock: 1 },
  { id: "wcb-jyq", name: "Waffle Salado con Jamón y Queso", category: "Waffles con Cobertura", price: 13990, description: "Jamón y queso fundido en waffle recién hecho sin gluten.", image: "/waffle-jyqueso.png", stock: 1 },
  { id: "wcb-banana", name: "Waffle con Banana, Dulce de leche y chocolate", category: "Waffles con Cobertura", price: 13990, description: "Banana con dulce de leche e hilos de chocolate sobre waffle artesanal sin gluten.", image: "/waffle-dulce.png", stock: 1 },
  { id: "wcb-frutos", name: "Waffle con Frutos Rojos y crema chantilly", category: "Waffles con Cobertura", price: 15990, description: "Mix de frutos rojos con crema chantilly sobre waffle artesanal sin gluten.", image: "/waffle-frutos.png", stock: 1 },
  // Desayunos
  { id: "des-clasico-2", name: "Desayuno Clásico 2 cuadraditos", category: "Desayunos", price: 25000, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "des-clasico-4", name: "Desayuno Clásico 4 cuadraditos", category: "Desayunos", price: 44000, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "des-proteico-2", name: "Desayuno Proteico 2 cuadraditos", category: "Desayunos", price: 25000, description: "", image: PLACEHOLDER, stock: 1 },
  { id: "des-taza", name: "Adicional taza + cuchara", category: "Desayunos", price: 15000, description: "", image: PLACEHOLDER, stock: 1 },
  // Vianda Cumple
  { id: "vc-jyq-oreo", name: "Vianda Cumple JyQ / Oreo", category: "Vianda Cumple", price: 20000, description: "", image: PLACEHOLDER, stock: 1 },
];
