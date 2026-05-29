import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/session";

export async function requireAdmin(): Promise<NextResponse | null> {
  try {
    if (await isAdminAuthenticated()) return null;
  } catch {
    return NextResponse.json(
      { error: "Configuration serveur : définir ADMIN_PASSWORD dans .env.local" },
      { status: 500 },
    );
  }
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}
