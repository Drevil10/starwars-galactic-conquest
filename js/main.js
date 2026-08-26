// js/main.js
// Inicio de aplicación, navegación y conexión de interfaz con el estado del juego.

const characterLore = {};

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');

const nextTurnBtn = document.getElementById('next-turn-btn');
const navBtns = document.querySelectorAll('.nav-btn');

const archiveScreen = document.getElementById('archive-screen');
const archiveList = document.getElementById('archive-list');
const archiveDetail = document.getElementById('archive-detail');
const archiveBack = document.getElementById('archive-back');

const buildScreen = document.getElementById('build-screen');
const buildBack = document.getElementById('build-back');

const researchScreen = document.getElementById('research-screen');
const researchBack = document.getElementById('research-back');

const militaryScreen = document.getElementById('military-screen');
const militaryBack = document.getElementById('military-back');

const canvas = document.getElementById('game-canvas');

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

function showOverlay(tabName) {
  closeAllOverlays();

  if (tabName === 'archive' && archiveScreen) {
    archiveScreen.style.display = 'block';

    if (archiveList) archiveList.style.display = 'block';
    if (archiveDetail) archiveDetail.style.display = 'none';
  }

  if (tabName === 'build' && buildScreen) {
    buildScreen.style.display = 'block';
  }

  if (tabName === 'research' && researchScreen) {
    researchScreen.style.display = 'block';
  }

  if (tabName === 'military' && militaryScreen) {
    militaryScreen.style.display = 'block';
  }
}

function renderMap() {
  if (
    typeof MapSystem !== 'undefined' &&
    typeof MapSystem.render === 'function'
  ) {
    MapSystem.render();
  }
}

function startGame() {
  if (startScreen) startScreen.classList.remove('active');
  if (gameScreen) gameScreen.classList.add('active');

  closeAllOverlays();
  setActiveTab('map');

  if (typeof GameState !== 'undefined') {
    GameState.setScreen('map');
    GameState.setGameState('playing');
    GameState.updateResourceUI();
    GameState.updateTurnUI();
  }

  setTimeout(() => {
    if (
      typeof MapSystem !== 'undefined' &&
      typeof MapSystem.fitToViewport === 'function'
    ) {
      MapSystem.fitToViewport();
    }

    renderMap();
  }, 50);

  console.log('main.js: Partida iniciada.');
}

function advanceTurn() {
  if (
    typeof TurnSystem === 'undefined' ||
    typeof TurnSystem.nextTurn !== 'function'
  ) {
    console.error('main.js: TurnSystem no está disponible.');
    return;
  }

  const result = TurnSystem.nextTurn();

  if (!result) return;

  renderMap();

  console.log(
    `main.js: Turno ${result.turn}. Producción:`,
    result.production
  );
}

function initializeSystems() {
  if (typeof GameState !== 'undefined' && typeof GameState.init === 'function') {
    GameState.init();
  }

  if (typeof TurnSystem !== 'undefined' && typeof TurnSystem.init === 'function') {
    TurnSystem.init();
  }

  if (
    canvas &&
    typeof MapSystem !== 'undefined' &&
    typeof MapSystem.init === 'function'
  ) {
    MapSystem.init(canvas);
  }
}

if (startBtn) {
  startBtn.addEventListener('click', startGame);
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

    if (tabName === 'menu') {
      closeAllOverlays();
      alert('El menú de partida llegará tras la selección de facción.');
      return;
    }

    showOverlay(tabName);
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

window.addEventListener('load', () => {
  try {
    initializeSystems();
  } catch (error) {
    console.error('main.js: Error al inicializar el juego.', error);
  }
});
