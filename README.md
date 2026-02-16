# Celisan - Landing Page

Landing de waffles artesanales con catálogo, carrito y pedidos por WhatsApp.

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Imágenes

Las fotos de productos se sirven desde `/public/`. Si no existen, se muestra un placeholder. Nombres esperados:

- `avocado-tomato.jpg` — Avocado & Tomato
- `jamon-queso.jpg` — Jamón y Queso
- `dulce-banana.jpg` — Dulce de Leche y Banana
- `frutos-bosque.jpg` — Frutos del Bosque
- `ready-toast.jpg` — Packs Ready to Toast

Ver `public/README-imagenes.md` para más detalle.

## WhatsApp

En `lib/cart.ts` define la constante `WHATSAPP_NUMBER` (número con código de país, sin +). Ejemplo: `5491112345678`.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
