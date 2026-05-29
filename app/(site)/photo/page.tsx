import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import FilterButton from "@/components/layout/FilterButton";
import PhotoStack from "@/components/photo/PhotoStack";
import { getPublicSeriesForSite } from "@/lib/photos/store";

export const metadata: Metadata = {
  title: "Photo",
  description: "Séries photographiques BINKSFILMS.",
};

export const dynamic = "force-dynamic";

export default async function PhotoPage() {
  const photos = await getPublicSeriesForSite();

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
