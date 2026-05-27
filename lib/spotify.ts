export type SpotifyPlaylistConfig = {
  /** Lien Spotify (album ou playlist), y compris `intl-fr`, etc. — prioritaire */
  spotifyUrl?: string;
  /** @deprecated utiliser `spotifyUrl` ; conservé pour compatibilité */
  spotifyPlaylistUrl?: string;
  spotifyPlaylistId?: string;
};

export type SpotifyEmbed =
  | { kind: "album"; id: string }
  | { kind: "playlist"; id: string };

/**
 * Détecte album ou playlist depuis une URL, ou playlist seule si seul `spotifyPlaylistId` est renseigné.
 */
export function resolveSpotifyEmbed(
  config: SpotifyPlaylistConfig,
): SpotifyEmbed | null {
  const url = (config.spotifyUrl ?? config.spotifyPlaylistUrl)?.trim();
  if (url) {
    const m = url.match(/\/(album|playlist)\/([a-zA-Z0-9]+)/i);
    if (m) {
      const kind = m[1].toLowerCase() === "album" ? "album" : "playlist";
      return { kind, id: m[2] };
    }
  }
  const idOnly = config.spotifyPlaylistId?.trim();
  if (idOnly) return { kind: "playlist", id: idOnly };
  return null;
}

/** Lien « ouvrir dans Spotify » (URL client si fournie, sinon construit). */
export function resolveSpotifyOpenUrl(
  config: SpotifyPlaylistConfig,
  embed: SpotifyEmbed | null,
): string | null {
  const direct = (config.spotifyUrl ?? config.spotifyPlaylistUrl)?.trim();
  if (direct) return direct;
  if (!embed) return null;
  if (embed.kind === "album") {
    return `https://open.spotify.com/album/${embed.id}`;
  }
  return `https://open.spotify.com/playlist/${embed.id}`;
}
