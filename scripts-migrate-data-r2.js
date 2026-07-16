// Script de migración única: sube data/products.json y data/coupons.json a R2.
// Uso: node scripts-migrate-data-r2.js
const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

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

async function uploadJson(localFile, key) {
  const body = fs.readFileSync(path.join(process.cwd(), localFile), "utf-8");
  JSON.parse(body); // valida que sea JSON correcto antes de subir
  await client.send(
    new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: "application/json" })
  );
  console.log(`OK: ${localFile} -> ${key} (${body.length} bytes)`);
}

async function main() {
  await uploadJson("data/products.json", "data/products.json");
  await uploadJson("data/coupons.json", "data/coupons.json");
  console.log("Listo. Datos subidos a R2.");
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
