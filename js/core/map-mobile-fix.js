// Compatibilidad móvil: el encuadre se gestiona íntegramente en MapSystem.
(function () {
  window.addEventListener('load', () => {
    window.addEventListener('orientationchange', () => {
      window.setTimeout(() => {
        if (typeof MapSystem !== 'undefined') MapSystem.fitToViewport();
      }, 180);
    });
  });
})();
