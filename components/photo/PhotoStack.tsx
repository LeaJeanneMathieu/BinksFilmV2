"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PhotoSeries } from "@/lib/types";

const SCALE_MIN = 0.78;
const SCALE_MAX = 1;
/** Plus la valeur est petite, plus le pic de zoom au centre est « serré » */
const FOCUS_RANGE = 0.52;

function tone(series: PhotoSeries): "black" | "white" {
  if (series.placeholder === "white" || series.placeholder === "black") {
    return series.placeholder;
  }
  return "black";
}

function PhotoCard({
  series,
  scale,
}: {
  series: PhotoSeries;
  scale: number;
}) {
  const t = tone(series);
  const isLight = t === "white";

  return (
    <article
      className={`photo-card photo-card--scroll ${isLight ? "photo-card--light" : ""}`}
      style={{
        transform: `scale(${scale})`,
      }}
    >
      <div className={`photo-card__media photo-card__media--${t}`} aria-hidden="true" />
      {series.image ? (
        <div className="photo-card__img-layer">
          <Image
            src={series.image}
            alt=""
            fill
            className="photo-card__img"
            sizes="(max-width: 900px) 100vw, 900px"
          />
        </div>
      ) : null}
      <div className="photo-card__overlay">
        <div className="photo-card__top">
          <span>BINKSFILMS</span>
          <span>
            {series.year} {series.time}
          </span>
        </div>
        <div className="photo-card__bottom">
          <div>
            <span className="photo-card__index">{series.index}</span>
            <p className="photo-card__info">SÉRIE PHOTO</p>
            <p className="photo-card__info">{series.photos} PHOTOS</p>
          </div>
          <h2 className="photo-card__title">{series.title}</h2>
        </div>
      </div>
    </article>
  );
}

export default function PhotoStack({ series }: { series: PhotoSeries[] }) {
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>(() => series.map(() => SCALE_MIN));

  const updateScales = useCallback(() => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const mid = vh * 0.5;
    const range = vh * FOCUS_RANGE;

    setScales(
      series.map((_, i) => {
        const wrap = wrapRefs.current[i];
        if (!wrap) return SCALE_MIN;
        const card = wrap.querySelector(".photo-card");
        if (!card) return SCALE_MIN;
        const r = card.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        const dist = Math.abs(cy - mid);
        const t = Math.max(0, 1 - dist / range);
        const ease = t * t * (3 - 2 * t);
        return SCALE_MIN + ease * (SCALE_MAX - SCALE_MIN);
      }),
    );
  }, [series]);

  useEffect(() => {
    updateScales();
    window.addEventListener("scroll", updateScales, { passive: true });
    window.addEventListener("resize", updateScales, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScales);
      window.removeEventListener("resize", updateScales);
    };
  }, [updateScales]);

  return (
    <div className="photo-series photo-series--scroll">
      {series.map((s, i) => (
        <div
          key={s.slug}
          className="photo-card-outer"
          ref={(el) => {
            wrapRefs.current[i] = el;
          }}
        >
          <PhotoCard series={s} scale={scales[i] ?? SCALE_MIN} />
        </div>
      ))}
    </div>
  );
}
