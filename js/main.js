// Estado base
const state = {
  energy: 100,
  credits: 50,
  minerals: 30,
  research: 10,
  archiveUnlocked: true,
  archiveEntries: [
    { id: 'luke', type: 'personaje', title: 'Luke Skywalker', description: 'Jedi legendario que restauro el equilibrio en la Fuerza.', image: 'assets/luke.svg' },
    { id: 'vader', type: 'personaje', title: 'Darth Vader', description: 'Senor Oscuro de los Sith y comandante supremo del Imperio.', image: 'assets/vader.svg' },
    { id: 'tato', type: 'planeta', title: 'Tatooine', description: 'Planeta desertico en las Regiones Exteriores, hogar de Anakin y Luke.', image: 'assets/tatooine.svg' },
    { id: 'xwing', type: 'tecnologia', title: 'Caza X-wing', description: 'Nave de superioridad estelar usada por la Alianza Rebelde.', image: 'assets/xwing.svg' },
    { id: 'deathstar', type: 'tecnologia', title: 'Estrella de la Muerte', description: 'Superarma orbital capaz de destruir planetas enteros.', image: 'assets/deathstar.svg' },
    { id: 'yavin', type: 'evento', title: 'Batalla de Yavin', description: 'Asalto rebelde que destruyo la primera Estrella de la Muerte.', image: 'assets/yavin.svg' }
  ]
};

// Elementos DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const energyRes = document.getElementById('energy-res');
const creditsRes = document.getElementById('credits-res');
const mineralsRes = document.getElementById('minerals-res');
const researchRes = document.getElementById('research-res');
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

// Utilidades
function updateResources() {
  energyRes.textContent = state.energy;
  creditsRes.textContent = state.credits;
  mineralsRes.textContent = state.minerals;
  researchRes.textContent = state.research;
}

function showScreen(screen) {
  startScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  screen.classList.add('active');
}

// Navegacion inferior
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    if (tab === 'archive') {
      openArchive();
    } else {
      closeArchive();
    }
  });
});

// Archivo
function openArchive() {
  archiveScreen.style.display = 'block';
  archiveList.style.display = 'block';
  archiveDetail.style.display = 'none';
  renderArchiveGrid();
}

function closeArchive() {
  archiveScreen.style.display = 'none';
}

function renderArchiveGrid() {
  const query = (archiveSearch.value || '').toLowerCase().trim();
  const activeFilter = archiveFilters.querySelector('.archive-filter.active').dataset.type;
  const entries = state.archiveEntries.filter(e => {
    const matchesType = activeFilter === 'all' || e.type === activeFilter;
    const matchesQuery = !query || e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query);
    return matchesType && matchesQuery;
  });
  archiveGrid.innerHTML = '';
  if (entries.length === 0) {
    archiveEmpty.style.display = 'block';
    return;
  }
  archiveEmpty.style.display = 'none';
  entries.forEach(entry => {
    const card = document.createElement('button');
    card.className = 'archive-card';
    card.innerHTML = `
      <img class="archive-card-image" src="${entry.image}" alt="" />
      <div class="archive-card-text">
        <span class="archive-card-title">${entry.title}</span>
        <span class="archive-card-category">${entry.type}</span>
      </div>
    `;
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

archiveFilters.addEventListener('click', (e) => {
  if (!e.target.classList.contains('archive-filter')) return;
  archiveFilters.querySelectorAll('.archive-filter').forEach(f => f.classList.remove('active'));
  e.target.classList.add('active');
  renderArchiveGrid();
});

// Inicio
startBtn.addEventListener('click', () => {
  showScreen(gameScreen);
  updateResources();
});

// Canvas placeholder
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
