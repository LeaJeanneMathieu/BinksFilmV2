import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "BINKSFILMS — Les Beaux Arts du Ghetto",
    template: "%s | BINKSFILMS",
  },
  description:
    "Créateur de clips musicaux, photographie et contenus visuels. Les Beaux Arts du Ghetto.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
