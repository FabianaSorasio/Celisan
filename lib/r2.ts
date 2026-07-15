import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
