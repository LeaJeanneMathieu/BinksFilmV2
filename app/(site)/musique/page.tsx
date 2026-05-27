import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import SpotifyPlaylistSection from "@/components/musique/SpotifyPlaylistSection";
import { spotifyPlaylist } from "@/lib/content";

export const metadata: Metadata = {
  title: "Musique",
  description: "Sélection musicale BINKSFILMS sur Spotify.",
};

export default function MusiquePage() {
  return (
    <>
      <PageHeader title="MUSIQUE" />
      <div className="musique-intro">
        <p>DES MIXTAPES. DES ÉPOQUES.</p>
        <p>DES AMBIANCES.</p>
        <p>BRUTES, SINCÈRES, SANS FILTRE.</p>
        <p>APPUIE SUR PLAY ET ENTRE DANS L&apos;UNIVERS.</p>
        <div className="musique-intro__line" />
      </div>
      <div className="musique-spotify-wrap">
        <SpotifyPlaylistSection config={spotifyPlaylist} />
      </div>
    </>
  );
}
