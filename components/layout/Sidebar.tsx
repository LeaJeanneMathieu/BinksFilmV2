"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS, site } from "@/lib/content";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const lock = () => {
      if (mq.matches && open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };
    lock();
    mq.addEventListener("change", lock);
    return () => {
      mq.removeEventListener("change", lock);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
        />
      )}
      <button
        type="button"
        className="menu-toggle"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <Link href="/accueil" className="sidebar__brand" onClick={() => setOpen(false)}>
          {site.brand}
          <span className="sidebar__tagline">{site.tagline}</span>
        </Link>
        <nav className="sidebar__nav" aria-label="Navigation principale">
          <ul>
            {NAV_ITEMS.map(({ href, label }) => {
              const active =
                pathname === href ||
                (href !== "/accueil" && !!pathname?.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`sidebar__link ${active ? "is-active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <footer className="sidebar__footer">
          <span>© {site.brand}</span>
          <span className="accent">{site.tagline}</span>
          <div className="sidebar__social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              INSTAGRAM
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              TWITTER
            </a>
          </div>
          <div className="sidebar__eq" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </footer>
      </aside>
    </>
  );
}
