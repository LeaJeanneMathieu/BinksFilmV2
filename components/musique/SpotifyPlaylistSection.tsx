import {
  resolveSpotifyEmbed,
  resolveSpotifyOpenUrl,
  type SpotifyPlaylistConfig,
} from "@/lib/spotify";

export default function SpotifyPlaylistSection({
  config,
}: {
  config: SpotifyPlaylistConfig;
}) {
  const embed = resolveSpotifyEmbed(config);
  const openUrl = resolveSpotifyOpenUrl(config, embed);

  if (!embed) {
    return (
      <div className="musique-spotify musique-spotify--empty">
        <p className="musique-spotify__empty-title">SPOTIFY</p>
        <p className="musique-spotify__empty-text">
          Collez le lien d’une <strong>playlist</strong> ou d’un <strong>album</strong> public dans{" "}
          <code className="musique-spotify__code">data/spotify-playlist.json</code> (champ{" "}
          <code className="musique-spotify__code">spotifyUrl</code>, ou les champs playlist
          historiques).
        </p>
      </div>
    );
  }

  const embedSrc = `https://open.spotify.com/embed/${embed.kind}/${embed.id}?utm_source=generator&theme=0`;
  const title =
    embed.kind === "album" ? "Album Spotify — aperçu" : "Playlist Spotify — aperçu";

  return (
    <div className="musique-spotify">
      <iframe
        title={title}
        style={{ borderRadius: 12 }}
        src={embedSrc}
        width="100%"
        height="560"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
      {openUrl && (
        <p className="musique-spotify__open">
          <a
            href={openUrl}
            className="btn btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            OUVRIR DANS SPOTIFY ↗
          </a>
        </p>
      )}
    </div>
  );
}
