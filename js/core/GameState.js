// js/core/GameState.js
// Estado centralizado del juego.

class GameStateClass {
    constructor() {
        const INITIAL = {
            credits: 100,
            minerals: 50,
            energy: 100,
            research: 10
        };

        const C = typeof Constants !== 'undefined' ? Constants : {};
        const IR = C.INITIAL_RESOURCES || {};
        const RL = C.RESOURCE_LIMITS || {};

        this.state = {
            credits: IR.credits ?? INITIAL.credits,
            minerals: IR.minerals ?? INITIAL.minerals,
            energy: IR.energy ?? INITIAL.energy,
            research: IR.research ?? INITIAL.research,

            turn: 1,
            selectedFaction: null,
            controlledPlanets: [],
            fleets: [],
            buildings: {},
            researchedTech: [],
            activeEvents: [],

            projects: {
                deathStar: {
                    unlocked: false,
                    progress: 0,
                    completed: false
                }
            },

            screen: (C.SCREENS?.START) ?? 'START',
            gameState: (C.STATES?.MENU) ?? 'MENU',
            startTime: Date.now(),
            lastSaveTime: Date.now()
        };

        this.limits = {
            credits: RL.credits ?? Number.MAX_SAFE_INTEGER,
            minerals: RL.minerals ?? Number.MAX_SAFE_INTEGER,
            energy: RL.energy ?? Number.MAX_SAFE_INTEGER,
            research: RL.research ?? Number.MAX_SAFE_INTEGER
        };

        this.listeners = new Map();
    }

    createInitialState() {
        const C = typeof Constants !== 'undefined' ? Constants : {};
        const IR = C.INITIAL_RESOURCES || {};

        const INITIAL = {
            credits: 100,
            minerals: 50,
            energy: 100,
            research: 10
        };

        return {
            credits: IR.credits ?? INITIAL.credits,
            minerals: IR.minerals ?? INITIAL.minerals,
            energy: IR.energy ?? INITIAL.energy,
            research: IR.research ?? INITIAL.research,

            turn: 1,
            selectedFaction: null,
            controlledPlanets: [],
            fleets: [],
            buildings: {},
            researchedTech: [],
            activeEvents: [],

            projects: {
                deathStar: {
                    unlocked: false,
                    progress: 0,
                    completed: false
                }
            },

            screen: (C.SCREENS?.START) ?? 'START',
            gameState: (C.STATES?.MENU) ?? 'MENU',
            startTime: Date.now(),
            lastSaveTime: Date.now()
        };
    }

    init() {
        const saved = (typeof SaveSystem !== 'undefined' && typeof SaveSystem.load === 'function')
            ? SaveSystem.load('gameState')
            : null;

        if (saved) {
            this.state = {
                ...this.createInitialState(),
                ...saved,
                projects: {
                    ...this.createInitialState().projects,
                    ...(saved.projects || {})
                }
            };

            console.log('GameState: Estado cargado', this.state);
        }

        this.updateResourceUI();

        if (typeof Constants !== 'undefined' && Constants.GAME?.AUTO_SAVE) {
            setInterval(() => this.autoSave(), Constants.GAME.SAVE_INTERVAL);
        }
    }

    getState() {
        return {
            ...this.state,
            controlledPlanets: [...this.state.controlledPlanets],
            fleets: [...this.state.fleets],
            buildings: { ...this.state.buildings },
            researchedTech: [...this.state.researchedTech],
            activeEvents: [...this.state.activeEvents],
            projects: { ...this.state.projects }
        };
    }

    setState(newState) {
        const oldState = this.getState();

        this.state = {
            ...this.state,
            ...newState
        };

        Object.keys(newState).forEach(key => {
            this.emit(`change:${key}`, {
                key,
                oldValue: oldState[key],
                newValue: this.state[key]
            });
        });

        this.emit('change', {
            oldState,
            newState: this.getState()
        });
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event).push(callback);

