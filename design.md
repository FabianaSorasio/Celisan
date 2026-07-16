# Diseño del sitio — Celisan

Documento de referencia sobre cómo está armado el sitio: arquitectura, convenciones y decisiones de diseño. Pensado para que cualquiera (vos, otro desarrollador, o yo en una sesión futura) entienda el "por qué" de las cosas sin tener que releer todo el código.

## 1. Qué es

Sitio de catálogo y pedidos para **Celisan**, marca de waffles y viandas 100% sin gluten en San Francisco, Córdoba. No es un e-commerce con pago online: el cliente arma el pedido en el sitio y lo confirma por WhatsApp.

## 2. Stack técnico

- **Next.js 14** (App Router) + React + TypeScript
- **Tailwind CSS** para estilos
- **Vercel** para hosting (plan Hobby / gratis)
- **Cloudflare R2** para almacenamiento persistente: fotos de productos y los datos editables (`products.json`, `coupons.json`). Sin base de datos tradicional.

## 3. Estructura del proyecto

```
app/
  page.tsx                → home real (catálogo + banner) — actualmente NO está publicada
  page-mantenimiento.tsx  → página "en actualización" que se muestra mientras el sitio no está 100% listo
  admin/page.tsx           → panel de administración (protegido por login)
  api/
    admin/
      auth/                 → login del admin
      products/              → CRUD de productos (GET/PUT/POST, y /[id] para editar/borrar uno)
      coupons/                → alta/edición de cupones
      upload/                  → subida de fotos (van a R2)
    coupons/validate/        → ruta pública: el carrito valida un código de cupón
    orders/checkout/          → ruta pública: descuenta stock cuando se confirma un pedido

components/
  HeroSlider.tsx           → carrusel de banners del inicio
  Catalog.tsx / CatalogSidebar.tsx → grilla de productos + filtro por categoría
  ProductCard.tsx           → tarjeta de cada producto (imagen/galería/video, precio, stock, botón)
  Cart.tsx / CartProvider.tsx → carrito de compra, cupón, día de entrega, y su estado global
  DesayunoOrderModal.tsx, PostreModulosModal.tsx, ViandaCumpleOrderModal.tsx
                             → modales de "Encargar" para productos a pedido (ver sección 5)
  Footer.tsx, Header.tsx    → layout general

data/
  products.json              → SOLO se usa como respaldo local (ver sección 9) — el dato real vive en R2
  coupons.json                → ídem, respaldo local de los cupones

lib/
  products.ts                → tipos y categorías válidas de producto
  products-data.ts            → lee/escribe productos: primero intenta R2, si no hay nada usa data/products.json
  coupons.ts                  → tipo Coupon
  coupons-data.ts              → igual que products-data.ts pero para cupones
  category-utils.ts            → normalización/filtrado de categorías
  cart.ts                       → lógica del carrito, armado del mensaje de WhatsApp, días/horarios de entrega
  catalog-seed.ts               → catálogo de RESPALDO final, solo si ni R2 ni data/products.json tienen nada
  sheets.ts                     → fetchProducts(): decide qué fuente de datos usar (ver sección 9)
  admin-auth.ts                 → login y sesión firmada del admin
  r2.ts                          → cliente de Cloudflare R2: subir/bajar fotos y JSON (productos y cupones)

public/images/
  productos/<categoria>/     → fotos de productos que vienen versionadas en el repo (catálogo base)
  banner/                     → fotos/videos del carrusel del inicio y el logo "Sin Gluten"
```

**Nota:** las fotos que subís desde el panel de admin (botón "Editar → Imagen/Galería") NO quedan en `public/images/` — se suben directo a Cloudflare R2 y se sirven desde ahí (`R2_PUBLIC_URL`). Esto es necesario porque Vercel borra los archivos subidos por el servidor en cada despliegue nuevo.

## 4. Convención de nombres de fotos

