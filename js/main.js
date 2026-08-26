// js/main.js
// Punto de entrada y lógica de interfaz principal.

const state = {
  energy: 100,
  credits: 50,
  minerals: 30,
  research: 10,
  archiveEntries: [],
  archiveLoaded: false,
  archiveLoading: null
};

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');

const energyRes = document.getElementById('energy-res');
const creditsRes = document.getElementById('credits-res');
const mineralsRes = document.getElementById('minerals-res');
const researchRes = document.getElementById('research-res');
const turnInfoEl = document.getElementById('turn-info');
const nextTurnBtn = document.getElementById('next-turn-btn');

const navBtns = document.querySelectorAll('.nav-btn');

// Archivo
const archiveScreen = document.getElementById('archive-screen');
const archiveList = document.getElementById('archive-list');
const archiveDetail = document.getElementById('archive-detail');
const archiveGrid = document.getElementById('archive-grid');
const archiveEmpty = document.getElementById('archive-empty');
const archiveSearch = document.getElementById('archive-search');
const archiveFilters = document.getElementById('archive-filters');
const detailImage = document.getElementById('detail-image');
const detailTitle = document.getElementById('detail-title');
const detailType = document.getElementById('detail-type');
const detailDescription = document.getElementById('detail-description');
const archiveBack = document.getElementById('archive-back');
const characterLore = {};

// Nuevos paneles: Construir, Investigar, Militar
const buildScreen = document.getElementById('build-screen');
const buildGrid = document.getElementById('build-grid');
const buildBack = document.getElementById('build-back');

const researchScreen = document.getElementById('research-screen');
const researchGrid = document.getElementById('research-grid');
const researchBack = document.getElementById('research-back');

const militaryScreen = document.getElementById('military-screen');
const militaryGrid = document.getElementById('military-grid');
const militaryBack = document.getElementById('military-back');

// Sincronizar estado local con GameState.
function syncFromGameState() {
  if (typeof GameState === 'undefined') return;

  const resources = GameState.getResources();

  state.energy = resources.energy ?? state.energy;
  state.credits = resources.credits ?? state.credits;
  state.minerals = resources.minerals ?? state.minerals;
  state.research = resources.research ?? state.research;

  updateResources();
}

function updateResources() {
  if (energyRes) energyRes.textContent = Math.floor(state.energy);
  if (creditsRes) creditsRes.textContent = Math.floor(state.credits);
  if (mineralsRes) mineralsRes.textContent = Math.floor(state.minerals);
  if (researchRes) researchRes.textContent = Math.floor(state.research);

  if (typeof TurnSystem !== 'undefined' && typeof TurnSystem.getTurnInfo === 'function') {
    const info = TurnSystem.getTurnInfo();

    if (turnInfoEl) {
      turnInfoEl.textContent = `Turno ${info.turn}`;
    }
  }
}

function showScreen(screen) {
  startScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  screen.classList.add('active');
}

function closeAllOverlays() {
  if (archiveScreen) archiveScreen.style.display = 'none';
  if (buildScreen) buildScreen.style.display = 'none';
  if (researchScreen) researchScreen.style.display = 'none';
  if (militaryScreen) militaryScreen.style.display = 'none';
}

// ==================== ARCHIVO ====================

function archiveType(path) {
  if (path.startsWith('assets/characters/')) return 'personaje';
  if (path.startsWith('assets/locations/')) return 'planeta';
  if (path.startsWith('assets/effects/')) return 'evento';
  return 'tecnologia';
}

