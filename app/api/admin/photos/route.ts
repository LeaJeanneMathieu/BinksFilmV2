import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminView } from "@/lib/photos/store";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const data = await getAdminView();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
