#!/usr/bin/env node
/**
 * Synchronise data/videos.json depuis la playlist YouTube BINKSFILMS (Palmarès).
 * Usage: node scripts/sync-videos-playlist.mjs
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const PLAYLIST_ID = "PL779no_N_2bDoeOr0kD2cG511Fck00gtb";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../data/videos.json");

const DEFAULT_CREDITS = [
  { role: "DIRECTOR", name: "BINKSFILMS" },
  { role: "PRODUCTION", name: "BINKSFILMS" },
  { role: "DP", name: "—" },
  { role: "VFX", name: "—" },
];

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parseTitle(raw, channel) {
  let clean = raw.replace(/\s+/g, " ").trim();
  clean = clean.replace(
    /\s*[\(\[]?\s*(clip\s+officiel|clip\s+official|official\s+video|freestyle).*?[\)\]]?\s*$/i,
    "",
  ).trim();
  let artist, title;
  if (clean.includes(" - ")) {
    [artist, title] = clean.split(" - ", 2).map((x) => x.trim());
  } else if (clean.includes("(")) {
    artist = clean.slice(0, clean.indexOf("(")).trim();
    title = clean.slice(clean.indexOf("(") + 1).replace(/\)$/, "").trim();
  } else {
    artist = channel || "ARTISTE";
    title = clean;
  }
  return [artist.toUpperCase(), title.toUpperCase()];
}

const res = await fetch(RSS_URL);
if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
const xml = await res.text();

const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
const videos = [];
const seenSlugs = new Set();

for (const block of entries) {
  const id = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
  if (!id) continue;
  const rawTitle = block.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const channel = block.match(/<name>([^<]*)<\/name>/)?.[1] ?? "";
  const year = (block.match(/<published>(\d{4})/)?.[1] ?? "");
  const desc = block.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? "";
  const [artist, title] = parseTitle(rawTitle, channel);
  let slug = slugify(`${artist}-${title}`) || id.toLowerCase();
  let n = 2;
  while (seenSlugs.has(slug)) slug = `${slugify(`${artist}-${title}`)}-${n++}`;
  seenSlugs.add(slug);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  videos.push({
    slug,
    artist,
    title,
    year,
    role: "RÉALISATION",
    duration: "—",
    youtubeId: id,
    thumbnail: thumb,
    description: desc.trim() || `Clip réalisé par BINKSFILMS — ${artist} · ${title}.`,
    credits: DEFAULT_CREDITS,
    gallery: [thumb],
  });
}

writeFileSync(OUT, JSON.stringify(videos, null, 2) + "\n", "utf-8");
console.log(`Synced ${videos.length} videos → ${OUT}`);