Las fotos base (las que vienen en el repo, no las subidas por admin) viven en `public/images/productos/<categoria>/`, una carpeta por categoría (`viandas/`, `panificados/`, `Congelados/`, `cobertura/`, `desayunos/`, `viandacumple/`, `postres/`).

Nombre de archivo: `<categoria>-<producto>-<n>.<ext>` (ej: `viandas-canelones-1.webp`, `viandas-canelones-2.png`, `viandas-canelones-video.mp4`). El número indica orden: `-1` es la portada, `-2` en adelante son fotos de galería (carrusel dentro de la card).

**Excepción**: los productos que ya tenían nombres cortos y claros desde antes (ej. `wc-choc.png`, `des-clasico-2.png`) se dejaron como estaban.

Las fotos subidas desde el admin caen en R2 con un nombre de timestamp automático — es normal que no siga la convención, ya que lo genera el sistema.

## 5. Dos flujos de pedido distintos (¡no se mezclan!)

- **Carrito** (`ProductCard` → botón "Agregar"): para productos de catálogo normal (viandas, panificados, waffles congelados). Se acumulan en el carrito (`CartProvider`) y se despachan juntos en un solo mensaje de WhatsApp al finalizar, con datos de cliente, día de entrega/retiro, dirección, cupón aplicado y forma de pago (`components/Cart.tsx` + `lib/cart.ts`).
- **Encargar/Consultar** (`ProductCard` → botón correspondiente): para productos a pedido con datos particulares — Desayunos y Meriendas, Postres individuales, Vianda Fiesta!. Cada uno abre su propio modal (`DesayunoOrderModal`, `PostreModulosModal`, `ViandaCumpleOrderModal`) que arma **su propio mensaje** y abre WhatsApp directo, sin tocar el carrito para nada.

Un cliente puede tener cosas en el carrito Y encargar un desayuno aparte — son dos mensajes de WhatsApp independientes. Los cupones de descuento **solo aplican al carrito**, no a los formularios de "Encargar".

## 6. Stock

Cada producto tiene stock, editable desde el admin. Hay tres formas de trackearlo según el tipo de producto:

- **Stock simple** (`stock`): productos comunes sin variantes.
- **Stock por sabor** (`stockDulces` / `stockSalados`): waffles congelados con selector Dulce/Salado — **también se usa para los que NO tienen selector** (ej. chocolate), donde ambos campos deben coincidir con la disponibilidad real, porque el admin siempre edita estos dos campos para la categoría "Waffles Congelados", nunca `stock` directamente.
- **Stock por variante** (`variantes[].stock`): productos con varias opciones (ej. Hamburguesas de legumbres: Lentejas/Arvejas/Garbanzo/Soja).

El campo se vuelve `0` (no `undefined`) cuando no hay stock — el código trata "no definido" como "sin stock" para evitar que un producto recién creado aparezca disponible por error.

**Descuento automático**: cuando un cliente confirma un pedido por WhatsApp desde el carrito, el sitio llama a `POST /api/orders/checkout`, que descuenta la cantidad comprada del stock correspondiente. No bloquea el envío del pedido si falla — el stock siempre se puede corregir a mano desde el admin. Los pedidos de "Encargar/Consultar" (desayunos, postres, vianda fiesta) **no** descuentan stock automáticamente porque son a pedido, no de catálogo con cantidad fija.

## 7. Cupones de descuento

Sistema simple de códigos (`data/coupons.json` / R2): porcentaje de descuento, activo/inactivo, y opcionalmente limitado a ciertas categorías. Se validan desde el carrito contra `POST /api/coupons/validate` y se administran desde `/admin` → sección Cupones. Solo aplican al flujo de carrito (ver sección 5).

## 8. Panel de administración

Ruta `/admin`, protegido con contraseña (`ADMIN_PASSWORD`). La sesión usa un token firmado con HMAC (`ADMIN_SESSION_SECRET`) en una cookie `httpOnly` — no es una cookie falsificable a mano desde la consola del navegador.

