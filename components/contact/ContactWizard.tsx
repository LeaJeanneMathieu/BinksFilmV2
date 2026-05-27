"use client";

import { useState } from "react";
import { PROJECT_TYPES } from "@/lib/types";

const STEPS = [
  { num: "01", label: "LE PROJET" },
  { num: "02", label: "VOS INFOS" },
  { num: "03", label: "VOS BESOINS" },
  { num: "04", label: "MESSAGE" },
];

export default function ContactWizard() {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<string>(PROJECT_TYPES[0]);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    deadline: "",
    format: "",
    message: "",
  });

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <div className="contact-form" style={{ textAlign: "center", padding: "3rem" }}>
        <p className="contact-form__step-label">✓ ENVOYÉ</p>
        <h2 style={{ marginBottom: "1rem" }}>Demande enregistrée</h2>
        <p className="contact-form__note" style={{ maxWidth: "100%", margin: "0 auto" }}>
          Merci — nous vous recontacterons sous 48h. (Mode démo : aucun email envoyé.)
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="contact-steps">
        {STEPS.map((s, i) => (
          <span key={s.num} className={step === i ? "is-active" : ""}>
            {s.num} {s.label}
          </span>
        ))}
      </div>

      <div className={`form-step ${step === 0 ? "is-active" : ""}`}>
        <p className="contact-form__step-label">ÉTAPE 01</p>
        <h2>Quel est le type de projet ?</h2>
        <div className="contact-options">
          {PROJECT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={`contact-option ${projectType === t ? "is-selected" : ""}`}
              onClick={() => setProjectType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className={`form-step ${step === 1 ? "is-active" : ""}`}>
        <p className="contact-form__step-label">ÉTAPE 02</p>
        <h2>Vos informations</h2>
        <input
          type="text"
          placeholder="Nom / Structure"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Téléphone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className={`form-step ${step === 2 ? "is-active" : ""}`}>
        <p className="contact-form__step-label">ÉTAPE 03</p>
        <h2>Vos besoins</h2>
        <input
          type="text"
          placeholder="Budget indicatif"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
        <input
          type="text"
          placeholder="Délai souhaité"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
        <input
          type="text"
          placeholder="Format (4K, vertical, etc.)"
          value={form.format}
          onChange={(e) => setForm({ ...form, format: e.target.value })}
        />
      </div>

      <div className={`form-step ${step === 3 ? "is-active" : ""}`}>
        <p className="contact-form__step-label">ÉTAPE 04</p>
        <h2>Votre message</h2>
        <textarea
          placeholder="Décrivez votre projet..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>

      <div className="contact-form__footer">
        <p className="contact-form__note">
          {step < 3
            ? "Les champs marqués seront validés à l'étape suivante."
            : "En validant, vous acceptez d'être recontacté par BINKSFILMS."}
        </p>
        <div className="contact-form__actions">
          {step > 0 && (
            <button type="button" className="btn btn--outline" onClick={prev}>
              PRÉCÉDENT
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="btn btn--accent" onClick={next}>
              SUIVANT →
            </button>
          ) : (
            <button type="submit" className="btn btn--accent">
              ENVOYER →
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
