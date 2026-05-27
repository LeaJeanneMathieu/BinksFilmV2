import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VideoDetailClient from "@/components/videos/VideoDetailClient";
import { getAdjacentVideos, getVideo, videos } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) return { title: "Vidéo" };
  return {
    title: `${video.artist} — ${video.title}`,
    description: video.description,
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) notFound();
  const { prev, next } = getAdjacentVideos(slug);
  return <VideoDetailClient video={video} prev={prev} next={next} />;
}
