import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminView } from "@/lib/photos/store";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const data = await getAdminView();
  return NextResponse.json(data);
}
