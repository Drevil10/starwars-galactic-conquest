// js/core/GameState.js
// Estado centralizado de una partida.

class GameStateClass {
    constructor() {
        this.listeners = new Map();
        this.state = this.createInitialState();
    }

    createInitialState() {
        const initialResources =
            typeof Constants !== 'undefined' && Constants.INITIAL_RESOURCES
                ? Constants.INITIAL_RESOURCES
                : {};

        return {
            credits: initialResources.credits ?? 100,
            minerals: initialResources.minerals ?? 50,
            energy: initialResources.energy ?? 100,
            research: initialResources.research ?? 10,

            turn: 1,
            selectedFaction: null,
            controlledPlanets: [],
            fleets: [],
            buildings: {},
            researchedTech: [],
            activeEvents: [],

            screen: 'start',
            gameState: 'menu',
            startTime: Date.now(),
            lastSaveTime: Date.now()
        };
    }

    init() {
        this.updateResourceUI();
        this.updateTurnUI();
    }

    getState() {
        return {
            ...this.state,
            controlledPlanets: [...this.state.controlledPlanets],
            fleets: [...this.state.fleets],
            buildings: { ...this.state.buildings },
            researchedTech: [...this.state.researchedTech],
            activeEvents: [...this.state.activeEvents]
        };
    }

    setState(changes = {}) {
        const oldState = this.getState();

        this.state = {
            ...this.state,
            ...changes
        };

        Object.keys(changes).forEach(key => {
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

        this.updateResourceUI();
        this.updateTurnUI();
    }

    subscribe(event, callback) {
        if (typeof callback !== 'function') {
            console.warn('GameState: El listener debe ser una función.');
            return () => {};
        }

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event).push(callback);

        return () => this.unsubscribe(event, callback);
    }

    unsubscribe(event, callback) {
        const callbacks = this.listeners.get(event);

        if (!callbacks) return;

        const index = callbacks.indexOf(callback);

        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        const callbacks = this.listeners.get(event);

        if (!callbacks) return;

        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`GameState: Error en listener "${event}".`, error);
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

    getResourceLimit(resource) {
        const limits =
            typeof Constants !== 'undefined' && Constants.RESOURCE_LIMITS
                ? Constants.RESOURCE_LIMITS
                : {};

        return limits[resource] ?? Number.MAX_SAFE_INTEGER;
    }

    addResources(changes = {}) {
        const nextResources = {};

        ['credits', 'minerals', 'energy', 'research'].forEach(resource => {
            if (changes[resource] === undefined) return;

            const currentValue = this.state[resource] ?? 0;
            const limit = this.getResourceLimit(resource);

            nextResources[resource] = Math.max(
                0,
                Math.min(limit, currentValue + Number(changes[resource] || 0))
            );
        });

        if (Object.keys(nextResources).length > 0) {
            this.setState(nextResources);
        }

        return this.getResources();
    }

    setResource(resource, value) {
        const allowedResources = ['credits', 'minerals', 'energy', 'research'];

        if (!allowedResources.includes(resource)) {
            console.warn('GameState: Recurso inválido.', resource);
            return false;
        }

        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
            console.warn('GameState: Valor de recurso inválido.', value);
            return false;
        }

        const cappedValue = Math.max(
            0,
            Math.min(this.getResourceLimit(resource), numericValue)
        );

        this.setState({ [resource]: cappedValue });

        return true;
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

    setFaction(factionId) {
        this.setState({
            selectedFaction: factionId || null
        });
    }

    setControlledPlanets(planets = []) {
        const uniquePlanets = [...new Set(planets.filter(Boolean))];

        this.setState({
            controlledPlanets: uniquePlanets
        });
    }

    addControlledPlanet(planetId) {
        if (!planetId || this.state.controlledPlanets.includes(planetId)) {
            return false;
        }

        this.setState({
            controlledPlanets: [
                ...this.state.controlledPlanets,
                planetId
            ]
        });

        return true;
    }

    removeControlledPlanet(planetId) {
        if (!this.state.controlledPlanets.includes(planetId)) {
            return false;
        }

        this.setState({
            controlledPlanets: this.state.controlledPlanets.filter(
                id => id !== planetId
            )
        });

        return true;
    }

    setScreen(screen) {
        this.setState({ screen });
    }

    setGameState(gameState) {
        this.setState({ gameState });
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

    updateTurnUI() {
        const turnEl = document.getElementById('turn-info');

        if (turnEl) {
            turnEl.textContent = `Turno ${this.state.turn}`;
        }
    }

    reset() {
        this.state = this.createInitialState();
        this.updateResourceUI();
        this.updateTurnUI();
        this.emit('reset', this.getState());

        console.log('GameState: Partida reiniciada.');
    }
}

window.GameState = new GameStateClass();
