import { randomUUID } from "crypto";
import photosSeed from "@/data/photos.json";
import type { PhotoSeries } from "@/lib/types";
import {
  deletePhotoFile,
  isBlobStorageEnabled,
  loadPhotosStore,
  savePhotosStore,
} from "@/lib/photos/storage";
import type { PhotoRecord, PhotoSeriesRecord, PhotosStore } from "@/lib/photos/types";

function seedFromLegacyJson(): PhotosStore {
  const now = new Date().toISOString();
  const series: PhotoSeriesRecord[] = (photosSeed as PhotoSeries[]).map((s) => ({
    id: randomUUID(),
    slug: s.slug,
    title: s.title,
    index: s.index,
    year: s.year,
    time: s.time,
    placeholder: s.placeholder === "white" ? "white" : "black",
    createdAt: now,
    updatedAt: now,
  }));
  return { series, photos: [] };
}

async function ensureStore(): Promise<PhotosStore> {
  const existing = await loadPhotosStore();
  if (existing) return existing;

  const seeded = seedFromLegacyJson();
  await savePhotosStore(seeded);
  return seeded;
}

export async function readPhotosStore(): Promise<PhotosStore> {
  return ensureStore();
}

async function writePhotosStore(store: PhotosStore): Promise<void> {
  await savePhotosStore(store);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function uniqueSlug(store: PhotosStore, base: string): string {
  let slug = base || "serie";
  let n = 0;
  while (store.series.some((s) => s.slug === slug)) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function createSeries(input: {
  title: string;
  year?: string;
  time?: string;
  placeholder?: "black" | "white";
}): Promise<PhotoSeriesRecord> {
  const store = await readPhotosStore();
  const now = new Date().toISOString();
  const base = slugify(input.title);
  const series: PhotoSeriesRecord = {
    id: randomUUID(),
    slug: uniqueSlug(store, base),
    title: input.title.trim(),
    index: `/${String(store.series.length + 1).padStart(2, "0")}`,
    year: input.year ?? new Date().getFullYear().toString(),
    time: input.time ?? "12:00 PM",
    placeholder: input.placeholder ?? "black",
    createdAt: now,
    updatedAt: now,
  };
  store.series.push(series);
  await writePhotosStore(store);
  return series;
}

export async function updateSeries(
  id: string,
  patch: Partial<Pick<PhotoSeriesRecord, "title" | "year" | "time" | "placeholder">>,
): Promise<PhotoSeriesRecord | null> {
  const store = await readPhotosStore();
  const i = store.series.findIndex((s) => s.id === id);
  if (i === -1) return null;
  const current = store.series[i];
  const updated: PhotoSeriesRecord = {
    ...current,
    ...patch,
    title: patch.title?.trim() ?? current.title,
    updatedAt: new Date().toISOString(),
  };
  store.series[i] = updated;
  await writePhotosStore(store);
  return updated;
}

export async function deleteSeries(id: string): Promise<boolean> {
  const store = await readPhotosStore();
  const before = store.series.length;
  const removedPhotos = store.photos.filter((p) => p.seriesId === id);
  store.series = store.series.filter((s) => s.id !== id);
  store.photos = store.photos.filter((p) => p.seriesId !== id);
  if (store.series.length === before) return false;
  await writePhotosStore(store);
  await Promise.all(removedPhotos.map((p) => deletePhotoFile(p.path)));
  return true;
}

export async function addPhotoRecord(input: {
  seriesId: string;
  path: string;
  isPublic?: boolean;
}): Promise<PhotoRecord | null> {
  const store = await readPhotosStore();
  if (!store.series.some((s) => s.id === input.seriesId)) return null;
  const inSeries = store.photos.filter((p) => p.seriesId === input.seriesId);
  const photo: PhotoRecord = {
    id: randomUUID(),
    seriesId: input.seriesId,
    path: input.path,
    sortOrder: inSeries.length,
    isPublic: input.isPublic ?? false,
    createdAt: new Date().toISOString(),
  };
  store.photos.push(photo);
  await writePhotosStore(store);
  return photo;
}

export async function updatePhoto(
  id: string,
  patch: Partial<Pick<PhotoRecord, "isPublic" | "seriesId" | "sortOrder">>,
): Promise<PhotoRecord | null> {
  const store = await readPhotosStore();
  const i = store.photos.findIndex((p) => p.id === id);
  if (i === -1) return null;
  if (patch.seriesId && !store.series.some((s) => s.id === patch.seriesId)) {
    return null;
  }
  store.photos[i] = { ...store.photos[i], ...patch };
  await writePhotosStore(store);
  return store.photos[i];
}

export async function deletePhoto(id: string): Promise<PhotoRecord | null> {
  const store = await readPhotosStore();
  const i = store.photos.findIndex((p) => p.id === id);
  if (i === -1) return null;
  const [removed] = store.photos.splice(i, 1);
  await writePhotosStore(store);
  await deletePhotoFile(removed.path);
  return removed;
}

export async function ensureUploadDir(): Promise<string> {
  const { ensureLocalUploadDir } = await import("@/lib/photos/storage");
  return ensureLocalUploadDir();
}

/** Séries visibles sur le site : uniquement celles avec au moins une photo publiée. */
export async function getPublicSeriesForSite(): Promise<PhotoSeries[]> {
  const store = await readPhotosStore();
  const result: PhotoSeries[] = [];

  for (const s of store.series) {
    const seriesPhotos = store.photos
      .filter((p) => p.seriesId === s.id && p.isPublic)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    if (seriesPhotos.length === 0) continue;

    result.push({
      slug: s.slug,
      index: s.index,
      title: s.title,
      photos: seriesPhotos.length,
      year: s.year,
      time: s.time,
      placeholder: s.placeholder,
      image: seriesPhotos[0]?.path,
    });
  }

  if (result.length > 0) return result;

  return photosSeed as PhotoSeries[];
}

export async function getAdminView(): Promise<{
  series: (PhotoSeriesRecord & { photos: PhotoRecord[] })[];
}> {
  const store = await readPhotosStore();
  return {
    series: store.series.map((s) => ({
      ...s,
      photos: store.photos
        .filter((p) => p.seriesId === s.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    })),
  };
}

export { isBlobStorageEnabled };
