import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Connexion admin — BINKSFILMS",
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  return (
    <div className="admin-login-page">
      <AdminLoginForm searchParams={searchParams} />
    </div>
  );
}
