const NAV_ITEMS = [
  { href: "home.html", label: "ACCUEIL", page: "home" },
  { href: "videos.html", label: "VIDÉOS", page: "videos" },
  { href: "photo.html", label: "PHOTO", page: "photo" },
  { href: "musique.html", label: "MUSIQUE", page: "musique" },
  { href: "archives.html", label: "ARCHIVES", page: "archives" },
  { href: "contact.html", label: "CONTACT", page: "contact" },
];

function renderSidebar(activePage) {
  const root = document.getElementById("sidebar-root");
  if (!root) return;

  const links = NAV_ITEMS.map(
    (item) => `
    <a href="${item.href}" class="sidebar__link${item.page === activePage ? " is-active" : ""}">
      ${item.label}
    </a>`
  ).join("");

  root.innerHTML = `
    <button class="menu-toggle" aria-label="Menu" type="button">
      <span></span><span></span><span></span>
    </button>
    <aside class="sidebar" id="sidebar">
      <a href="home.html" class="sidebar__brand">${SITE.brand}</a>
      <nav class="sidebar__nav">${links}</nav>
      <div class="sidebar__footer">
        <span>© ${SITE.brand} 2024</span>
        <span class="accent">${SITE.tagline}</span>
        <div class="sidebar__social">
          <a href="https://instagram.com/binksfilms" target="_blank" rel="noopener">INSTAGRAM</a>
          <a href="https://youtube.com" target="_blank" rel="noopener">YOUTUBE</a>
        </div>
        <div class="sidebar__eq" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
    </aside>
  `;

  const toggle = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("sidebar");
  toggle?.addEventListener("click", () => sidebar?.classList.toggle("is-open"));
}

function initSidebar() {
  const page = document.body.dataset.page;
  renderSidebar(page);
}

document.addEventListener("DOMContentLoaded", initSidebar);
