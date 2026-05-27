import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import FilterButton from "@/components/layout/FilterButton";
import PhotoStack from "@/components/photo/PhotoStack";
import { photos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photo",
  description: "Séries photographiques BINKSFILMS.",
};

export default function PhotoPage() {
  return (
    <>
      <PageHeader
        title="PHOTO"
        meta={<span>{photos.length} SÉRIES</span>}
        action={<FilterButton />}
      />
      <div className="content">
        <PhotoStack series={photos} />
      </div>
    </>
  );
}
