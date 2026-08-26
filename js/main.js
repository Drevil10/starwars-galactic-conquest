// js/main.js
// Punto de entrada mínimo - solo navegación de pantallas.

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const nextTurnBtn = document.getElementById('next-turn-btn');
const turnInfoEl = document.getElementById('turn-info');
const navBtns = document.querySelectorAll('.nav-btn');

const archiveScreen = document.getElementById('archive-screen');
const buildScreen = document.getElementById('build-screen');
const researchScreen = document.getElementById('research-screen');
const militaryScreen = document.getElementById('military-screen');

function closeAllOverlays() {
  if (archiveScreen) archiveScreen.style.display = 'none';
  if (buildScreen) buildScreen.style.display = 'none';
  if (researchScreen) researchScreen.style.display = 'none';
  if (militaryScreen) militaryScreen.style.display = 'none';
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(item => item.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;

    if (tab === 'map') {
      closeAllOverlays();
    } else if (tab === 'build') {
      if (buildScreen) buildScreen.style.display = 'block';
    } else if (tab === 'research') {
      if (researchScreen) researchScreen.style.display = 'block';
    } else if (tab === 'military') {
      if (militaryScreen) militaryScreen.style.display = 'block';
    } else if (tab === 'archive') {
      if (archiveScreen) archiveScreen.style.display = 'block';
    } else if (tab === 'menu') {
      alert('Menú (próximamente)');
    } else {
      closeAllOverlays();
    }
  });
});

if (nextTurnBtn) {
  nextTurnBtn.addEventListener('click', () => {
    let turn = 1;

    if (turnInfoEl) {
      const match = turnInfoEl.textContent.match(/Turno\s*(\d+)/i);
      if (match) turn = parseInt(match[1], 10) + 1;
      turnInfoEl.textContent = `Turno ${turn}`;
    }

    console.log('Turno avanzado a', turn);
  });
}

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (startScreen) startScreen.classList.remove('active');
    if (gameScreen) gameScreen.classList.add('active');

    console.log('Partida iniciada');
  });
} else {
  console.error('No se encontró el botón #start-btn');
}
