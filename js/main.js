/**
 * main.js
 * Punto de entrada principal del juego
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c⭐ Star Wars: Galactic Conquest ⭐', 'color: #FFE81F; font-size: 20px; font-weight: bold;');
    console.log(`%cVersion ${Constants.GAME.VERSION}`, 'color: #8B8B8B; font-size: 12px;');
    console.log('---');
    
    try {
        Game.initialize();
        console.log('%c✓ Juego inicializado correctamente', 'color: #4CAF50; font-size: 14px;');
    } catch (error) {
        console.error('%c✗ Error al inicializar el juego:', 'color: #F44336; font-size: 14px;', error);
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js');
    });
}

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (Game.resizeCanvas) Game.resizeCanvas();
    }, 250);
});

window.addEventListener('beforeunload', () => {
    if (Game.isRunning) Game.save();
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
        e.preventDefault();
        Game.save();
        Components.showNotification('Partida guardada', 'success', 2000);
    }
    if (e.code === 'Escape') {
        if (Game.isRunning && !Game.isPaused) {
            Game.pause();
            Components.showNotification('Juego pausado', 'info', 2000);
        } else if (Game.isPaused) {
            Game.resume();
            Components.showNotification('Juego continuado', 'success', 2000);
        }
    }
});