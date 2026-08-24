// Compatibilidad móvil: no sobrescribir la cámara del mapa.
(function () {
  window.addEventListener('load', () => {
    window.addEventListener('orientationchange', () => {
      window.setTimeout(() => {
        if (typeof MapSystem !== 'undefined' && typeof MapSystem.render === 'function') {
          MapSystem.render();
        }
      }, 180);
    });
  });
})();
