import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { deletePhoto, updatePhoto } from "@/lib/photos/store";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  let body: { isPublic?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  if (typeof body.isPublic !== "boolean") {
    return NextResponse.json({ error: "isPublic (true/false) requis" }, { status: 400 });
  }

  try {
    const photo = await updatePhoto(id, { isPublic: body.isPublic });
    if (!photo) {
      return NextResponse.json({ error: "Photo introuvable" }, { status: 404 });
    }
    return NextResponse.json({ photo });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    console.error("[photos PATCH]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  try {
    const removed = await deletePhoto(id);
    if (!removed) {
      return NextResponse.json({ error: "Photo introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
