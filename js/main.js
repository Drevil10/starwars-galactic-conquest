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

  // Actualizar información de turno si existe.
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

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(item => item.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.tab === 'archive') openArchive();
    else closeArchive();
  });
});

async function openArchive() {
  archiveScreen.style.display = 'block';
  archiveList.style.display = 'block';
  archiveDetail.style.display = 'none';

  if (!state.archiveLoaded) {
    archiveGrid.innerHTML = '<div class="archive-empty">Cargando Archivo...</div>';
    archiveEmpty.style.display = 'none';
    await loadArchiveEntries();
  }

  renderArchiveGrid();
}

function closeArchive() {
  archiveScreen.style.display = 'none';
}

function renderArchiveGrid() {
  const query = (archiveSearch.value || '').toLowerCase().trim();
  const activeButton = archiveFilters.querySelector('.archive-filter.active');
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
  archiveEmpty.style.display = entries.length ? 'none' : 'block';

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
  archiveList.style.display = 'none';
  archiveDetail.style.display = 'block';

  detailImage.src = entry.image;
  detailImage.alt = entry.title;
  detailTitle.textContent = entry.title;
  detailType.textContent = entry.type;
  detailDescription.textContent = entry.description;
}

archiveBack.addEventListener('click', () => {
  archiveList.style.display = 'block';
  archiveDetail.style.display = 'none';
});

archiveSearch.addEventListener('input', renderArchiveGrid);

archiveFilters.addEventListener('click', event => {
  const button = event.target.closest('.archive-filter');

  if (!button) return;

  archiveFilters
    .querySelectorAll('.archive-filter')
    .forEach(filter => filter.classList.remove('active'));

  button.classList.add('active');
  renderArchiveGrid();
});

// Botón “Siguiente turno”.
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

  // Sincronizar recursos desde GameState al entrar en partida.
  syncFromGameState();
  updateResources();
});

// Conectar botón de turno si existe en el HTML.
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
