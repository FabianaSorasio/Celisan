/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Evita que Vercel empaquete las fotos/videos de /public/images dentro de
  // cada función de la API (eso hacía que la función de subida de imágenes
  // superara el límite de tamaño permitido).
  experimental: {
    outputFileTracingExcludes: {
      "*": ["public/images/**", "public/videos/**"],
    },
  },
  async headers() {
    return [
      {
        source: "/:path*.mp4",
        headers: [
          { key: "Content-Type", value: "video/mp4" },
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/:path*.webm",
        headers: [
          { key: "Content-Type", value: "video/webm" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
