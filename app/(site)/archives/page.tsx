import type { Metadata } from "next";
import FilterButton from "@/components/layout/FilterButton";
import ArchiveGrid from "@/components/archives/ArchiveGrid";
import { archives } from "@/lib/content";

export const metadata: Metadata = {
  title: "Archives",
  description: "Mémoire visuelle et extraits de projets BINKSFILMS.",
};

export default function ArchivesPage() {
  return (
    <>
      <header
        className="page-header"
        style={{ border: "none", paddingBottom: 0 }}
      >
        <span />
        <FilterButton />
      </header>
      <ArchiveGrid items={archives} />
    </>
  );
}
