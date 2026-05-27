import {
  resolveSpotifyPlaylistId,
  resolveSpotifyPlaylistOpenUrl,
  type SpotifyPlaylistConfig,
} from "@/lib/spotify";

export default function SpotifyPlaylistSection({
  config,
}: {
  config: SpotifyPlaylistConfig;
}) {
  const id = resolveSpotifyPlaylistId(config);
  const openUrl = resolveSpotifyPlaylistOpenUrl(config, id);

  if (!id) {
    return (
      <div className="musique-spotify musique-spotify--empty">
        <p className="musique-spotify__empty-title">PLAYLIST SPOTIFY</p>
        <p className="musique-spotify__empty-text">
          La sélection Spotify sera intégrée ici dès que le lien de la playlist
          sera renseigné dans{" "}
          <code className="musique-spotify__code">data/spotify-playlist.json</code>{" "}
          (<code className="musique-spotify__code">spotifyPlaylistUrl</code> ou{" "}
          <code className="musique-spotify__code">spotifyPlaylistId</code>).
        </p>
      </div>
    );
  }

  const embedSrc = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;

  return (
    <div className="musique-spotify">
      <iframe
        title="Playlist Spotify BINKSFILMS"
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
