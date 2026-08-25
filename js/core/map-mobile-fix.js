// Dimensiona el buffer del canvas solamente cuando ya es visible.
(function () {
  function showMap() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas || typeof MapSystem === 'undefined') return;
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
