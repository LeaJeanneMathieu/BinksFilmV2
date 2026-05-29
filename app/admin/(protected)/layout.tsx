import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/session";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    if (!(await isAdminAuthenticated())) {
      redirect("/admin/login");
    }
  } catch {
    redirect("/admin/login?error=config");
  }

  return <div className="admin-shell">{children}</div>;
}
