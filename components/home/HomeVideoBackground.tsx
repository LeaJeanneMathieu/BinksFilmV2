"use client";

import { useEffect, useRef, useState } from "react";

type HomeVideoBackgroundProps = {
  src: string;
  poster?: string;
};

export default function HomeVideoBackground({ src, poster }: HomeVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => {
        /* autoplay blocked until interaction — keep poster visible */
      });
    };

    video.addEventListener("loadeddata", play);
    play();

    return () => video.removeEventListener("loadeddata", play);
  }, [src]);

  if (failed) {
    return <div className="home__bg home__bg--fallback" aria-hidden="true" />;
  }

  return (
    <div className="home__video-wrap" aria-hidden="true">
      <video
        ref={videoRef}
        className="home__video"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
      />
      <div className="home__video-overlay" />
    </div>
  );
}
