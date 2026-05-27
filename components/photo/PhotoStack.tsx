"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PhotoSeries } from "@/lib/types";

const SCALE_MIN = 0.78;
const SCALE_MAX = 1;
/** Plus la valeur est petite, plus le pic de zoom au centre est « serré » */
const FOCUS_RANGE = 0.52;

/** Centre et hauteur du viewport *visible* (barre d’URL mobile / VisualViewport). */
function getViewportFocusMetrics(): { vh: number; midY: number } {
  if (typeof window === "undefined") {
    return { vh: 800, midY: 400 };
  }
  const vv = window.visualViewport;
  if (vv) {
    const vh = vv.height;
    const midY = vv.offsetTop + vh * 0.5;
    return { vh, midY };
  }
  const vh = window.innerHeight;
  return { vh, midY: vh * 0.5 };
}

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
  const rafRef = useRef<number | null>(null);
  const [scales, setScales] = useState<number[]>(() => series.map(() => SCALE_MIN));

  const updateScales = useCallback(() => {
    const { vh, midY: mid } = getViewportFocusMetrics();
    const range = vh * FOCUS_RANGE;

    setScales(
      series.map((_, i) => {
        const wrap = wrapRefs.current[i];
        if (!wrap) return SCALE_MIN;
        /* Mesurer le conteneur sans transform : le rect de la carte inclut déjà le scale et crée une rétroaction. */
        const r = wrap.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        const dist = Math.abs(cy - mid);
        const t = Math.max(0, 1 - dist / range);
        const ease = t * t * (3 - 2 * t);
        return SCALE_MIN + ease * (SCALE_MAX - SCALE_MIN);
      }),
    );
  }, [series]);

  const scheduleUpdateScales = useCallback(() => {
    if (typeof window === "undefined") return;
    if (rafRef.current != null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updateScales();
    });
  }, [updateScales]);

  useEffect(() => {
    updateScales();
    window.addEventListener("scroll", scheduleUpdateScales, { passive: true, capture: true });
    window.addEventListener("resize", scheduleUpdateScales, { passive: true });
    const vv = window.visualViewport;
    vv?.addEventListener("resize", scheduleUpdateScales, { passive: true });
    vv?.addEventListener("scroll", scheduleUpdateScales, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdateScales, { capture: true });
      window.removeEventListener("resize", scheduleUpdateScales);
      vv?.removeEventListener("resize", scheduleUpdateScales);
      vv?.removeEventListener("scroll", scheduleUpdateScales);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [scheduleUpdateScales, updateScales]);

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
