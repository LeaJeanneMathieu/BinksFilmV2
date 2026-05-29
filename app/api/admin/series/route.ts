import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createSeries } from "@/lib/photos/store";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { title?: string; year?: string; time?: string; placeholder?: "black" | "white" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const title = body.title?.trim();
  if (!title) {
    return NextResponse.json({ error: "Titre requis" }, { status: 400 });
  }

  const series = await createSeries({
    title,
    year: body.year,
    time: body.time,
    placeholder: body.placeholder,
  });

  return NextResponse.json({ series });
}
