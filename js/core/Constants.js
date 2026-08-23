// js/core/Constants.js
// Constantes globales del juego

window.Constants = {
    // Configuraci�n de la cuadrícula
    GRID_SIZE: 10, // 10x10 celdas
    
    // Recursos
    RESOURCES: {
        CREDITS: 'credits',
        CRYSTALS: 'crystals',
        ENERGY: 'energy'
    },
    
    // Configuración inicial de recursos
    INITIAL_RESOURCES: {
        credits: 500,
        crystals: 100,
        energy: 200
    },
    
    // Tasas de producción (por segundo)
    PRODUCTION_RATES: {
        credits: 1,
        crystals: 0.5,
        energy: 2
    },
    
    // Límites de recursos
    RESOURCE_LIMITS: {
        credits: 10000,
        crystals: 5000,
        energy: 2000
    },
    
    // Configuración del juego
    GAME: {
        TICK_RATE: 60, // FPS objetivo
        SAVE_INTERVAL: 30000, // Guardar cada 30 segundos
        AUTO_SAVE: true
    },
    
    // Pantallas disponibles
    SCREENS: {
        START: 'start',
        BASE: 'base',
        CHARACTERS: 'characters',
        SHIPS: 'ships',
        EXPLORE: 'explore',
        MISSIONS: 'missions'
    },
    
    // Estados del juego
    STATES: {
        LOADING: 'loading',
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'game_over'
    }
};