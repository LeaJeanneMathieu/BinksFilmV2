"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { PhotoRecord, PhotoSeriesRecord } from "@/lib/photos/types";
import { photoDisplayUrl } from "@/lib/photos/url";

type SeriesWithPhotos = PhotoSeriesRecord & { photos: PhotoRecord[] };

export default function PhotoAdminPanel() {
  const [series, setSeries] = useState<SeriesWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageIsError, setMessageIsError] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/photos");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      setSeries(data.series ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createSeries(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    const res = await fetch("/api/admin/series", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      setFeedback("Impossible de créer la série", true);
      return;
    }
    setNewTitle("");
    setFeedback("Série créée", false);
    await load();
  }

  function setFeedback(text: string, isError: boolean) {
    setMessage(text);
    setMessageIsError(isError);
  }

  function patchPhotoInState(photoId: string, isPublic: boolean) {
    setSeries((prev) =>
      prev.map((s) => ({
        ...s,
        photos: s.photos.map((p) => (p.id === photoId ? { ...p, isPublic } : p)),
      })),
    );
  }

  async function togglePublic(photo: PhotoRecord) {
    const nextPublic = !photo.isPublic;
    setTogglingId(photo.id);
    patchPhotoInState(photo.id, nextPublic);

    try {
      const res = await fetch(`/api/admin/photos/${photo.id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: nextPublic }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        patchPhotoInState(photo.id, photo.isPublic);
        setFeedback(
          typeof data.error === "string" ? data.error : "Mise à jour impossible",
          true,
        );
        return;
      }

      if (data.photo) {
        patchPhotoInState(photo.id, Boolean(data.photo.isPublic));
      }
      setFeedback(nextPublic ? "Photo publiée sur le site" : "Photo retirée du site", false);
    } catch {
      patchPhotoInState(photo.id, photo.isPublic);
      setFeedback("Erreur réseau — réessayez", true);
    } finally {
      setTogglingId(null);
    }
  }

  async function removePhoto(photo: PhotoRecord) {
    if (!confirm("Supprimer cette photo ?")) return;
    const res = await fetch(`/api/admin/photos/${photo.id}`, { method: "DELETE" });
    if (!res.ok) {
      setMessage("Suppression impossible");
      return;
    }
    await load();
  }

  async function uploadFiles(seriesId: string, files: FileList | null) {
    if (!files?.length) return;
    setUploadingId(seriesId);
    setMessage(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.set("seriesId", seriesId);
        form.set("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setMessage(data.error ?? "Échec de l’upload");
          break;
        }
      }
      await load();
    } finally {
      setUploadingId(null);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const totalPublic = series.reduce(
    (n, s) => n + s.photos.filter((p) => p.isPublic).length,
    0,
  );

  return (
    <div className="admin-panel">
      <header className="admin-panel__header">
        <div>
          <p className="admin-panel__eyebrow">Administration</p>
          <h1>Photos</h1>
          <p className="admin-panel__meta">
            {totalPublic} photo{totalPublic !== 1 ? "s" : ""} visible
            {totalPublic !== 1 ? "s" : ""} sur le site — le reste reste privé ici
          </p>
        </div>
        <div className="admin-panel__actions">
          <Link href="/photo" className="admin-btn admin-btn--ghost">
            Voir le site
          </Link>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>

      {message ? (
        <p
          className={`admin-panel__toast ${messageIsError ? "admin-panel__toast--error" : ""}`}
          role="status"
        >
          {message}
        </p>
      ) : null}

      <form className="admin-new-series" onSubmit={createSeries}>
        <label className="admin-field admin-field--grow">
          <span>Nouvelle série</span>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Ex. NOCTURNE PARIS"
          />
        </label>
        <button type="submit" className="admin-btn admin-btn--primary">
          Créer
        </button>
      </form>

      {loading ? (
        <p className="admin-panel__loading">Chargement…</p>
      ) : series.length === 0 ? (
        <p className="admin-panel__empty">Aucune série. Créez-en une pour commencer.</p>
      ) : (
        <ul className="admin-series-list">
          {series.map((s) => {
            const publicCount = s.photos.filter((p) => p.isPublic).length;
            return (
              <li key={s.id} className="admin-series">
                <div className="admin-series__head">
                  <div>
                    <h2>{s.title}</h2>
                    <p className="admin-series__meta">
                      {s.photos.length} photo{s.photos.length !== 1 ? "s" : ""} ·{" "}
                      {publicCount} publique{publicCount !== 1 ? "s" : ""}
                      {publicCount === 0 && s.photos.length > 0 ? (
                        <span className="admin-badge admin-badge--private">
                          {" "}
                          — masquée sur le site
                        </span>
                      ) : null}
                      {publicCount > 0 ? (
                        <span className="admin-badge admin-badge--public"> — en ligne</span>
                      ) : null}
                    </p>
                  </div>
                  <label className="admin-btn admin-btn--primary admin-upload-label">
                    {uploadingId === s.id ? "Envoi…" : "Ajouter des photos"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      hidden
                      disabled={uploadingId === s.id}
                      onChange={(e) => {
                        uploadFiles(s.id, e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {s.photos.length === 0 ? (
                  <p className="admin-series__empty">Aucune photo dans cette série.</p>
                ) : (
                  <ul className="admin-photo-grid">
                    {s.photos.map((p) => (
                      <li key={p.id} className={`admin-photo ${p.isPublic ? "is-public" : ""}`}>
                        <div className="admin-photo__thumb">
                          <Image
                            src={photoDisplayUrl(p.path)}
                            alt=""
                            fill
                            sizes="160px"
                            className="admin-photo__img"
                            unoptimized={p.path.startsWith("/api/")}
                          />
                        </div>
                        <div className="admin-photo__actions">
                          <button
                            type="button"
                            className={`admin-btn admin-btn--sm ${p.isPublic ? "admin-btn--ghost" : "admin-btn--primary"}`}
                            disabled={togglingId === p.id}
                            onClick={() => togglePublic(p)}
                          >
                            {togglingId === p.id
                              ? "…"
                              : p.isPublic
                                ? "Retirer du site"
                                : "Publier"}
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm admin-btn--danger"
                            onClick={() => removePhoto(p)}
                          >
                            Supprimer
                          </button>
                        </div>
                        <span className={`admin-photo__status ${p.isPublic ? "is-public" : ""}`}>
                          {p.isPublic ? "Public" : "Privé"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
