// Ajuste aislado para que el mapa se dimensione después de mostrar la pantalla de juego.
(function () {
  function resizeMapCanvas() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas || typeof MapSystem === 'undefined') return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    MapSystem.canvas = canvas;
    MapSystem.ctx = canvas.getContext('2d');
    MapSystem.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    MapSystem.camera = { x: 0, y: 0, zoom: 0.72 };
    MapSystem.render();
  }

  window.addEventListener('load', () => {
    const startButton = document.getElementById('start-btn');
    if (startButton) {
      startButton.addEventListener('click', () => {
        window.requestAnimationFrame(resizeMapCanvas);
      });
    }
    window.addEventListener('resize', resizeMapCanvas);
    window.addEventListener('orientationchange', () => {
      window.setTimeout(resizeMapCanvas, 150);
    });
  });
})();
