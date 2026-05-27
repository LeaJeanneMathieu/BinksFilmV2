"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ArchiveItem } from "@/lib/types";

const TABS = ["TOUT", "VIDÉOS", "PHOTOS", "AUDIO", "NOTES", "AUTRES"] as const;
const PAGE_SIZE = 6;

const TYPE_MAP: Record<string, ArchiveItem["type"] | null> = {
  TOUT: null,
  VIDÉOS: "VIDÉO",
  PHOTOS: "PHOTO",
  AUDIO: "AUDIO",
  NOTES: "NOTES",
  AUTRES: "AUTRES",
};

export default function ArchiveGrid({ items }: { items: ArchiveItem[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("TOUT");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const type = TYPE_MAP[tab];
    if (!type) return items;
    return items.filter((i) => i.type === type);
  }, [items, tab]);

  const shown = filtered.slice(0, visible);

  return (
    <>
      <div className="archives-header">
        <h1>ARCHIVES</h1>
        <span className="archives-header__sub">EXPLORER LA MÉMOIRE</span>
      </div>
      <div className="archives-filters">
        <div className="archives-filters__tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? "is-active" : ""}
              onClick={() => {
                setTab(t);
                setVisible(PAGE_SIZE);
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-muted)" }}>
          TRIER PAR : <strong style={{ color: "var(--text)" }}>RÉCENT</strong> ▾
        </span>
      </div>
      <div className="archives-grid">
        {shown.map((item) => (
          <article key={item.id} className="archive-card">
            <div className="archive-card__img">
              {item.quote ? (
                <div className="archive-card__quote">{item.quote}</div>
              ) : item.image ? (
                <Image src={item.image} alt="" width={400} height={300} />
              ) : (
                <div
                  className={`archive-card__placeholder archive-card__placeholder--${item.placeholder ?? "black"}`}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="archive-card__body">
              <div className="archive-card__row">
                <span>{item.id}</span>
                <span>{item.type}</span>
              </div>
              <p className="archive-card__title">{item.title}</p>
              <p className="archive-card__detail">{item.detail}</p>
              <div className="archive-card__footer">
                <span>{item.duration ?? ""}</span>
                {item.duration && <span className="archive-card__arrow">→</span>}
              </div>
            </div>
          </article>
        ))}
      </div>
      {visible < filtered.length && (
        <div className="archives-load">
          <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            CHARGER PLUS ▾
          </button>
        </div>
      )}
    </>
  );
}
