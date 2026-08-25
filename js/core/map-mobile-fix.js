// Organiza el mapa estratégico y lo inicializa cuando ya es visible.
(function () {
  function applyGalacticLayout() {
    if (typeof galaxyMap === 'undefined' || !Array.isArray(galaxyMap.systems)) return;
    const layout = {
      coruscant: { x: 500, y: 360, routes: ['corellia', 'alderaan', 'naboo'] },
      corellia: { x: 350, y: 470, routes: ['coruscant', 'alderaan', 'tatooine'] },
      alderaan: { x: 620, y: 480, routes: ['coruscant', 'corellia', 'naboo', 'kamino'] },
      naboo: { x: 510, y: 630, routes: ['coruscant', 'alderaan', 'tatooine', 'kashyyyk'] },
      kamino: { x: 760, y: 610, routes: ['alderaan', 'naboo', 'geonosis', 'mandalore'] },
      tatooine: { x: 260, y: 780, routes: ['corellia', 'naboo', 'geonosis'] },
      geonosis: { x: 450, y: 850, routes: ['tatooine', 'kamino', 'utapau'] },
      utapau: { x: 620, y: 930, routes: ['geonosis', 'mustafar', 'kashyyyk'] },
      mustafar: { x: 790, y: 900, routes: ['utapau', 'kashyyyk', 'ryloth'] },
      kashyyyk: { x: 700, y: 760, routes: ['naboo', 'utapau', 'mustafar', 'ryloth'] },
      ryloth: { x: 880, y: 770, routes: ['mustafar', 'kashyyyk', 'lothal', 'jakku'] },
      lothal: { x: 1010, y: 650, routes: ['ryloth', 'mandalore', 'endor'] },
      mandalore: { x: 920, y: 480, routes: ['kamino', 'lothal', 'hoth'] },
      hoth: { x: 1110, y: 410, routes: ['mandalore', 'endor'] },
      endor: { x: 1130, y: 650, routes: ['hoth', 'lothal', 'jakku'] },
      jakku: { x: 1050, y: 870, routes: ['ryloth', 'endor'] }
    };
    galaxyMap.systems.forEach(system => (system.planets || []).forEach(planet => {
      const config = layout[planet.id];
      if (!config) return;
      planet.position = { x: config.x, y: config.y };
      planet.routes = config.routes;
    }));
    window.galaxyMap = galaxyMap;
  }

  function showMap() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas || typeof MapSystem === 'undefined') return;
    applyGalacticLayout();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      MapSystem.init(canvas);
      MapSystem.fitToViewport();
    }));
  }

  window.addEventListener('load', () => {
    const startButton = document.getElementById('start-btn');
    if (startButton) startButton.addEventListener('click', showMap);
    document.querySelectorAll('[data-tab="map"]').forEach(button => button.addEventListener('click', showMap));
    window.addEventListener('resize', showMap);
    window.addEventListener('orientationchange', () => setTimeout(showMap, 180));
  });
})();
