import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth/require-admin";
import { addPhotoRecord } from "@/lib/photos/store";
import { uploadPhotoFile } from "@/lib/photos/storage";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulaire invalide" }, { status: 400 });
  }

  const seriesId = String(form.get("seriesId") ?? "");
  const file = form.get("file");
  if (!seriesId || !(file instanceof File)) {
    return NextResponse.json({ error: "seriesId et file requis" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Format accepté : JPEG, PNG ou WebP" },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 15 Mo)" }, { status: 400 });
  }

  const ext =
    file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const publicPath = await uploadPhotoFile(buffer, filename, file.type);

  const photo = await addPhotoRecord({
    seriesId,
    path: publicPath,
    isPublic: false,
  });

  if (!photo) {
    return NextResponse.json({ error: "Série introuvable" }, { status: 404 });
  }

  return NextResponse.json({ photo });
}
