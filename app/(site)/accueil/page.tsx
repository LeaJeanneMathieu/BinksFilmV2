import type { Metadata } from "next";
import Image from "next/image";
import HomeVideoBackground from "@/components/home/HomeVideoBackground";
import { artists, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Accueil",
  description: "BINKSFILMS — Les Beaux Arts du Ghetto. Clips, photo, musique.",
};

export default function AccueilPage() {
  const videoSrc = site.homeVideo ?? "/assets/hero.mp4";
  const poster = site.homeVideoPoster;

  return (
    <section className="home">
      <HomeVideoBackground src={videoSrc} poster={poster} />
      <div className="home__grain" aria-hidden="true" />
      <div className="home__hero">
        <h1 className="home__logo">BINKSFILMS</h1>
        <p className="home__subtitle">LES BEAUX ARTS DU GHETTO</p>
      </div>
      <div className="home__artists">
        <p className="home__artists-label">ARTISTS</p>
        <div className="home__artists-row">
          {artists.map((a) => (
            <div key={a.name} className="home__artist" title={a.name}>
              <Image src={a.image} alt={a.name} width={48} height={48} unoptimized />
            </div>
          ))}
        </div>
        <div className="home__slider" aria-hidden="true">
          <div className="home__slider-thumb" />
        </div>
      </div>
    </section>
  );
}
