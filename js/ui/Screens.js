class ScreensClass {
    constructor() { this.currentScreen = null; this.screens = {}; this.isTransitioning = false; }
    init() {
        this.screens = { start: document.getElementById('start-screen'), game: document.getElementById('game-screen') };
        const startButton = document.getElementById('start-btn');
        if (!startButton) { console.error('Screens: start button not found'); return false; }
        startButton.addEventListener('click', () => this.startAdventure());
        this.showScreen('start');
        return true;
    }
    startAdventure() {
        if (this.isTransitioning || this.currentScreen === 'game') return;
        this.isTransitioning = true;
        this.showScreen('game');
        requestAnimationFrame(() => { if (window.Game && Game.resizeCanvas) Game.resizeCanvas(); this.isTransitioning = false; });
    }
    showScreen(screenName) {
        const nextScreen = this.screens[screenName];
        if (!nextScreen) { console.warn('Screens: screen not found', screenName); return; }
        Object.values(this.screens).forEach((screen) => { if (screen) screen.classList.remove('active'); });
        nextScreen.classList.add('active');
        this.currentScreen = screenName;
        if (window.GameState) { GameState.setGameState(screenName === 'game' ? 'playing' : 'menu'); if (screenName === 'game') GameState.setScreen('base'); }
        if (window.EventBus) EventBus.emit('screen:changed', { screen: screenName });
    }
    getCurrentScreen() { return this.currentScreen; }
}
window.Screens = new ScreensClass();
