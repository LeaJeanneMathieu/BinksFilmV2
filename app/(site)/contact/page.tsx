import type { Metadata } from "next";
import ContactWizard from "@/components/contact/ContactWizard";
import DirectContacts from "@/components/contact/DirectContacts";
import ContactClock from "@/components/contact/ContactClock";

export const metadata: Metadata = {
  title: "Contact",
  description: "Devis personnalisé pour vos projets vidéo et photo BINKSFILMS.",
};

export default function ContactPage() {
  return (
    <div className="contact-page">
      <header className="page-header">
        <div>
          <p className="breadcrumb" style={{ marginBottom: "0.5rem" }}>
            • PAGE / CONTACT
          </p>
          <h1>CONTACT</h1>
        </div>
      </header>
      <p className="contact-intro">
        REMPLISSEZ LE FORMULAIRE POUR OBTENIR UN DEVIS PERSONNALISÉ POUR VOTRE PROJET
        VIDÉO OU PHOTO.
      </p>
      <div className="contact-layout">
        <div className="contact-form-wrap">
          <ContactWizard />
          <DirectContacts />
        </div>
      </div>
      <footer className="contact-manifesto">
        <div>
          <p className="contact-manifesto__coords">BINKSFILMS</p>
          <p className="contact-manifesto__coords">48.8566° N, 2.3522° E</p>
        </div>
        <blockquote>
          <span style={{ color: "var(--accent)", fontSize: "1.5rem" }}>&ldquo;</span>
          ON DOCUMENTE CE QUE PERSONNE N&apos;ARCHIVE. ON TRANSFORME LE RÉEL EN
          MÉMOIRE. ON CRÉE AVEC INTENTION.
          <ContactClock />
        </blockquote>
      </footer>
    </div>
  );
}
