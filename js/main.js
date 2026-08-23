(function () {
    'use strict';
    let startRequested = false;
    function activateGameScreen() {
        if (startRequested) return;
        startRequested = true;
        const startScreen = document.getElementById('start-screen');
        const gameScreen = document.getElementById('game-screen');
        if (startScreen) startScreen.classList.remove('active');
        if (gameScreen) gameScreen.classList.add('active');
        try { if (window.Screens && Screens.currentScreen !== 'game') Screens.showScreen('game'); } catch (error) { console.error('main: Screens fallback', error); }
        try { if (window.GameState) { GameState.setGameState('playing'); GameState.setScreen('base'); } } catch (error) { console.error('main: GameState fallback', error); }
        requestAnimationFrame(() => { try { if (window.Game && Game.resizeCanvas) Game.resizeCanvas(); } catch (error) { console.error('main: Canvas resize fallback', error); } });
    }
    function registerStartFallback() {
        const isStartButton = (target) => target && target.closest && target.closest('#start-btn');
        document.addEventListener('click', (event) => { if (isStartButton(event.target)) activateGameScreen(); });
        document.addEventListener('pointerup', (event) => { if (event.pointerType === 'touch' && isStartButton(event.target)) activateGameScreen(); });
        document.addEventListener('touchend', (event) => { if (isStartButton(event.target)) activateGameScreen(); }, { passive: true });
    }
    function initSafely(name, callback) { try { callback(); } catch (error) { console.error('main: Error al inicializar ' + name, error); } }
    function init() {
        registerStartFallback();
        initSafely('GameState', () => GameState.init());
        initSafely('Screens', () => Screens.init());
        initSafely('Game', () => Game.init());
        initSafely('ResourceManager', () => ResourceManager.init());
        initSafely('Base', () => Base.init());
        initSafely('Characters', () => Characters.init());
        initSafely('Ships', () => Ships.init());
        initSafely('Navigation', () => Navigation.init());
        initSafely('Input', () => Input.init());
        try { if (window.Game && Game.start) Game.start(); } catch (error) { console.error('main: Error al iniciar el loop', error); }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
}());
