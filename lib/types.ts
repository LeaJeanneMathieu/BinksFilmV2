export type Video = {
  slug: string;
  artist: string;
  title: string;
  year: string;
  role: string;
  duration: string;
  youtubeId: string;
  thumbnail: string;
  description: string;
  credits: { role: string; name: string }[];
  gallery: string[];
};

export type PhotoSeries = {
  slug: string;
  index: string;
  title: string;
  photos: number;
  year: string;
  time: string;
  /** Si défini, affiche une image ; sinon placeholder selon `placeholder` */
  image?: string;
  /** Carré plein sans image maquette : `black` ou `white` */
  placeholder?: "black" | "white";
  featured?: boolean;
};

export type ArchiveItem = {
  id: string;
  type: "VIDÉO" | "PHOTO" | "AUDIO" | "NOTES" | "AUTRES";
  title: string;
  detail: string;
  duration?: string;
  image?: string;
  /** Carré sans image tant que le client n'a pas fourni de visuel */
  placeholder?: "black" | "white";
  quote?: string;
};

export type SiteConfig = {
  brand: string;
  tagline: string;
  email: string;
  instagram: string;
  youtube: string;
  phone: string;
  youtubePlaylistId?: string;
  youtubePlaylistUrl?: string;
  homeVideo?: string;
  homeVideoPoster?: string;
};

export type Artist = { name: string; image: string };

export const PROJECT_TYPES = [
  "CLIP VIDÉO",
  "PUBLICITÉ",
  "COURT MÉTRAGE",
  "ÉVÉNEMENTIEL",
  "DOCUMENTAIRE",
  "AUTRE",
] as const;
