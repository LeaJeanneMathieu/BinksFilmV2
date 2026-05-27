(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  let step = 0;
  const steps = form.querySelectorAll(".form-step");
  const indicators = document.querySelectorAll(".contact-steps span");
  const btnPrev = form.querySelector("[data-action='prev']");
  const btnNext = form.querySelector("[data-action='next']");

  function showStep(n) {
    step = Math.max(0, Math.min(n, steps.length - 1));
    steps.forEach((s, i) => s.classList.toggle("is-active", i === step));
    indicators.forEach((ind, i) => ind.classList.toggle("is-active", i === step));
    if (btnPrev) btnPrev.style.visibility = step === 0 ? "hidden" : "visible";
    if (btnNext) btnNext.textContent = step === steps.length - 1 ? "ENVOYER" : "SUIVANT →";
    const label = form.querySelector(".contact-form__step-label");
    if (label) label.textContent = `0${step + 1} / ${steps[step].dataset.label}`;
  }

  form.querySelectorAll(".contact-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      opt.closest(".contact-options")?.querySelectorAll(".contact-option").forEach((o) => o.classList.remove("is-selected"));
      opt.classList.add("is-selected");
    });
  });

  btnNext?.addEventListener("click", () => {
    if (step < steps.length - 1) showStep(step + 1);
    else {
      alert("Message envoyé ! Nous vous recontacterons rapidement.");
      window.location.href = "home.html";
    }
  });

  btnPrev?.addEventListener("click", () => showStep(step - 1));
  showStep(0);
})();
