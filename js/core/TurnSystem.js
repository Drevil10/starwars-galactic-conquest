// js/core/TurnSystem.js
// Avance de turnos y producción basada en el mapa actual.

class TurnSystemClass {
    constructor() {
        this.initialized = false;
    }

    init() {
        this.initialized = true;
        console.log('TurnSystem: Inicializado.');
    }

    getEmptyProduction() {
        return {
            credits: 0,
            minerals: 0,
            energy: 0,
            research: 0
        };
    }

    getPlanets() {
        if (
            typeof galaxyMap === 'undefined' ||
            !Array.isArray(galaxyMap.systems)
        ) {
            return [];
        }

        return galaxyMap.systems.flatMap(system => {
            return Array.isArray(system.planets) ? system.planets : [];
        });
    }

    getPlanetById(planetId) {
        return this.getPlanets().find(planet => planet.id === planetId) || null;
    }

    getPlanetProduction(planetId) {
        const planet = this.getPlanetById(planetId);

        if (!planet) {
            return this.getEmptyProduction();
        }

        const resources = planet.resources || planet.production || {};

        return {
            credits: Math.max(0, Number(resources.credits || 0)),
            minerals: Math.max(0, Number(resources.minerals || 0)),
            energy: Math.max(0, Number(resources.energy || 0)),
            research: Math.max(0, Number(resources.research || 0))
        };
    }

    getTotalProduction() {
        if (typeof GameState === 'undefined') {
            return this.getEmptyProduction();
        }

        const total = this.getEmptyProduction();
        const controlledPlanets = GameState.getState().controlledPlanets;

        controlledPlanets.forEach(planetId => {
            const production = this.getPlanetProduction(planetId);

            total.credits += production.credits;
            total.minerals += production.minerals;
            total.energy += production.energy;
            total.research += production.research;
        });

        return total;
    }

    nextTurn() {
        if (typeof GameState === 'undefined') {
            console.error('TurnSystem: GameState no está disponible.');
            return null;
        }

        if (!this.initialized) {
            this.init();
        }

        const production = this.getTotalProduction();
        const currentState = GameState.getState();
        const nextTurn = currentState.turn + 1;

        GameState.addResources(production);
        GameState.setState({
            turn: nextTurn,
            lastSaveTime: Date.now()
        });

        console.log(
            `TurnSystem: Turno ${currentState.turn} → ${nextTurn}.`,
            production
        );

        return {
            turn: nextTurn,
            production,
            controlledPlanets: currentState.controlledPlanets.length
        };
    }

    getTurnInfo() {
        if (typeof GameState === 'undefined') {
            return {
                turn: 1,
                controlledPlanets: 0,
                production: this.getEmptyProduction()
            };
        }

        const state = GameState.getState();

        return {
            turn: state.turn,
            controlledPlanets: state.controlledPlanets.length,
            production: this.getTotalProduction()
        };
    }
}

window.TurnSystem = new TurnSystemClass();
