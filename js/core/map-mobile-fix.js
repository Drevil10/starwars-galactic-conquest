// Encuadra todos los planetas dentro del canvas visible en móvil.
(function () {
  function fitMapToCanvas() {
    if (typeof MapSystem === 'undefined' || !MapSystem.canvas || !MapSystem.ctx) return;
    const planets = MapSystem.planets || [];
    if (!planets.length) return;

    const canvas = MapSystem.canvas;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    MapSystem.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const xs = planets.map(planet => planet.x);
    const ys = planets.map(planet => planet.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const paddingX = 54;
    const paddingY = 78;
    const worldWidth = Math.max(1, maxX - minX);
    const worldHeight = Math.max(1, maxY - minY);
    const zoom = Math.min(
      (rect.width - paddingX * 2) / worldWidth,
      (rect.height - paddingY * 2) / worldHeight,
      1
    );

    MapSystem.camera = {
      zoom,
      x: rect.width / 2 - ((minX + maxX) / 2) * zoom,
      y: rect.height / 2 - ((minY + maxY) / 2) * zoom
    };
    MapSystem.render();
  }

  window.addEventListener('load', () => {
    const startButton = document.getElementById('start-btn');
    if (startButton) startButton.addEventListener('click', () => requestAnimationFrame(fitMapToCanvas));
    window.addEventListener('resize', fitMapToCanvas);
    window.addEventListener('orientationchange', () => setTimeout(fitMapToCanvas, 180));
  });
})();
