// js/main.js
// Inicio de aplicación, selección de facción, navegación, Archivo y turnos.

const characterLore = {};

const state = {
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

const buildScreen = document.getElementById('build-screen');
const buildBack = document.getElementById('build-back');

const researchScreen = document.getElementById('research-screen');
const researchBack = document.getElementById('research-back');

const militaryScreen = document.getElementById('military-screen');
const militaryBack = document.getElementById('military-back');

const canvas = document.getElementById('game-canvas');

function updateResourceUI() {
  if (typeof GameState === 'undefined') return;

  const resources = GameState.getResources();
  const gameState = GameState.getState();

  if (energyRes) energyRes.textContent = Math.floor(resources.energy || 0);
  if (creditsRes) creditsRes.textContent = Math.floor(resources.credits || 0);
  if (mineralsRes) mineralsRes.textContent = Math.floor(resources.minerals || 0);
  if (researchRes) researchRes.textContent = Math.floor(resources.research || 0);
  if (turnInfoEl) turnInfoEl.textContent = `Turno ${gameState.turn || 1}`;
}

function closeAllOverlays() {
  if (archiveScreen) archiveScreen.style.display = 'none';
  if (buildScreen) buildScreen.style.display = 'none';
  if (researchScreen) researchScreen.style.display = 'none';
  if (militaryScreen) militaryScreen.style.display = 'none';
}

function setActiveTab(tabName) {
  navBtns.forEach(button => {
    button.classList.toggle('active', button.dataset.tab === tabName);
  });
}

function renderMap() {
  if (
    typeof MapSystem !== 'undefined' &&
    typeof MapSystem.render === 'function'
  ) {
    MapSystem.render();
  }
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
    .map(word => {
      if (!word) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function archiveDescription(title, type, path) {
  const fileName = path.split('/').pop().replace(/\.svg$/i, '');

  if (characterLore[fileName]) {
    return characterLore[fileName];
  }

  const descriptions = {
    personaje: `${title} es una figura registrada en los archivos galacticos. Su historia queda ligada a conflictos, alianzas y decisiones que marcaron su epoca.`,
    planeta: `${title} es una localizacion de importancia dentro de la galaxia. Sus condiciones, habitantes y recursos han influido en rutas, batallas y operaciones de distintas facciones.`,
    evento: `${title} representa un suceso destacado en los registros galacticos. Su impacto modifica el curso de un enfrentamiento y deja consecuencias para quienes participan.`,
    tecnologia: `${title} forma parte del equipo, arsenal o infraestructura utilizada en la galaxia. Su diseno responde a necesidades de combate, transporte, defensa o supervivencia.`
  };

  return descriptions[type] || `${title} es una entrada registrada en el Archivo galactico.`;
}

async function loadArchiveEntries() {
  if (state.archiveLoaded) {
    return state.archiveEntries;
  }

  if (state.archiveLoading) {
    return state.archiveLoading;
  }

  state.archiveLoading = fetch(
    'https://api.github.com/repos/Drevil10/starwars-galactic-conquest/git/trees/main?recursive=1'
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar el Archivo.');
      }

      return response.json();
    })
    .then(data => {
      state.archiveEntries = (data.tree || [])
        .filter(item => {
          return (
            item.type === 'blob' &&
            item.path.startsWith('assets/') &&
            item.path.endsWith('.svg')
          );
        })
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

      return state.archiveEntries;
    })
    .catch(error => {
      console.error('main.js: Error cargando el Archivo.', error);

      state.archiveEntries = [];
      state.archiveLoaded = true;

      return [];
    })
    .finally(() => {
      state.archiveLoading = null;
    });

  return state.archiveLoading;
}

function renderArchiveGrid() {
  if (!archiveGrid) return;

  const query = (archiveSearch?.value || '').toLowerCase().trim();

  const activeButton = archiveFilters?.querySelector(
    '.archive-filter.active'
  );

  const activeFilter = activeButton ? activeButton.dataset.type : 'all';

  const entries = state.archiveEntries.filter(entry => {
    const matchesType =
      activeFilter === 'all' || entry.type === activeFilter;

    const matchesQuery =
      !query ||
      entry.title.toLowerCase().includes(query) ||
      entry.description.toLowerCase().includes(query);

    return matchesType && matchesQuery;
  });

  archiveGrid.innerHTML = '';

  if (archiveEmpty) {
    archiveEmpty.style.display = entries.length > 0 ? 'none' : 'block';
  }

  entries.forEach(entry => {
    const card = document.createElement('button');

    card.type = 'button';
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
  if (archiveList) archiveList.style.display = 'none';
  if (archiveDetail) archiveDetail.style.display = 'block';

  if (detailImage) {
    detailImage.src = entry.image;
    detailImage.alt = entry.title;
  }

  if (detailTitle) detailTitle.textContent = entry.title;
  if (detailType) detailType.textContent = entry.type;
  if (detailDescription) detailDescription.textContent = entry.description;
}

async function openArchive() {
  closeAllOverlays();

  if (!archiveScreen) return;

  archiveScreen.style.display = 'block';

  if (archiveList) archiveList.style.display = 'block';
  if (archiveDetail) archiveDetail.style.display = 'none';

  if (!state.archiveLoaded) {
    if (archiveGrid) {
      archiveGrid.innerHTML =
        '<div class="archive-empty">Cargando Archivo...</div>';
    }

    if (archiveEmpty) {
      archiveEmpty.style.display = 'none';
    }

    await loadArchiveEntries();
  }

  renderArchiveGrid();
}

// ==================== PANELES DE JUEGO ====================

function openBuild() {
  closeAllOverlays();

  if (buildScreen) {
    buildScreen.style.display = 'block';
  }
}

function openResearch() {
  closeAllOverlays();

  if (researchScreen) {
    researchScreen.style.display = 'block';
  }
}

function openMilitary() {
  closeAllOverlays();

  if (militaryScreen) {
    militaryScreen.style.display = 'block';
  }
}

// ==================== CAMPAÑA Y TURNOS ====================

function openFactionSelection() {
  if (
    typeof FactionSelectionUI === 'undefined' ||
    typeof FactionSelectionUI.show !== 'function'
  ) {
    console.error(
      'main.js: FactionSelectionUI no está disponible.'
    );

    return;
  }

  FactionSelectionUI.show({
    onSelect: campaign => {
      startCampaign(campaign);
    }
  });
}

function startCampaign(campaign) {
  if (!campaign || !campaign.success) {
    console.error(
      'main.js: No se pudo crear la campaña.',
      campaign
    );

    return;
  }

  if (startScreen) startScreen.classList.remove('active');
  if (gameScreen) gameScreen.classList.add('active');

  closeAllOverlays();
  setActiveTab('map');
  updateResourceUI();

  setTimeout(() => {
    if (
      typeof MapSystem !== 'undefined' &&
      typeof MapSystem.fitToViewport === 'function'
    ) {
      MapSystem.fitToViewport();
    }

    renderMap();
  }, 50);

  console.log(
    `main.js: Campaña iniciada como ${campaign.faction.name}.`,
    campaign
  );
}

function advanceTurn() {
  if (
    typeof CampaignSystem !== 'undefined' &&
    typeof CampaignSystem.hasActiveCampaign === 'function' &&
    !CampaignSystem.hasActiveCampaign()
  ) {
    alert('Primero debes iniciar una campaña y elegir una facción.');
    return;
  }

  if (
    typeof TurnSystem === 'undefined' ||
    typeof TurnSystem.nextTurn !== 'function'
  ) {
    console.error('main.js: TurnSystem no está disponible.');
    return;
  }

  const result = TurnSystem.nextTurn();

  if (!result) return;

  updateResourceUI();
  renderMap();

  console.log(
    `main.js: Turno ${result.turn}. Producción:`,
    result.production
  );
}

// ==================== EVENTOS DE INTERFAZ ====================

if (startBtn) {
  startBtn.addEventListener('click', openFactionSelection);
} else {
  console.error('main.js: No se encontró el botón #start-btn.');
}

if (nextTurnBtn) {
  nextTurnBtn.addEventListener('click', advanceTurn);
}

navBtns.forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.dataset.tab;

    if (!tabName) return;

    setActiveTab(tabName);

    if (tabName === 'map') {
      closeAllOverlays();
      renderMap();
      return;
    }

    if (tabName === 'build') {
      openBuild();
      return;
    }

    if (tabName === 'research') {
      openResearch();
      return;
    }

    if (tabName === 'military') {
      openMilitary();
      return;
    }

    if (tabName === 'archive') {
      openArchive();
      return;
    }

    if (tabName === 'menu') {
      closeAllOverlays();
      alert('El menú de partida llegará tras la selección de facción.');
    }
  });
});

