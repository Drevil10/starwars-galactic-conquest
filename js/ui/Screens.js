// js/ui/Screens.js
// Gestión de inicio, partida y retorno seguro al menú.

class ScreensClass {
    constructor() {
        this.currentScreen = null;
        this.screens = {};
        this.isTransitioning = false;
    }

    init() {
        this.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen')
        };

        const startButton = document.getElementById('start-btn');
        const menuButton = document.getElementById('menu-btn');

        if (!startButton) {
            console.error('Screens: No se encontró #start-btn');
            return false;
        }

        startButton.addEventListener('click', () => this.startAdventure());

        if (menuButton) {
            menuButton.addEventListener('click', () => this.returnToMenu());
        }

        this.showScreen('start');
        return true;
    }

    startAdventure() {
        if (this.isTransitioning || this.currentScreen === 'game') return;

        this.isTransitioning = true;
        this.showScreen('game');

        requestAnimationFrame(() => {
            if (window.Game && Game.resizeCanvas) Game.resizeCanvas();
            this.isTransitioning = false;
        });
    }

    returnToMenu() {
        try {
            if (window.GameState && typeof GameState.save === 'function') {
                GameState.save();
            }
        } catch (error) {
            console.error('Screens: No se pudo guardar antes de volver al menú', error);
        }

        const startButton = document.getElementById('start-btn');
        if (startButton) {
            startButton.textContent = 'Continuar aventura';
        }

        this.showScreen('start');
    }

    showScreen(screenName) {
        const nextScreen = this.screens[screenName];
        if (!nextScreen) {
            console.warn('Screens: Pantalla no encontrada', screenName);
            return;
        }

        Object.values(this.screens).forEach((screen) => {
            if (screen) screen.classList.remove('active');
        });
        nextScreen.classList.add('active');
        this.currentScreen = screenName;

        if (window.GameState) {
            GameState.setGameState(screenName === 'game' ? 'playing' : 'menu');
            if (screenName === 'game') GameState.setScreen('base');
        }

        if (window.EventBus) {
            EventBus.emit('screen:changed', { screen: screenName });
        }
    }

    getCurrentScreen() {
        return this.currentScreen;
    }
}

window.Screens = new ScreensClass();
