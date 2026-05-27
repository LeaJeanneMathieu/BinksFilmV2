import { site } from "@/lib/content";

const ROWS = [
  { label: "EMAIL", value: site.email, href: `mailto:${site.email}` },
  { label: "INSTAGRAM", value: site.instagram, href: "https://instagram.com" },
  { label: "YOUTUBE", value: site.youtube, href: "https://youtube.com" },
  { label: "TÉLÉPHONE", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
];

export default function DirectContacts() {
  return (
    <div className="contact-direct">
      <h3>CONTACTS DIRECTS</h3>
      <p>
        Vous préférez nous joindre autrement ? Utilisez les canaux ci-dessous.
      </p>
      {ROWS.map((r) => (
        <a key={r.label} href={r.href} className="contact-link-row" target="_blank" rel="noopener noreferrer">
          <span>{r.label}</span>
          <span>
            {r.value} ↗
          </span>
        </a>
      ))}
    </div>
  );
}
