"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function AdminLoginForm({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error: configError } = use(searchParams);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Connexion impossible");
        return;
      }
      router.push(from && from.startsWith("/admin") ? from : "/admin/photos");
      router.refresh();
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-login" onSubmit={onSubmit}>
      <p className="admin-login__eyebrow">BINKSFILMS</p>
      <h1>Espace photo</h1>
      <p className="admin-login__hint">
        Gérez vos séries et choisissez quelles photos sont visibles sur le site public.
      </p>
      {configError === "config" ? (
        <p className="admin-login__error" role="alert">
          Le serveur n&apos;est pas configuré : ajoutez ADMIN_PASSWORD dans .env.local
        </p>
      ) : null}
      <label className="admin-field">
        <span>Mot de passe</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error ? (
        <p className="admin-login__error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
