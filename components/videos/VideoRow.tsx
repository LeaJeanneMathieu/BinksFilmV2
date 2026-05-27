import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/types";

export default function VideoRow({ video }: { video: Video }) {
  return (
    <article className="video-row">
      <Link href={`/videos/${video.slug}`} className="video-row__thumb">
        <Image
          src={video.thumbnail}
          alt=""
          width={560}
          height={315}
          unoptimized={video.thumbnail.startsWith("/")}
        />
        <span className="video-row__duration">{video.duration}</span>
      </Link>
      <div>
        <p className="video-row__artist">{video.artist}</p>
        <h2 className="video-row__title">
          <Link href={`/videos/${video.slug}`}>{video.title}</Link>
        </h2>
        <p className="video-row__meta">
          {video.year} · {video.role}
        </p>
      </div>
      <Link href={`/videos/${video.slug}`} className="video-row__add" aria-label="Voir le projet">
        +
      </Link>
    </article>
  );
}
