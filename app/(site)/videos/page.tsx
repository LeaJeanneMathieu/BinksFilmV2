import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import FilterButton from "@/components/layout/FilterButton";
import VideoRow from "@/components/videos/VideoRow";
import { site, videos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vidéos",
  description: "Palmarès — clips musicaux réalisés par BINKSFILMS.",
};

export default function VideosPage() {
  return (
    <>
      <PageHeader
        title="VIDÉOS"
        meta={
          <>
            <span>{videos.length} PROJETS</span>
            <span className="page-header__meta-suffix">— PALMARÈS</span>
          </>
        }
        action={<FilterButton />}
      />
      {site.youtubePlaylistUrl && (
        <p className="videos-playlist-lede">
          <a
            href={site.youtubePlaylistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="videos-playlist-lede__link"
          >
            VOIR LA PLAYLIST COMPLÈTE SUR YOUTUBE ↗
          </a>
        </p>
      )}
      <div className="content">
        <div className="video-list">
          {videos.map((v) => (
            <VideoRow key={v.slug} video={v} />
          ))}
        </div>
      </div>
    </>
  );
}