        return () => this.unsubscribe(event, callback);
    }

    unsubscribe(event, callback) {
        if (!this.listeners.has(event)) return;

        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);

        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (!this.listeners.has(event)) return;

        this.listeners.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('GameState: Error en listener', event, error);
            }
        });
    }

    getResources() {
        return {
            credits: this.state.credits,
            minerals: this.state.minerals,
            energy: this.state.energy,
            research: this.state.research
        };
    }

    addResources(changes) {
        const nextState = {};

        ['credits', 'minerals', 'energy', 'research'].forEach(resource => {
            if (changes[resource] === undefined) return;

            const limit = this.limits[resource] ?? Number.MAX_SAFE_INTEGER;
            const current = this.state[resource] ?? 0;

            nextState[resource] = Math.max(
                0,
                Math.min(limit, current + changes[resource])
            );
        });

        this.setState(nextState);
        this.updateResourceUI();
    }

    setResource(resource, value) {
        const allowedResources = ['credits', 'minerals', 'energy', 'research'];

        if (!allowedResources.includes(resource)) {
            console.warn('GameState: Recurso inválido', resource);
            return;
        }

        const limit = this.limits[resource] ?? Number.MAX_SAFE_INTEGER;
        const cappedValue = Math.max(0, Math.min(limit, value));

        this.setState({ [resource]: cappedValue });
        this.updateResourceUI();
    }

    canAfford(cost = {}) {
        return this.state.credits >= (cost.credits || 0) &&
            this.state.minerals >= (cost.minerals || 0) &&
            this.state.energy >= (cost.energy || 0) &&
            this.state.research >= (cost.research || 0);
    }

    spendResources(cost = {}) {
        if (!this.canAfford(cost)) {
            return false;
        }

        this.addResources({
            credits: -(cost.credits || 0),
            minerals: -(cost.minerals || 0),
            energy: -(cost.energy || 0),
            research: -(cost.research || 0)
        });

        return true;
    }

    getCurrentScreen() {
        return this.state.screen;
    }

    setScreen(screen) {
        const C = typeof Constants !== 'undefined' ? Constants : {};
        const SCREENS = C.SCREENS || {};

        if (!SCREENS[screen.toUpperCase()]) {
            console.warn('GameState: Pantalla inválida', screen);
            return;
        }

        this.setState({ screen });
    }

    getGameState() {
        return this.state.gameState;
    }

    setGameState(gameState) {
        const C = typeof Constants !== 'undefined' ? Constants : {};
        const STATES = C.STATES || {};

        if (!STATES[gameState.toUpperCase()]) {
            console.warn('GameState: Estado inválido', gameState);
            return;
        }

        this.setState({ gameState });
    }

    setFaction(faction) {
        this.setState({ selectedFaction: faction });
    }

    setControlledPlanets(planets) {
        this.setState({ controlledPlanets: [...new Set(planets)] });
    }

    addControlledPlanet(planetId) {
        if (this.state.controlledPlanets.includes(planetId)) return;

        this.setState({
            controlledPlanets: [...this.state.controlledPlanets, planetId]
        });
    }

    removeControlledPlanet(planetId) {
        this.setState({
            controlledPlanets: this.state.controlledPlanets.filter(
                id => id !== planetId
            )
        });
    }

    updateResourceUI() {
        const creditsEl = document.getElementById('credits-res');
        const mineralsEl = document.getElementById('minerals-res');
        const energyEl = document.getElementById('energy-res');
        const researchEl = document.getElementById('research-res');

        if (creditsEl) creditsEl.textContent = Math.floor(this.state.credits);
        if (mineralsEl) mineralsEl.textContent = Math.floor(this.state.minerals);
        if (energyEl) energyEl.textContent = Math.floor(this.state.energy);
        if (researchEl) researchEl.textContent = Math.floor(this.state.research);
    }

    autoSave() {
        if (typeof SaveSystem === 'undefined' || typeof SaveSystem.save !== 'function') {
            return;
        }

        this.state.lastSaveTime = Date.now();
        SaveSystem.save('gameState', this.state);
        console.log('GameState: Auto-guardado completado');
    }

    save() {
        if (typeof SaveSystem === 'undefined' || typeof SaveSystem.save !== 'function') {
            return;
        }

        this.state.lastSaveTime = Date.now();
        SaveSystem.save('gameState', this.state);
        console.log('GameState: Guardado manual completado');
    }

    reset() {
        this.state = this.createInitialState();

        if (typeof SaveSystem !== 'undefined' && typeof SaveSystem.clear === 'function') {
            SaveSystem.clear('gameState');
        }

        this.updateResourceUI();
        this.emit('reset', this.getState());
        console.log('GameState: Reset completado');
    }
}

// Exportar instancia global.
window.GameState = new GameStateClass();
