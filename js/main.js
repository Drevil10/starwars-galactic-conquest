// js/main.js
// Punto de entrada: el menú se vuelve interactivo antes de arrancar el resto de sistemas.

(function () {
    'use strict';

    function initSafely(name, callback) {
        try {
            callback();
        } catch (error) {
            console.error(`main: Error al inicializar ${name}`, error);
        }
    }

    function init() {
        // La pantalla de inicio y su botón deben funcionar incluso si otro módulo falla.
        initSafely('Screens', () => Screens.init());

        initSafely('GameState', () => GameState.init());
        initSafely('Game', () => Game.init());
        initSafely('ResourceManager', () => ResourceManager.init());
        initSafely('Base', () => Base.init());
        initSafely('Characters', () => Characters.init());
        initSafely('Ships', () => Ships.init());
        initSafely('Navigation', () => Navigation.init());
        initSafely('Input', () => Input.init());

        if (typeof Game !== 'undefined' && Game.start) {
            Game.start();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
}());
