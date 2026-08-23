/**
 * Screens.js
 * Sistema de gesti�n de pantallas
 */

const Screens = {
    currentScreen: null,
    screens: {},

    initialize() {
        console.log('[Screens] Sistema inicializado');
        this.screens = {
            start: document.getElementById(Constants.SCREENS.START),
            game: document.getElementById(Constants.SCREENS.GAME)
        };
        const startBtn = document.getElementById('start-btn');
        const loadBtn = document.getElementById('load-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => EventBus.emit(Constants.EVENTS.GAME.START));
        }
        if (loadBtn) {
            loadBtn.addEventListener('click', () => EventBus.emit(Constants.EVENTS.GAME.LOAD));
            if (!SaveSystem.hasSave()) {
                loadBtn.disabled = true;
                loadBtn.style.opacity = '0.5';
                loadBtn.textContent = 'Sin Partida Guardada';
            }
        }
        EventBus.subscribe(Constants.EVENTS.NAVIGATION.SCREEN_CHANGE, (data) => {
            this.showScreen(data.screen);
        });
        this.showScreen(Constants.SCREENS.START);
    },

    showScreen(screenId) {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        const targetScreen = this.screens[screenId.replace('-screen', '')] ||
                            document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            console.log(`[Screens] Pantalla mostrada: ${screenId}`);
        } else {
            console.warn(`[Screens] Pantalla no encontrada: ${screenId}`);
        }
    },

    getCurrentScreen() { return this.currentScreen; }
};

window.Screens = Screens;