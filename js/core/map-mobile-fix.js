// Dispara el encuadre solo cuando el mapa ya es visible.
(function () {
  function showMap() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas || typeof MapSystem === 'undefined') return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      MapSystem.init(canvas);
      MapSystem.resizeToViewport(true);
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
