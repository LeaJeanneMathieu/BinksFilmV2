const SITE = {
  brand: "BINKSFILMS",
  tagline: "LES BEAUX ARTS DU GHETTO",
  email: "contact@binksfilms.art",
  instagram: "@binksfilms",
  youtube: "BinksFilms",
  phone: "+33 6 00 00 00 00",
};

const ARTISTS = [
  { name: "Travis Scott", img: "https://i.pravatar.cc/96?img=11" },
  { name: "Lil Wayne", img: "https://i.pravatar.cc/96?img=12" },
  { name: "XXXTentacion", img: "https://i.pravatar.cc/96?img=13" },
  { name: "City Girls", img: "https://i.pravatar.cc/96?img=5" },
  { name: "Lil Yachty", img: "https://i.pravatar.cc/96?img=15" },
  { name: "The Weeknd", img: "https://i.pravatar.cc/96?img=8" },
  { name: "Anna Mavi", img: "https://i.pravatar.cc/96?img=9" },
  { name: "Artist 8", img: "https://i.pravatar.cc/96?img=20" },
  { name: "Artist 9", img: "https://i.pravatar.cc/96?img=22" },
  { name: "Artist 10", img: "https://i.pravatar.cc/96?img=25" },
];

const VIDEOS = [
  {
    id: "fein",
    artist: "TRAVIS SCOTT",
    title: "FE!N",
    year: "2023",
    role: "RÉALISATION",
    duration: "03:24",
    thumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    desc: "Clip visuel immersif capturant l'énergie brute et l'atmosphère nocturne. Travail sur la lumière rouge et les textures urbaines.",
  },
  {
    id: "dont-cry",
    artist: "LIL WAYNE FT. XXXTENTACION",
    title: "DON'T CRY",
    year: "2018",
    role: "RÉALISATION",
    duration: "05:18",
    thumb: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80",
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    desc: "Réalisation émotionnelle en noir et blanc. Narration visuelle centrée sur la vulnérabilité et la tension dramatique.",
  },
  {
    id: "twerkulator",
    artist: "CITY GIRLS",
    title: "TWERKULATOR",
    year: "2020",
    role: "RÉALISATION",
    duration: "03:45",
    thumb: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    desc: "Direction artistique dynamique mêlant performance et esthétique club.",
  },
  {
    id: "secret-recipe",
    artist: "LIL YACHTY",
    title: "THE SECRET RECIPE",
    year: "2022",
    role: "RÉALISATION",
    duration: "04:02",
    thumb: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    desc: "Univers coloré et surréaliste, entre street culture et imagerie onirique.",
  },
];

const PHOTO_SERIES = [
  {
    index: "/26",
    title: "SELECTED WORKS",
    photos: 48,
    year: "2023",
    time: "12:30 PM",
    img: "https://images.unsplash.com/photo-1575429198097-0414c08e824c?w=1200&q=80",
    featured: true,
  },
  {
    index: "/26",
    title: "ANNA MAVI",
    photos: 32,
    year: "2022",
    time: "12:30 PM",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&grayscale",
  },
  {
    index: "/26",
    title: "HARMONY GARDEN",
    photos: 25,
    year: "2021",
    time: "12:30 PM",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    index: "/26",
    title: "VR SESSIONS",
    photos: 18,
    year: "2024",
    time: "09:00 AM",
    img: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80",
  },
];

const ARCHIVES = [
  { id: "ARCHIVE_024", type: "VIDÉO", title: "PARIS / 2025", detail: "MiniDV Capture", duration: "02:17", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80" },
  { id: "ARCHIVE_023", type: "PHOTO", title: "UNRELEASED", detail: "Canon AE-1", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80" },
  { id: "ARCHIVE_022", type: "PHOTO", title: "BACKSTAGE", detail: "Leica M6", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80" },
  { id: "ARCHIVE_021", type: "NOTES", title: "FIELD NOTES", detail: "Handwritten", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80" },
  { id: "ARCHIVE_020", type: "VIDÉO", title: "MANIFESTO", detail: "02:45", duration: "02:45", img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80" },
  { id: "ARCHIVE_019", type: "AUDIO", title: "BINKSTAPE DEMO", detail: "Cassette", duration: "41:23", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3a2b2a?w=500&q=80" },
];

const MIXTAPES = [
  {
    year: "2022",
    title: "BINKSTAPE VOL.1",
    desc: "Le premier chapitre. Une sélection de sons bruts et intimes, entre nuit sans fin et vérités du bitume.",
    tracks: "14 TITRES • 41:23",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    labelColor: "var(--accent)",
  },
  {
    year: "2023",
    title: "BINKSTAPE VOL.2",
    desc: "Nouveau volume, nouvelle atmosphère. Toujours la même sincérité, des sons pour les vrais, par les vrais.",
    tracks: "12 TITRES • 38:10",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80&grayscale",
    labelColor: "#fff",
  },
];
