import siteData from "@/data/site.json";
import videosData from "@/data/videos.json";
import photosData from "@/data/photos.json";
import archivesData from "@/data/archives.json";
import spotifyPlaylistData from "@/data/spotify-playlist.json";
import artistsData from "@/data/artists.json";
import type { SpotifyPlaylistConfig } from "@/lib/spotify";
import type { ArchiveItem, Artist, PhotoSeries, SiteConfig, Video } from "@/lib/types";

export const site = siteData as SiteConfig;
export const videos = videosData as Video[];
export const photos = photosData as PhotoSeries[];
export const archives = archivesData as ArchiveItem[];
export const spotifyPlaylist = spotifyPlaylistData as SpotifyPlaylistConfig;
export const artists = artistsData as Artist[];

export function getVideo(slug: string): Video | undefined {
  return videos.find((v) => v.slug === slug);
}

export function getAdjacentVideos(slug: string): {
  prev: Video | null;
  next: Video | null;
} {
  const i = videos.findIndex((v) => v.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? videos[i - 1] : null,
    next: i < videos.length - 1 ? videos[i + 1] : null,
  };
}

export const NAV_ITEMS = [
  { href: "/accueil", label: "ACCUEIL" },
  { href: "/videos", label: "VIDÉOS" },
  { href: "/photo", label: "PHOTO" },
  { href: "/musique", label: "MUSIQUE" },
  { href: "/archives", label: "ARCHIVES" },
  { href: "/contact", label: "CONTACT" },
] as const;
