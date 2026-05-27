# BINKSFILMS V2

Site portfolio Next.js pour BINKSFILMS — clips, photo, musique, archives et contact.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) — l’écran de chargement redirige vers `/accueil`.

## Modifier le contenu (sans toucher au code React)

| Fichier | Contenu |
|---------|---------|
| [`data/videos.json`](data/videos.json) | Clips (sync depuis la playlist YouTube « Palmarès ») |
| [`data/photos.json`](data/photos.json) | Séries photo (`placeholder`: `black` ou `white` ; optionnel `image` pour vraies photos plus tard) |
| [`data/archives.json`](data/archives.json) | Grille archives (`placeholder` noir/blanc, ou `quote` pour carte texte ; `image` optionnel) |
| [`data/spotify-playlist.json`](data/spotify-playlist.json) | Lien Spotify **`spotifyUrl`** (album ou playlist) |
| [`data/artists.json`](data/artists.json) | Carrousel accueil |
| [`data/site.json`](data/site.json) | Email, réseaux, tagline |

Images locales : placer les fichiers dans [`public/assets/`](public/assets/) et référencer `/assets/nom.jpg` dans les JSON.

**Vidéo d’accueil** : déposer `hero.mp4` (et optionnellement `hero-poster.jpg`) dans `public/assets/`, ou modifier `homeVideo` / `homeVideoPoster` dans [`data/site.json`](data/site.json). Format conseillé : MP4 H.264, muet, boucle, 1920×1080 ou plus, &lt; 15 Mo si possible.

## Pages

- `/` — Écran de chargement (une fois par session)
- `/accueil` — Page d’accueil
- `/videos` — Liste des clips
- `/videos/[slug]` — Fiche clip (YouTube)
- `/photo` — Séries photo
- `/musique` — Album ou playlist Spotify (embed)
- `/archives` — Mémoire / futurs projets
- `/contact` — Formulaire 4 étapes (UI démo, pas d’envoi email)

## Spotify (page Musique — album ou playlist)

Dans [`data/spotify-playlist.json`](data/spotify-playlist.json), renseigner **`spotifyUrl`** avec le lien complet Spotify (album ou playlist), y compris les URLs `intl-fr` :

- Album : `https://open.spotify.com/intl-fr/album/XXXX` ou `https://open.spotify.com/album/XXXX`
- Playlist : `https://open.spotify.com/playlist/XXXX`

**Compatibilité** : tu peux encore utiliser `spotifyPlaylistUrl` + `spotifyPlaylistId` (playlist uniquement pour l’ID seul).

L’album ou la playlist doit être **public** (ou accessible en embed). La page affiche l’iframe officielle + « Ouvrir dans Spotify ».

## Synchroniser les vidéos YouTube

La playlist [Palmarès](https://www.youtube.com/playlist?list=PL779no_N_2bDoeOr0kD2cG511Fck00gtb) alimente `data/videos.json` :

```bash
npm run sync:videos
npm run build
```

## Build production

```bash
npm run build
npm start
```

## Mobile (responsive)

À partir de **900px** de largeur : menu burger, drawer navigation avec **fond assombri** (tap pour fermer), **zone sûre** iPhone (`safe-area-inset`), en-têtes en colonne, grilles vidéo/archives/contact adaptées. Pense à tester sur un vrai téléphone (Safari / Chrome).

## Thème contact

La page contact utilise `data-theme="green"` (accent néon vert). Les autres pages utilisent l’accent rouge défini dans [`css/variables.css`](css/variables.css).
