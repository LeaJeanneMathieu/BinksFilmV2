export type SpotifyPlaylistConfig = {
  spotifyPlaylistUrl?: string;
  spotifyPlaylistId?: string;
};

/** Extrait l’ID playlist depuis une URL Spotify, ou retourne l’ID brut. */
export function resolveSpotifyPlaylistId(
  config: SpotifyPlaylistConfig,
): string | null {
  const rawId = config.spotifyPlaylistId?.trim();
  if (rawId) return rawId;
  const url = config.spotifyPlaylistUrl?.trim();
  if (!url) return null;
  const fromPath = url.match(/playlist\/([a-zA-Z0-9]+)/);
  if (fromPath) return fromPath[1];
  return null;
}

/** Lien « ouvrir dans l’app » (préfère l’URL fournie par le client). */
export function resolveSpotifyPlaylistOpenUrl(
  config: SpotifyPlaylistConfig,
  id: string | null,
): string | null {
  const url = config.spotifyPlaylistUrl?.trim();
  if (url) return url;
  if (id) return `https://open.spotify.com/playlist/${id}`;
  return null;
}
