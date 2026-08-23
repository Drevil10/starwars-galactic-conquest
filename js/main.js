// js/main.js
// Punto de entrada principal del juego

(function() {
    'use strict';

    console.log('Star Wars: Galactic Conquest - Iniciando...');

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('DOM listo, inicializando juego...');

        try {
            // 1. Inicializar sistemas core
            GameState.init();
            
            // 2. Inicializar canvas y game loop
            const gameInit = Game.init();
            if (!gameInit) {
                console.error('main: Error al inicializar Game');
                return;
            }

            // 3. Inicializar sistemas de juego
            ResourceManager.init();
            Base.init();
            Characters.init();
            Ships.init();

            // 4. Inicializar UI
            Screens.init();
            Navigation.init();
            Input.init();

            // 5. Mostrar pantalla de inicio
            Screens.showScreen('start');

            // 6. Iniciar game loop (se mantiene corriendo pero solo renderiza cuando es necesario)
            Game.start();

            console.log('main: Juego inicializado correctamente');
        } catch (error) {
            console.error('main: Error fatal al inicializar', error);
        }
    }
})();
