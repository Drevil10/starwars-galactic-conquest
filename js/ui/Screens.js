// js/ui/Screens.js
// Sistema de gestión de pantallas

class ScreensClass {
    constructor() {
        this.currentScreen = null;
        this.screens = {};
    }

    init() {
        // Registrar pantallas
        this.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen')
        };

        // Botón de inicio
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.showScreen('game'));
        }

        console.log('Screens: Inicializadas');
    }

    showScreen(screenName) {
        if (!this.screens[screenName]) {
            console.warn('Screens: Pantalla no encontrada', screenName);
            return;
        }

        // Ocultar todas
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });

        // Mostrar la deseada
        this.screens[screenName].classList.add('active');
        this.currentScreen = screenName;

        // Actualizar estado del juego
        if (screenName === 'game') {
            GameState.setGameState('playing');
            GameState.setScreen('base');
        } else {
            GameState.setGameState('menu');
        }

        EventBus.emit('screen:changed', { screen: screenName });
        console.log('Screens: Mostrando', screenName);
    }

    getCurrentScreen() {
        return this.currentScreen;
    }
}

// Exportar instancia global
window.Screens = new ScreensClass();
