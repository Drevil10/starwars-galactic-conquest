export function registerScreens(app) {
  const homeSection = document.createElement("section");
  homeSection.id = "home-screen";
  homeSection.className = "screen active";
  homeSection.innerHTML = `
    <h2>Bienvenido a Galactic Conquest</h2>
    <p>Selecciona una opción del menú para comenzar.</p>
  `;

  const archiveSection = document.createElement("section");
  archiveSection.id = "archive-screen";
  archiveSection.className = "screen";
  archiveSection.innerHTML = `
    <section class="archive-screen">
      <header class="archive-header">
        <h2 class="archive-title">Archivo Galactico</h2>
        <div class="archive-controls">
          <label class="archive-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input id="archive-search-input" type="search" placeholder="Buscar assets..." />
          </label>
        </div>
      </header>

      <div id="archive-categories" class="archive-categories"></div>
      <div id="archive-grid" class="archive-grid"></div>
    </section>
  `;

  app.append(homeSection, archiveSection);
}
