function renderArtists(container) {
  if (!container || typeof ARTISTS === "undefined") return;
  container.innerHTML = ARTISTS.map(
    (a) => `
    <div class="home__artist" title="${a.name}">
      <img src="${a.img}" alt="${a.name}" loading="lazy" width="48" height="48">
    </div>`
  ).join("");
}

function renderVideoList(container) {
  if (!container) return;
  container.innerHTML = VIDEOS.map(
    (v) => `
    <a href="video.html?id=${v.id}" class="video-row">
      <div class="video-row__thumb">
        <img src="${v.thumb}" alt="${v.title}" loading="lazy">
        <span class="video-row__duration">${v.duration}</span>
      </div>
      <div>
        <div class="video-row__artist">${v.artist}</div>
        <div class="video-row__title">${v.title}</div>
        <div class="video-row__meta">${v.year} — ${v.role}</div>
      </div>
      <span class="video-row__add" aria-hidden="true">+</span>
    </a>`
  ).join("");
}

function renderPhotoSeries(container) {
  if (!container) return;
  container.innerHTML = PHOTO_SERIES.map((s) => {
    const cls = s.featured ? "photo-card photo-card--featured" : "photo-card photo-card--sm";
    return `
    <article class="${cls}">
      <img src="${s.img}" alt="${s.title}" loading="lazy">
      <div class="photo-card__overlay">
        <div class="photo-card__top">
          <span>BINKSFILMS</span>
          <span>${s.year} ${s.time}</span>
        </div>
        <div class="photo-card__bottom">
          <div>
            <div class="photo-card__index">${s.index}</div>
            <div class="photo-card__info">SÉRIE PHOTO — ${s.photos} PHOTOS</div>
          </div>
          <div class="photo-card__title">${s.title}</div>
        </div>
      </div>
    </article>`;
  }).join("");
}

function renderArchives(container, filter = "all") {
  if (!container) return;
  const items =
    filter === "all"
      ? ARCHIVES
      : ARCHIVES.filter((a) => {
          const map = { videos: "VIDÉO", photos: "PHOTO", audio: "AUDIO", notes: "NOTES" };
          return a.type === map[filter];
        });

  container.innerHTML = items
    .map(
      (a) => `
    <article class="archive-card" data-type="${a.type}">
      <div class="archive-card__img">
        <img src="${a.img}" alt="${a.title}" loading="lazy">
      </div>
      <div class="archive-card__body">
        <div class="archive-card__row">
          <span>${a.id}</span>
          <span>${a.type}</span>
        </div>
        <div class="archive-card__title">${a.title}</div>
        <div class="archive-card__detail">${a.detail}</div>
        <div class="archive-card__footer">
          <span>${a.duration || ""}</span>
          <span class="archive-card__arrow">→</span>
        </div>
      </div>
    </article>`
    )
    .join("");
}

function renderMixtapes(container) {
  if (!container) return;
  container.innerHTML = MIXTAPES.map(
    (m) => `
    <article class="mixtape-card">
      <div class="mixtape-card__cover">
        <img src="${m.img}" alt="${m.title}" loading="lazy">
        <span class="mixtape-card__cover-label" style="color:${m.labelColor}">${m.title}</span>
      </div>
      <div class="mixtape-card__body">
        <div class="mixtape-card__year">${m.year}</div>
        <h2 class="mixtape-card__title">${m.title}</h2>
        <p class="mixtape-card__desc">${m.desc}</p>
        <div class="mixtape-card__footer">
          <span>${m.tracks}</span>
          <span class="mixtape-card__arrow">→</span>
        </div>
      </div>
    </article>`
  ).join("");
}

function initVideoDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const video = VIDEOS.find((v) => v.id === id) || VIDEOS[1];
  if (!video) return;

  document.title = `${video.artist} — ${video.title} | BINKSFILMS`;
  const titleEl = document.getElementById("video-title");
  const yearEl = document.getElementById("video-year");
  const roleEl = document.getElementById("video-role");
  const descEl = document.getElementById("video-desc");
  const thumbEl = document.getElementById("video-thumb");
  const durationEl = document.getElementById("video-duration");

  if (titleEl) titleEl.textContent = `${video.artist} — ${video.title}`;
  if (yearEl) yearEl.textContent = video.year;
  if (roleEl) roleEl.textContent = video.role;
  if (descEl) descEl.textContent = video.desc;
  if (thumbEl) thumbEl.src = video.thumb;
  if (durationEl) durationEl.textContent = `00:00 / ${video.duration}`;
  const specYear = document.getElementById("spec-year");
  const specDuration = document.getElementById("spec-duration");
  if (specYear) specYear.textContent = video.year;
  if (specDuration) specDuration.textContent = video.duration;
}

function updateClock() {
  const el = document.getElementById("live-time");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) + " AM";
}

document.addEventListener("DOMContentLoaded", () => {
  renderArtists(document.getElementById("artists-row"));
  renderVideoList(document.getElementById("video-list"));
  renderPhotoSeries(document.getElementById("photo-series"));
  renderArchives(document.getElementById("archives-grid"));
  renderMixtapes(document.getElementById("mixtape-grid"));
  initVideoDetail();
  updateClock();
  setInterval(updateClock, 60000);

  document.querySelectorAll(".archives-filters__tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".archives-filters__tabs button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderArchives(document.getElementById("archives-grid"), btn.dataset.filter);
    });
  });
});
