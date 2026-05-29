import PhotoAdminPanel from "@/components/admin/PhotoAdminPanel";

export const metadata = {
  title: "Photos — Admin BINKSFILMS",
};

export const dynamic = "force-dynamic";

export default function AdminPhotosPage() {
  return <PhotoAdminPanel />;
}
