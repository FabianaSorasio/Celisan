// Script de migración única: sube public/images/productos/ a Cloudflare R2.
// Uso: node scripts-migrate-r2.js
const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Cargar .env.local a mano (sin depender del paquete dotenv)
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v",
};

function getEnv(key) {
  const v = process.env[key];
  if (!v) throw new Error(`Falta ${key} en .env.local`);
  return v;
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${getEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
  },
});

const BUCKET = getEnv("R2_BUCKET_NAME");
const ROOT = path.join(process.cwd(), "public", "images", "productos");

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

async function main() {
  const files = walk(ROOT).filter((f) => path.basename(f) !== ".gitkeep");
  console.log(`Subiendo ${files.length} archivos a R2 (bucket: ${BUCKET})...`);

  let done = 0;
  for (const filePath of files) {
    const rel = path.relative(path.join(process.cwd(), "public"), filePath).replace(/\\/g, "/");
    const key = rel; // ej: images/productos/viandas/viandas-lasagna-1.webp
    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
    const body = fs.readFileSync(filePath);

    await client.send(
      new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType })
    );
    done++;
    if (done % 20 === 0 || done === files.length) {
      console.log(`  ${done}/${files.length}`);
    }
  }
  console.log("Listo. Todos los archivos subidos a R2.");
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
