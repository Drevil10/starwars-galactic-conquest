// Star Wars: Galactic Conquest - Main Game File
// Este archivo maneja el bucle principal del juego, la UI y la lógica central

// Importar datos del mapa
import './data/map-data.js';

// Importar sistemas core
import './core/map-system.js';

// Estado global del juego
const GameState = {
  currentScreen: 'start', // start, game, menu
  selectedTab: 'map',
  resources: {
    energy: 0,
    credits: 0,
    minerals: 0,
    research: 0
  },
  selectedFaction: null,
  planets: [],
  systems: []
};

// Elementos del DOM
const elements = {
  app: null,
  startScreen: null,
  gameScreen: null,
  startBtn: null,
  canvas: null,
  resourcesHeader: null,
  bottomNav: null,
  archiveScreen: null
};

// Inicializar el juego
function initGame() {
  // Cache de elementos del DOM
  elements.app = document.getElementById('app');
  elements.startScreen = document.getElementById('start-screen');
  elements.gameScreen = document.getElementById('game-screen');
  elements.startBtn = document.getElementById('start-btn');
  elements.canvas = document.getElementById('game-canvas');
  elements.resourcesHeader = document.getElementById('resources-header');
  elements.bottomNav = document.getElementById('bottom-nav');
  elements.archiveScreen = document.getElementById('archive-screen');

  // Configurar eventos
  elements.startBtn.addEventListener('click', startGame);
  setupNavigation();
  setupArchive();

  // Inicializar sistemas
  if (elements.canvas) {
    MapSystem.init(elements.canvas);
  }

  // Iniciar bucle del juego
  requestAnimationFrame(gameLoop);
}

// Iniciar una nueva partida
function startGame() {
  GameState.currentScreen = 'game';
  elements.startScreen.classList.remove('active');
  elements.gameScreen.classList.add('active');
  
  // Configurar canvas
  if (elements.canvas) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
  
  // Inicializar recursos iniciales
  GameState.resources = {
    energy: 100,
    credits: 100,
    minerals: 100,
    research: 0
  };
  
  updateResourcesUI();
}

// Ajustar tamaño del canvas
function resizeCanvas() {
  if (!elements.canvas) return;
  
  const canvas = elements.canvas;
  const parent = canvas.parentElement;
  
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;
}

// Configurar navegación
function setupNavigation() {
  if (!elements.bottomNav) return;
  
  const navBtns = elements.bottomNav.querySelectorAll('.nav-btn:not(.nav-menu-btn)');
  
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      // Actualizar UI
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Cambiar tab
      GameState.selectedTab = tab;
      
      // Ocultar overlays
      if (elements.archiveScreen) {
        elements.archiveScreen.style.display = 'none';
      }
      
      // Acción específica por tab
      handleTabChange(tab);
    });
  });
}

// Manejar cambio de tab
function handleTabChange(tab) {
  switch(tab) {
    case 'map':
      // Volver al mapa
      if (elements.archiveScreen) {
        elements.archiveScreen.style.display = 'none';
      }
      break;
    case 'archive':
      // Mostrar archivo
      if (elements.archiveScreen) {
        elements.archiveScreen.style.display = 'flex';
      }
      break;
    case 'build':
    case 'research':
    case 'military':
      // TODO: Implementar
      console.log(`Tab ${tab} no implementado aún`);
      break;
  }
}

// Configurar archivo
function setupArchive() {
  // Esta función ya existe en archive-lore-original.js
  // La llamamos si está disponible
  if (typeof initArchive === 'function') {
    initArchive();
  }
}

// Actualizar UI de recursos
function updateResourcesUI() {
  if (!elements.resourcesHeader) return;
  
  const energyEl = elements.resourcesHeader.querySelector('#energy-res');
  const creditsEl = elements.resourcesHeader.querySelector('#credits-res');
  const mineralsEl = elements.resourcesHeader.querySelector('#minerals-res');
  const researchEl = elements.resourcesHeader.querySelector('#research-res');
  
  if (energyEl) energyEl.textContent = GameState.resources.energy;
  if (creditsEl) creditsEl.textContent = GameState.resources.credits;
  if (mineralsEl) mineralsEl.textContent = GameState.resources.minerals;
  if (researchEl) researchEl.textContent = GameState.resources.research;
}

// Bucle principal del juego
function gameLoop() {
  // Actualizar lógica
  update();
  
  // Renderizar
  render();
  
  // Siguiente frame
  requestAnimationFrame(gameLoop);
}

// Actualizar estado del juego
function update() {
  // TODO: L lógica del juego (recursos, IA, etc.)
}

// Renderizar el juego
function render() {
  // Renderizar mapa si estamos en la tab de mapa
  if (GameState.selectedTab === 'map' && MapSystem) {
    MapSystem.render();
  }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initGame);
