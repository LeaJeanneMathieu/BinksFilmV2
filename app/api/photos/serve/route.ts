import { type NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { isBlobStorageEnabled } from "@/lib/photos/storage";
import { readPhotosStore } from "@/lib/photos/store";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname");
  if (!pathname || pathname.includes("..")) {
    return NextResponse.json({ error: "pathname invalide" }, { status: 400 });
  }

  if (pathname.startsWith("/uploads/")) {
    return NextResponse.redirect(new URL(pathname, request.url));
  }

  if (!isBlobStorageEnabled()) {
    return new NextResponse("Stockage Blob non configuré", { status: 503 });
  }

  const store = await readPhotosStore();
  const photo = store.photos.find((p) => storedPathMatches(p.path, pathname));

  const admin = await isAdminAuthenticated().catch(() => false);
  if (photo && !photo.isPublic && !admin) {
    return new NextResponse("Non autorisé", { status: 403 });
  }

  if (!photo && !admin) {
    return new NextResponse("Non trouvé", { status: 404 });
  }

  try {
    const result = await get(pathname, { access: "private" });
    if (result?.statusCode !== 200 || !result.stream) {
      const pub = await get(pathname, { access: "public" });
      if (pub?.statusCode === 200 && pub.stream) {
        return streamBlob(pub);
      }
      return new NextResponse("Non trouvé", { status: 404 });
    }
    return streamBlob(result);
  } catch {
    return new NextResponse("Erreur lecture fichier", { status: 500 });
  }
}

function storedPathMatches(stored: string, pathname: string): boolean {
  if (stored === pathname) return true;
  if (stored.endsWith(`/${pathname}`)) return true;
  if (stored.startsWith("http")) {
    try {
      return new URL(stored).pathname.replace(/^\//, "") === pathname;
    } catch {
      return false;
    }
  }
  return false;
}

function streamBlob(result: {
  stream: ReadableStream;
  blob: { contentType: string };
}) {
  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