function archiveTitle(path) {
  return path
    .split('/')
    .pop()
    .replace(/\.svg$/i, '')
    .split('-')
    .map(word => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function archiveDescription(title, type, path) {
  const fileName = path.split('/').pop().replace(/\.svg$/i, '');

  if (characterLore[fileName]) return characterLore[fileName];

  const descriptions = {
    personaje: `${title} es una figura registrada en los archivos galacticos. Su historia queda ligada a conflictos, alianzas y decisiones que marcaron su epoca.`,
    planeta: `${title} es una localizacion de importancia dentro de la galaxia. Sus condiciones, habitantes y recursos han influido en rutas, batallas y operaciones de distintas facciones.`,
    evento: `${title} representa un suceso destacado en los registros galacticos. Su impacto modifica el curso de un enfrentamiento y deja consecuencias para quienes participan.`,
    tecnologia: `${title} forma parte del equipo, arsenal o infraestructura utilizada en la galaxia. Su diseno responde a necesidades de combate, transporte, defensa o supervivencia.`
  };

  return descriptions[type] || `${title} es una entrada registrada en el Archivo galactico.`;
}

async function loadArchiveEntries() {
  if (state.archiveLoaded) return;
  if (state.archiveLoading) return state.archiveLoading;

  state.archiveLoading = fetch('https://api.github.com/repos/Drevil10/starwars-galactic-conquest/git/trees/main?recursive=1')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el Archivo');
      return response.json();
    })
    .then(data => {
      state.archiveEntries = (data.tree || [])
        .filter(item => item.type === 'blob' && item.path.startsWith('assets/') && item.path.endsWith('.svg'))
        .map(item => {
          const title = archiveTitle(item.path);
          const type = archiveType(item.path);

          return {
            id: item.path,
            type,
            title,
            description: archiveDescription(title, type, item.path),
            image: item.path
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      state.archiveLoaded = true;
    })
    .catch(() => {
      state.archiveEntries = [];
      state.archiveLoaded = true;
    })
    .finally(() => {
      state.archiveLoading = null;
    });

  return state.archiveLoading;
}

function openArchive() {
  closeAllOverlays();

  if (archiveScreen) {
    archiveScreen.style.display = 'block';
    archiveList.style.display = 'block';
    archiveDetail.style.display = 'none';

    if (!state.archiveLoaded) {
      archiveGrid.innerHTML = '<div class="archive-empty">Cargando Archivo...</div>';
      archiveEmpty.style.display = 'none';
      loadArchiveEntries().then(renderArchiveGrid);
    } else {
      renderArchiveGrid();
    }
  }
}

function closeArchive() {
  if (archiveScreen) archiveScreen.style.display = 'none';
}

function renderArchiveGrid() {
  if (!archiveGrid) return;

  const query = (archiveSearch?.value || '').toLowerCase().trim();
  const activeButton = archiveFilters?.querySelector('.archive-filter.active');
  const activeFilter = activeButton ? activeButton.dataset.type : 'all';

  const entries = state.archiveEntries.filter(entry => {
    const matchesType = activeFilter === 'all' || entry.type === activeFilter;
    const matchesQuery =
      !query ||
      entry.title.toLowerCase().includes(query) ||
      entry.description.toLowerCase().includes(query);

    return matchesType && matchesQuery;
  });

  archiveGrid.innerHTML = '';

  if (archiveEmpty) {
    archiveEmpty.style.display = entries.length ? 'none' : 'block';
  }

  entries.forEach(entry => {
    const card = document.createElement('button');

    card.className = 'archive-card';
    card.innerHTML =
      `<img class="archive-card-image" src="${entry.image}" alt="" />` +
      `<div class="archive-card-text">` +
      `<span class="archive-card-title">${entry.title}</span>` +
      `<span class="archive-card-category">${entry.type}</span>` +
      `</div>`;

    card.addEventListener('click', () => openArchiveDetail(entry));
    archiveGrid.appendChild(card);
  });
}

function openArchiveDetail(entry) {
  if (!archiveList || !archiveDetail) return;

  archiveList.style.display = 'none';
  archiveDetail.style.display = 'block';

  if (detailImage) {
    detailImage.src = entry.image;
    detailImage.alt = entry.title;
  }

  if (detailTitle) detailTitle.textContent = entry.title;
  if (detailType) detailType.textContent = entry.type;
  if (detailDescription) detailDescription.textContent = entry.description;
}

// ==================== CONSTRUIR ====================

function openBuild() {
  closeAllOverlays();

  if (!buildScreen || !buildGrid) return;

  buildScreen.style.display = 'block';

  if (typeof BuildingData === 'undefined' || !BuildingData.getBuildings) {
    buildGrid.innerHTML = '<div class="empty-panel">No hay edificios disponibles aun.</div>';
    return;
  }

  const buildings = BuildingData.getBuildings();

  if (!buildings || buildings.length === 0) {
    buildGrid.innerHTML = '<div class="empty-panel">No hay edificios disponibles aun.</div>';
    return;
  }

  buildGrid.innerHTML = '';

  buildings.forEach(building => {
    const card = document.createElement('button');
    card.className = 'archive-card';

    const costText = [];
    if (building.cost?.credits) costText.push(`🪙 ${building.cost.credits}`);
    if (building.cost?.minerals) costText.push(`⛏️ ${building.cost.minerals}`);
    if (building.cost?.energy) costText.push(`⚡ ${building.cost.energy}`);
    if (building.cost?.research) costText.push(`🧪 ${building.cost.research}`);

    card.innerHTML =
      `<div class="archive-card-text">` +
      `<span class="archive-card-title">${building.name}</span>` +
      `<span class="archive-card-category">${building.type || 'Edificio'}</span>` +
      `<span class="archive-card-description">${building.description || ''}</span>` +
      `<span class="archive-card-cost">${costText.join(' ') || 'Sin coste'}</span>` +
      `</div>`;

    card.addEventListener('click', () => {
      if (typeof GameState === 'undefined') return;

      if (!GameState.canAfford(building.cost || {})) {
        alert('No tienes suficientes recursos para construir este edificio.');
        return;
      }

      const confirmed = confirm(`¿Construir ${building.name}?\n\nCoste: ${costText.join(' ') || 'Sin coste'}`);

      if (!confirmed) return;

      GameState.spendResources(building.cost || {});
      syncFromGameState();

      alert(`${building.name} construido con exito.`);
    });

    buildGrid.appendChild(card);
  });
}

function closeBuild() {
  if (buildScreen) buildScreen.style.display = 'none';
}

// ==================== INVESTIGAR ====================

function openResearch() {
  closeAllOverlays();

  if (!researchScreen || !researchGrid) return;

  researchScreen.style.display = 'block';
  researchGrid.innerHTML = '<div class="empty-panel">Tecnologias disponibles (proximamente).</div>';
}

function closeResearch() {
  if (researchScreen) researchScreen.style.display = 'none';
}

// ==================== MILITAR ====================

function openMilitary() {
  closeAllOverlays();

  if (!militaryScreen || !militaryGrid) return;

  militaryScreen.style.display = 'block';
  militaryGrid.innerHTML = '<div class="empty-panel">Flotas y naves (proximamente).</div>';
}

function closeMilitary() {
  if (militaryScreen) militaryScreen.style.display = 'none';
}

// ==================== EVENTOS DE NAVEGACION ====================

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(item => item.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;

    if (tab === 'archive') {
      openArchive();
    } else if (tab === 'build') {
      openBuild();
    } else if (tab === 'research') {
      openResearch();
    } else if (tab === 'military') {
      openMilitary();
    } else if (tab === 'menu') {
      // Aquí podrias abrir un menú de opciones más adelante.
      alert('Menu (proximamente)');
    } else {
      closeAllOverlays();
    }
  });
});

