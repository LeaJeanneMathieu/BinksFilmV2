import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth/require-admin";
import { addPhotoRecord } from "@/lib/photos/store";
import { getMaxUploadBytes, isBlobStorageEnabled, uploadPhotoFile } from "@/lib/photos/storage";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export const runtime = "nodejs";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isBlobStorageEnabled() && process.env.VERCEL) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN manquant sur Vercel (Storage → Blob → lier au projet)" },
      { status: 500 },
    );
  }

  try {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json(
        {
          error: process.env.VERCEL
            ? "Fichier trop lourd ou refusé (max 4 Mo sur Vercel). Réduisez la taille de l’image."
            : "Formulaire invalide",
        },
        { status: 400 },
      );
    }

    const seriesId = String(form.get("seriesId") ?? "");
    const file = form.get("file");
    if (!seriesId || !(file instanceof File)) {
      return NextResponse.json({ error: "seriesId et file requis" }, { status: 400 });
    }

    const mime = file.type || "image/jpeg";
    if (!ALLOWED.has(mime)) {
      return NextResponse.json(
        { error: "Format accepté : JPEG, PNG ou WebP" },
        { status: 400 },
      );
    }

    const maxBytes = getMaxUploadBytes();
    if (file.size > maxBytes) {
      const maxMo = Math.round(maxBytes / (1024 * 1024));
      return NextResponse.json(
        { error: `Fichier trop volumineux (max ${maxMo} Mo${process.env.VERCEL ? " sur Vercel" : ""})` },
        { status: 400 },
      );
    }

    const ext = mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg";
    const filename = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const storedPath = await uploadPhotoFile(buffer, filename, mime);

    const photo = await addPhotoRecord({
      seriesId,
      path: storedPath,
      isPublic: false,
    });

    if (!photo) {
      return NextResponse.json({ error: "Série introuvable" }, { status: 404 });
    }

    return NextResponse.json({ photo });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[upload]", err);
    return NextResponse.json({ error: `Upload impossible : ${message}` }, { status: 500 });
  }
}
