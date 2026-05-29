/** URL affichable (admin + site public) pour un chemin stocké. */
export function photoDisplayUrl(path: string): string {
  if (path.startsWith("/uploads/")) return path;
  if (path.startsWith("/api/photos/serve")) return path;

  if (path.startsWith("http")) {
    const pathname = blobUrlToPathname(path);
    if (pathname) {
      return `/api/photos/serve?pathname=${encodeURIComponent(pathname)}`;
    }
    return path;
  }

  return `/api/photos/serve?pathname=${encodeURIComponent(path)}`;
}

function blobUrlToPathname(url: string): string | null {
  try {
    const u = new URL(url);
    const p = u.pathname.replace(/^\//, "");
    return p || null;
  } catch {
    return null;
  }
}
