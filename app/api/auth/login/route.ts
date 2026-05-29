import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkAdminPassword,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD non configuré sur le serveur" },
      { status: 500 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const password = body.password ?? "";
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const token = createSessionToken();
  const jar = await cookies();
  jar.set(sessionCookieOptions(token));

  return NextResponse.json({ ok: true });
}
