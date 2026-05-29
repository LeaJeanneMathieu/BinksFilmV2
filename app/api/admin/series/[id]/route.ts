import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { deleteSeries, updateSeries } from "@/lib/photos/store";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  let body: { title?: string; year?: string; time?: string; placeholder?: "black" | "white" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const series = await updateSeries(id, body);
  if (!series) return NextResponse.json({ error: "Série introuvable" }, { status: 404 });
  return NextResponse.json({ series });
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const ok = await deleteSeries(id);
  if (!ok) return NextResponse.json({ error: "Série introuvable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
