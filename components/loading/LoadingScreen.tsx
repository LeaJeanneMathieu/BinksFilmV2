"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DURATION_MS = 2800;
const STORAGE_KEY = "binks-intro-seen";

export default function LoadingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) {
      router.replace("/accueil");
      return;
    }

    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        setDone(true);
        sessionStorage.setItem(STORAGE_KEY, "1");
        setTimeout(() => router.replace("/accueil"), 600);
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }, [router]);

  const skip = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    router.replace("/accueil");
  };

  return (
    <div className={`loader ${done ? "is-done" : ""}`} role="presentation">
      <h1 className="loader__title" aria-label="BINKSFILMS">
        BINKSFILMS
      </h1>
      <p className="loader__status">LOADING...</p>
      <div
        className="loader__bar-wrap"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="loader__bar" style={{ width: `${progress}%` }} />
      </div>
      <button
        type="button"
        onClick={skip}
        style={{
          position: "absolute",
          bottom: "2rem",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: "var(--text-dim)",
          textTransform: "uppercase",
        }}
      >
        Passer
      </button>
    </div>
  );
}
