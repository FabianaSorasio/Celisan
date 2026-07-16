import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Falta la variable de entorno ${key}`);
  return value;
}

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;
  client = new S3Client({
    region: "auto",
    endpoint: `https://${getEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

/** Sube un archivo a R2 y devuelve su URL pública. */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: getEnv("R2_BUCKET_NAME"),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  const publicUrl = getEnv("R2_PUBLIC_URL").replace(/\/$/, "");
  return `${publicUrl}/${key}`;
}

/** Descarga un archivo de texto de R2. Devuelve null si no existe. */
export async function downloadTextFromR2(key: string): Promise<string | null> {
  try {
    const res = await getClient().send(
      new GetObjectCommand({ Bucket: getEnv("R2_BUCKET_NAME"), Key: key })
    );
    const text = await res.Body?.transformToString("utf-8");
    return text ?? null;
  } catch (err) {
    const code = (err as { name?: string; $metadata?: { httpStatusCode?: number } });
    if (code.name === "NoSuchKey" || code.$metadata?.httpStatusCode === 404) return null;
    throw err;
  }
}

/** Guarda un objeto como JSON en R2 (para datos que edita el admin: productos, cupones). */
export async function saveJsonToR2(key: string, data: unknown): Promise<void> {
  await uploadToR2(key, Buffer.from(JSON.stringify(data, null, 2), "utf-8"), "application/json");
}

/** Lee y parsea un JSON de R2. Devuelve null si no existe. */
export async function readJsonFromR2<T>(key: string): Promise<T | null> {
  const text = await downloadTextFromR2(key);
  if (text === null) return null;
  return JSON.parse(text) as T;
}
