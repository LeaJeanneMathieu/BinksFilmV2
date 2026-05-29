import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { del, get, put } from "@vercel/blob";
import type { PhotosStore } from "@/lib/photos/types";

const BLOB_STORE_KEY = "binks/photos-store.json";
const LOCAL_STORE_PATH = path.join(process.cwd(), "data", "photos-store.json");
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "photos");

export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function loadPhotosStore(): Promise<PhotosStore | null> {
  if (isBlobStorageEnabled()) {
    try {
      const result = await get(BLOB_STORE_KEY, { access: "private" });
      if (result?.statusCode === 200 && result.stream) {
        const raw = await new Response(result.stream).text();
        return JSON.parse(raw) as PhotosStore;
      }
    } catch {
      return null;
    }
    return null;
  }

  try {
    const raw = await readFile(LOCAL_STORE_PATH, "utf8");
    return JSON.parse(raw) as PhotosStore;
  } catch {
    return null;
  }
}

export async function savePhotosStore(store: PhotosStore): Promise<void> {
  const json = JSON.stringify(store);

  if (isBlobStorageEnabled()) {
    await put(BLOB_STORE_KEY, json, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  await mkdir(path.dirname(LOCAL_STORE_PATH), { recursive: true });
  await writeFile(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function uploadPhotoFile(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  if (isBlobStorageEnabled()) {
    const pathname = `binks/photos/${filename}`;
    const blob = await put(pathname, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType,
    });
    return blob.url;
  }

  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOAD_DIR, filename), buffer);
  return `/uploads/photos/${filename}`;
}

export async function deletePhotoFile(pathOrUrl: string): Promise<void> {
  if (pathOrUrl.startsWith("http")) {
    if (isBlobStorageEnabled()) {
      try {
        await del(pathOrUrl);
      } catch {
        /* déjà supprimé */
      }
    }
    return;
  }

  if (pathOrUrl.startsWith("/uploads/")) {
    const diskPath = path.join(process.cwd(), "public", pathOrUrl);
    try {
      await unlink(diskPath);
    } catch {
      /* déjà absent */
    }
  }
}

export async function ensureLocalUploadDir(): Promise<string> {
  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  return LOCAL_UPLOAD_DIR;
}