// Botones de volver de cada panel
if (archiveBack) {
  archiveBack.addEventListener('click', () => {
    archiveList.style.display = 'block';
    archiveDetail.style.display = 'none';
  });
}

if (buildBack) {
  buildBack.addEventListener('click', closeBuild);
}

if (researchBack) {
  researchBack.addEventListener('click', closeResearch);
}

if (militaryBack) {
  militaryBack.addEventListener('click', closeMilitary);
}

if (archiveSearch) {
  archiveSearch.addEventListener('input', renderArchiveGrid);
}

if (archiveFilters) {
  archiveFilters.addEventListener('click', event => {
    const button = event.target.closest('.archive-filter');

    if (!button) return;

    archiveFilters
      .querySelectorAll('.archive-filter')
      .forEach(filter => filter.classList.remove('active'));

    button.classList.add('active');
    renderArchiveGrid();
  });
}

// Botón "Siguiente turno".
function onNextTurn() {
  if (typeof TurnSystem === 'undefined' || typeof TurnSystem.nextTurn !== 'function') {
    console.warn('TurnSystem no está disponible para avanzar turno.');
    return;
  }

  const info = TurnSystem.nextTurn();
  syncFromGameState();
  updateResources();

  console.log('Turno avanzado:', info);
}

startBtn.addEventListener('click', () => {
  showScreen(gameScreen);
  syncFromGameState();
  updateResources();
});

if (nextTurnBtn) {
  nextTurnBtn.addEventListener('click', onNextTurn);
}

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('load', () => {
  if (typeof MapSystem === 'undefined' || typeof galaxyMap === 'undefined') return;

  MapSystem.init(canvas);

  const renderMap = () => {
    const mapButton = document.querySelector('.nav-btn[data-tab="map"]');

    if (
      gameScreen.classList.contains('active') &&
      mapButton &&
      mapButton.classList.contains('active')
    ) {
      MapSystem.render();
    }

    window.requestAnimationFrame(renderMap);
  };

  window.requestAnimationFrame(renderMap);
});