Desde el admin se puede: crear/editar/ocultar productos, subir fotos (portada + galería), cambiar precios y stock, y administrar cupones. Todos los cambios se guardan en Cloudflare R2 (ver sección 9), así que quedan permanentes aunque Vercel reinicie el servidor.

## 9. Almacenamiento de datos (productos y cupones)

Hasta julio 2026 el sitio guardaba `products.json` y `coupons.json` directamente en el servidor. Se descubrió que **el filesystem de Vercel es de solo lectura en producción** — cualquier cambio hecho desde el admin (stock, precio, cupones) se perdía o directamente fallaba al guardar una vez publicado el sitio.

**Solución implementada**: los datos ahora se leen y escriben en **Cloudflare R2** (`lib/r2.ts`, `lib/products-data.ts`, `lib/coupons-data.ts`). Orden de prioridad al leer (`lib/sheets.ts` → `fetchProducts()`):

1. **R2** (`data/products.json` / `data/coupons.json` dentro del bucket) — fuente principal, es lo que edita el admin.
2. Si R2 no tiene nada todavía: el archivo local `data/products.json` / `data/coupons.json` del repo (solo pasa en el primer arranque, antes de la migración inicial).
3. Google Sheets (si está configurado) como respaldo adicional.
4. `lib/catalog-seed.ts` como último respaldo fijo, hardcodeado en el código.

En la práctica, en uso normal, **siempre se lee y se escribe en R2**. Los archivos locales `data/*.json` quedaron como semilla histórica, no se vuelven a tocar automáticamente.

## 10. Fotos de productos

Igual que los datos, las fotos subidas desde el admin van a R2 (bucket `celisan-productos`, URL pública `R2_PUBLIC_URL`). Las fotos que ya vienen en el repo (`public/images/productos/`) siguen sirviéndose como archivos estáticos normales de Next.js — no hace falta migrarlas, solo las que suba el admin a futuro.

## 11. Variables de entorno necesarias

Tienen que estar cargadas tanto en `.env.local` (desarrollo local) como en Vercel → Settings → Environment Variables (producción):

| Variable | Para qué es |
|---|---|
| `ADMIN_PASSWORD` | contraseña de acceso a `/admin` |
| `ADMIN_SESSION_SECRET` | firma la cookie de sesión del admin |
| `R2_ACCOUNT_ID` | cuenta de Cloudflare |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | credenciales del token R2 (Object Read & Write) |
| `R2_BUCKET_NAME` | nombre del bucket (`celisan-productos`) |
| `R2_PUBLIC_URL` | URL pública desde donde se sirven las fotos/datos del bucket |

Si falta alguna de estas en Vercel, el sitio en producción no puede guardar productos/cupones/fotos nuevas.

## 12. Identidad visual

- **Colores** (`tailwind.config.ts`): `celisan-red` (#722F37, vino/bordó), `olive` (#808000, verde oliva), `olive-light` (#9A9A00), `cream` (#FFFDF5, fondo general).
- **Tono**: cálido, artesanal, con emojis en textos de producto y WhatsApp para reforzar cercanía.
- **Componentes reutilizables de UI**: badges de stock ("¡Hay stock!", "¡Queda uno solo!", "Sin stock"), carrusel de fotos con flechas + puntitos, lightbox de imagen ampliada, reproductor de video inline en las cards.

## 13. Estado del despliegue

Todo el trabajo vive en `main`. El dominio de producción real **sigue mostrando la página de "en actualización"** (`app/page-mantenimiento.tsx`) — el archivo `app/page.tsx` real (catálogo completo) está desarrollado y probado, pero deliberadamente no publicado todavía hasta que la dueña del sitio decida salir en vivo. Publicar consiste en reemplazar el contenido de `app/page.tsx` en `main` por la versión real y hacer push — no requiere ningún otro cambio de infraestructura, ya que R2 y las variables de entorno de Vercel ya están configuradas.

**Pendiente**: la dueña del sitio no activó la verificación en dos pasos (2FA) de su cuenta de Vercel — conviene activarla antes o justo después de publicar el sitio en vivo, para proteger el acceso a las claves y el dominio.
