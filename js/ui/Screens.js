// js/ui/Screens.js
// Gestiona las pantallas principales y garantiza el acceso táctil al inicio.

class ScreensClass {
    constructor() {
        this.currentScreen = null;
        this.screens = {};
        this.isTransitioning = false;
        this.startHandler = null;
    }

    init() {
        this.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen')
        };

        const startButton = document.getElementById('start-btn');
        if (!startButton) {
            console.error('Screens: No se encontró #start-btn');
            return false;
        }

        this.startHandler = () => this.startAdventure();
        startButton.addEventListener('click', this.startHandler);
        startButton.addEventListener('pointerup', (event) => {
            if (event.pointerType === 'touch') this.startAdventure();
        });

        this.showScreen('start');
        return true;
    }

    startAdventure() {
        if (this.isTransitioning || this.currentScreen === 'game') return;
        this.isTransitioning = true;
        this.showScreen('game');

        requestAnimationFrame(() => {
            if (typeof Game !== 'undefined' && Game.resizeCanvas) {
                Game.resizeCanvas();
            }
            this.isTransitioning = false;
        });
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

        if (typeof GameState !== 'undefined') {
            GameState.setGameState(screenName === 'game' ? 'playing' : 'menu');
            if (screenName === 'game') GameState.setScreen('base');
        }

        if (typeof EventBus !== 'undefined') {
            EventBus.emit('screen:changed', { screen: screenName });
        }
    }

    getCurrentScreen() {
        return this.currentScreen;
    }
}

window.Screens = new ScreensClass();
