# Diseño del sitio — Celisan

Documento de referencia sobre cómo está armado el sitio: arquitectura, convenciones y decisiones de diseño. Pensado para que cualquiera (vos, otro desarrollador, o yo en una sesión futura) entienda el "por qué" de las cosas sin tener que releer todo el código.

## 1. Qué es

Sitio de catálogo y pedidos para **Celisan**, marca de waffles y viandas 100% sin gluten en San Francisco, Córdoba. No es un e-commerce con pago online: el cliente arma el pedido en el sitio y lo confirma por WhatsApp.

## 2. Stack técnico

- **Next.js 14** (App Router) + React + TypeScript
- **Tailwind CSS** para estilos
- **Vercel** para hosting (plan Hobby / gratis)
- Sin base de datos: los productos viven en `data/products.json`, editado a través del panel de admin

## 3. Estructura del proyecto

```
app/
  page.tsx              → home (catálogo + banner)
  admin/page.tsx         → panel de administración (protegido por login)
  api/admin/             → rutas API del admin (login, CRUD productos, upload de fotos)
  page-mantenimiento.tsx → página que se muestra si el sitio está en modo mantenimiento

components/
  HeroSlider.tsx          → carrusel de banners del inicio
  Catalog.tsx / CatalogSidebar.tsx → grilla de productos + filtro por categoría
  ProductCard.tsx          → la tarjeta de cada producto (imagen/galería/video, precio, stock, botón)
  Cart.tsx / CartProvider.tsx → carrito de compra y su estado global
  DesayunoOrderModal.tsx, PostreModulosModal.tsx, ViandaCumpleOrderModal.tsx
                            → modales de "Encargar" para productos a pedido (ver sección 5)
  Footer.tsx, Header.tsx   → layout general

data/
  products.json           → fuente de verdad de todos los productos (la lee el sitio en vivo)

lib/
  products.ts              → tipos y categorías válidas
  category-utils.ts         → normalización/filtrado de categorías
  cart.ts                   → lógica del carrito, armado del mensaje de WhatsApp, días/horarios de entrega
  catalog-seed.ts (+ copia en src/lib/) → catálogo de RESPALDO, solo se usa si products.json no existe
  admin-auth.ts             → login y sesión firmada del admin

public/images/
  productos/<categoria>/    → fotos de productos, una carpeta por categoría
  banner/                    → fotos/videos del carrusel del inicio y el logo "Sin Gluten"
```

## 4. Convención de nombres de fotos

Las fotos de productos viven en `public/images/productos/<categoria>/`, una carpeta por categoría (`viandas/`, `panificados/`, `Congelados/`, `cobertura/`, `desayunos/`, `viandacumple/`, `postres/`).

Nombre de archivo: `<categoria>-<producto>-<n>.<ext>` (ej: `viandas-canelones-1.webp`, `viandas-canelones-2.png`, `viandas-canelones-video.mp4`). El número indica orden: `-1` es la portada, `-2` en adelante son fotos de galería (carrusel dentro de la card).

**Excepción**: los productos que ya tenían nombres cortos y claros desde antes (ej. `wc-choc.png`, `des-clasico-2.png`) se dejaron como estaban — no hace falta renombrar algo que ya es prolijo solo por seguir la convención al pie de la letra.

Las fotos subidas desde el panel de admin (botón "Editar → Imagen/Galería") caen en `uploads/` con un nombre de timestamp automático — es normal que ese timestamp no siga la convención, ya que lo genera el sistema. Conviene, cada tanto, mover/renombrar esas fotos a la carpeta de su categoría para mantener todo ordenado (ver `scripts/reorg-plan.md` de sesiones anteriores como referencia del proceso, si existe).

## 5. Dos flujos de pedido distintos (¡no se mezclan!)

- **Carrito** (`ProductCard` → botón "Agregar"): para productos de catálogo normal (viandas, panificados, waffles congelados). Se acumulan en el carrito (`CartProvider`) y se despachan juntos en un solo mensaje de WhatsApp al finalizar, con datos de cliente, día de entrega/retiro, dirección y forma de pago (`components/Cart.tsx` + `lib/cart.ts`).
- **Encargar** (`ProductCard` → botón "Encargar"): para productos a pedido con datos particulares — Desayunos, Postres individuales, Vianda Fiesta!. Cada uno abre su propio modal (`DesayunoOrderModal`, `PostreModulosModal`, `ViandaCumpleOrderModal`) que arma **su propio mensaje** y abre WhatsApp directo, sin tocar el carrito para nada.

Un cliente puede tener cosas en el carrito Y encargar un desayuno aparte — son dos mensajes de WhatsApp independientes.

## 6. Stock

Cada producto tiene stock en `data/products.json`, editable desde el admin. Hay tres formas de trackearlo según el tipo de producto:

- **Stock simple** (`stock`): productos comunes sin variantes.
- **Stock por sabor** (`stockDulces` / `stockSalados`): waffles congelados con selector Dulce/Salado — **también se usa para los que NO tienen selector** (ej. chocolate), donde ambos campos deben coincidir con la disponibilidad real, porque el admin siempre edita estos dos campos para la categoría "Waffles Congelados", nunca `stock` directamente.
- **Stock por variante** (`variantes[].stock`): productos con varias opciones (ej. Hamburguesas de legumbres: Lentejas/Arvejas/Garbanzo/Soja).

El campo se vuelve `0` (no `undefined`) cuando no hay stock — el código trata "no definido" como "sin stock" para evitar que un producto recién creado aparezca disponible por error.

## 7. Panel de administración

Ruta `/admin`, protegido con contraseña (`ADMIN_PASSWORD`). La sesión usa un token firmado con HMAC (`ADMIN_SESSION_SECRET`) en una cookie `httpOnly` — no es una cookie falsificable a mano desde la consola del navegador. Ambas variables tienen que estar cargadas tanto en `.env.local` (desarrollo) como en las variables de entorno de Vercel (producción).

Desde el admin se puede: crear/editar/ocultar productos, subir fotos (portada + galería), y cambiar precios y stock. Los cambios se guardan directo en `data/products.json`.

## 8. Identidad visual

- **Colores** (`tailwind.config.ts`): `celisan-red` (#722F37, vino/bordó), `olive` (#808000, verde oliva), `olive-light` (#9A9A00), `cream` (#FFFDF5, fondo general).
- **Tono**: cálido, artesanal, con emojis en textos de producto y WhatsApp para reforzar cercanía.
- **Componentes reutilizables de UI**: badges de stock ("¡Hay stock!", "¡Queda uno solo!", "Sin stock"), carrusel de fotos con flechas + puntitos, lightbox de imagen ampliada, reproductor de video inline en las cards.

## 9. Hosting y almacenamiento (estado actual y plan)

- **Hosting**: Vercel, plan Hobby (gratis). Suficiente para el tráfico esperado de un negocio local.
- **Problema conocido**: el filesystem de Vercel es temporal — las fotos subidas desde el admin se pierden en cada deploy nuevo.
- **Solución planeada**: migrar el almacenamiento de fotos a **Cloudflare R2** (gratis hasta 10GB/10M lecturas por mes, sin costo de egress), manteniendo el sitio en Vercel. Pendiente de implementar — requiere que la dueña del sitio cree la cuenta de Cloudflare y el bucket, y pase las credenciales como variables de entorno.

## 10. Estado del despliegue

Todo el trabajo de esta etapa vive en la rama `feature/sabores-waffles`, no en `main`. El dominio de producción real sigue mostrando la página de mantenimiento (`app/page-mantenimiento.tsx`) hasta que se decida publicar.
