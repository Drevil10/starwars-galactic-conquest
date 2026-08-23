/**
 * GameState.js
 * Estado centralizado del juego
 */

const GameState = {
    gameInfo: {
        version: Constants.GAME.VERSION,
        saveVersion: Constants.GAME.SAVE_VERSION,
        lastSave: null,
        playTime: 0
    },

    resources: {
        credits: 0,
        materials: 0,
        energy: 0
    },

    production: {
        credits: 0,
        materials: 0,
        energy: 0
    },

    base: {
        level: 1,
        buildings: [],
        upgrades: []
    },

    characters: {
        roster: [],
        active: [],
        recruited: []
    },

    ships: {
        fleet: [],
        active: [],
        docked: []
    },

    exploration: {
        discoveredSystems: [],
        currentMission: null,
        completedMissions: []
    },

    progress: {
        level: 1,
        experience: 0,
        achievements: []
    },

    settings: {
        sound: true,
        music: true,
        notifications: true,
        language: 'es'
    },

    initialize() {
        this.resources = {
            credits: 1000,
            materials: 500,
            energy: 250
        };
        
        this.production = {
            credits: Constants.BALANCE.RESOURCE_PRODUCTION.credits,
            materials: Constants.BALANCE.RESOURCE_PRODUCTION.materials,
            energy: Constants.BALANCE.RESOURCE_PRODUCTION.energy
        };
        
        this.base = { level: 1, buildings: [], upgrades: [] };
        this.characters = { roster: [], active: [], recruited: [] };
        this.ships = { fleet: [], active: [], docked: [] };
        this.exploration = { discoveredSystems: [], currentMission: null, completedMissions: [] };
        this.progress = { level: 1, experience: 0, achievements: [] };
        
        console.log('[GameState] Estado inicializado');
    },

    serialize() {
        return JSON.parse(JSON.stringify({
            gameInfo: { ...this.gameInfo, lastSave: Date.now() },
            resources: this.resources,
            production: this.production,
            base: this.base,
            characters: this.characters,
            ships: this.ships,
            exploration: this.exploration,
            progress: this.progress,
            settings: this.settings
        }));
    },

    deserialize(data) {
        if (!data) return false;
        if (data.gameInfo.saveVersion !== this.gameInfo.saveVersion) {
            console.warn('[GameState] Versi�n incompatible');
            return false;
        }
        this.gameInfo = data.gameInfo;
        this.resources = data.resources;
        this.production = data.production || this.production;
        this.base = data.base;
        this.characters = data.characters;
        this.ships = data.ships;
        this.exploration = data.exploration;
        this.progress = data.progress;
        this.settings = data.settings || this.settings;
        console.log('[GameState] Estado cargado');
        return true;
    },

    modifyResource(type, amount) {
        if (!this.resources[type]) return false;
        const config = Constants.RESOURCE_CONFIG[type];
        const newValue = Math.max(0, Math.min(this.resources[type] + amount, config.maxCapacity));
        const change = newValue - this.resources[type];
        this.resources[type] = newValue;
        EventBus.emit(Constants.EVENTS.RESOURCES.CHANGE, { type, amount: change, newValue });
        return true;
    },

    canAfford(costs) {
        for (const [type, amount] of Object.entries(costs)) {
            if (this.resources[type] < amount) return false;
        }
        return true;
    },

    payCosts(costs) {
        if (!this.canAfford(costs)) return false;
        for (const [type, amount] of Object.entries(costs)) {
            this.modifyResource(type, -amount);
        }
        return true;
    }
};

window.GameState = GameState;