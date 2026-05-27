"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/types";

const TABS = ["INFOS", "PHOTOS", "BEFORE / AFTER"] as const;

export default function VideoDetailClient({
  video,
  prev,
  next,
}: {
  video: Video;
  prev: Video | null;
  next: Video | null;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("INFOS");

  return (
    <>
      <nav className="video-detail__nav">
        <Link href="/videos">← RETOUR</Link>
        {next ? <Link href={`/videos/${next.slug}`}>SUIVANT →</Link> : <span />}
      </nav>
      <header className="video-detail__header">
        <div>
          <h1>
            {video.artist} — {video.title}
          </h1>
          <p className="video-row__meta" style={{ marginTop: "0.5rem" }}>
            {video.year} · {video.role}
          </p>
        </div>
      </header>
      <div className="video-player">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={`${video.artist} — ${video.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      </div>
      <div className="video-detail__grid">
        <div className="video-detail__credits">
          <h3>CRÉDITS</h3>
          {video.credits.map((c) => (
            <p key={c.role} className="credit-line">
              <strong>{c.role}</strong> — {c.name}
            </p>
          ))}
          <p className="credit-line" style={{ marginTop: "1.5rem" }}>
            <strong>PARTAGER</strong>
          </p>
          <div className="sidebar__social" style={{ marginTop: "0.5rem" }}>
            <a href="#">INSTAGRAM</a>
            <a href="#">YOUTUBE</a>
            <a href="#">TWITTER</a>
          </div>
        </div>
        <div>
          <div className="video-detail__tabs">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                className={`tab-btn ${tab === t ? "is-active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "INFOS" && (
            <>
              <p className="video-detail__desc">{video.description}</p>
              <div className="video-detail__specs">
                <span>
                  DURÉE <strong style={{ color: "var(--text)" }}>{video.duration}</strong>
                </span>
                <span>
                  FORMAT <strong style={{ color: "var(--text)" }}>4K</strong>
                </span>
                <span>
                  ANNÉE <strong style={{ color: "var(--text)" }}>{video.year}</strong>
                </span>
              </div>
            </>
          )}
          {tab === "PHOTOS" && (
            <p className="video-detail__desc">Galerie stills du tournage — à compléter.</p>
          )}
          {tab === "BEFORE / AFTER" && (
            <p className="video-detail__desc">Comparatifs color grading — à compléter.</p>
          )}
        </div>
        {tab === "PHOTOS" && (
          <div className="video-detail__gallery">
            {video.gallery.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt=""
                width={200}
                height={200}
                sizes="(max-width: 900px) 33vw, 200px"
                unoptimized={src.startsWith("/")}
              />
            ))}
          </div>
        )}
      </div>
      {prev && (
        <p className="video-detail__prev">
          Projet précédent :{" "}
          <Link href={`/videos/${prev.slug}`}>{prev.artist} — {prev.title}</Link>
        </p>
      )}
    </>
  );
}
