/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
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