if (archiveBack) {
  archiveBack.addEventListener('click', () => {
    if (archiveList) archiveList.style.display = 'block';
    if (archiveDetail) archiveDetail.style.display = 'none';
  });
}

if (buildBack) {
  buildBack.addEventListener('click', () => {
    closeAllOverlays();
    setActiveTab('map');
    renderMap();
  });
}

if (researchBack) {
  researchBack.addEventListener('click', () => {
    closeAllOverlays();
    setActiveTab('map');
    renderMap();
  });
}

if (militaryBack) {
  militaryBack.addEventListener('click', () => {
    closeAllOverlays();
    setActiveTab('map');
    renderMap();
  });
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

// ==================== INICIALIZACIÓN ====================

window.addEventListener('load', () => {
  try {
    if (
      typeof GameState !== 'undefined' &&
      typeof GameState.init === 'function'
    ) {
      GameState.init();
    }

    if (
      typeof TurnSystem !== 'undefined' &&
      typeof TurnSystem.init === 'function'
    ) {
      TurnSystem.init();
    }

    if (
      typeof CampaignSystem !== 'undefined' &&
      typeof CampaignSystem.init === 'function'
    ) {
      CampaignSystem.init();
    }

    if (
      canvas &&
      typeof MapSystem !== 'undefined' &&
      typeof MapSystem.init === 'function'
    ) {
      MapSystem.init(canvas);
    }

    updateResourceUI();
  } catch (error) {
    console.error('main.js: Error al inicializar el juego.', error);
  }
});
