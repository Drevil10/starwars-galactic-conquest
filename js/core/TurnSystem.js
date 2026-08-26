// js/core/TurnSystem.js
// Sistema de turnos y producción por planeta.

class TurnSystemClass {
    constructor() {
        this.planetData = null;
    }

    init() {
        this.planetData = PlanetData.getPlanets();
    }

    getPlanetProduction(planetId) {
        const planet = this.planetData.find(p => p.id === planetId);

        if (!planet) {
            return {
                credits: 0,
                minerals: 0,
                energy: 0,
                research: 0
            };
        }

        const base = {
            credits: planet.credits || 0,
            minerals: planet.minerals || 0,
            energy: planet.energy || 0,
            research: planet.research || 0
        };

        const buildings = GameState.getState().buildings[planetId] || {};

        const multipliers = {
            credits: 1,
            minerals: 1,
            energy: 1,
            research: 1
        };

        Object.entries(buildings).forEach(([buildingId, count]) => {
            if (count <= 0) return;

            const building = BuildingData.getBuilding(buildingId);
            if (!building || !building.production) return;

            const prod = building.production;

            if (prod.credits) multipliers.credits += prod.credits * count;
            if (prod.minerals) multipliers.minerals += prod.minerals * count;
            if (prod.energy) multipliers.energy += prod.energy * count;
            if (prod.research) multipliers.research += prod.research * count;
        });

        return {
            credits: Math.floor(base.credits * multipliers.credits),
            minerals: Math.floor(base.minerals * multipliers.minerals),
            energy: Math.floor(base.energy * multipliers.energy),
            research: Math.floor(base.research * multipliers.research)
        };
    }

    getTotalProduction() {
        const controlled = GameState.getState().controlledPlanets;

        const total = {
            credits: 0,
            minerals: 0,
            energy: 0,
            research: 0
        };

        controlled.forEach(planetId => {
            const prod = this.getPlanetProduction(planetId);

            total.credits += prod.credits;
            total.minerals += prod.minerals;
            total.energy += prod.energy;
            total.research += prod.research;
        });

        return total;
    }

    nextTurn() {
        const production = this.getTotalProduction();

        GameState.addResources(production);

        const state = GameState.getState();
        const nextTurn = state.turn + 1;

        GameState.setState({ turn: nextTurn });

        this.updateProjects(production);

        console.log(`Turno ${state.turn} → ${nextTurn}. Producción:`, production);

        return {
            turn: nextTurn,
            production
        };
    }

    updateProjects(production) {
        const state = GameState.getState();
        const projects = state.projects || {};

        if (projects.deathStar && projects.deathStar.unlocked && !projects.deathStar.completed) {
            const dsCost = Constants.PROJECTS?.DEATH_STAR?.cost || {};
            const dsResearchPerTurn = Constants.PROJECTS?.DEATH_STAR?.researchPerTurn || 1;

            if (production.research > 0) {
                const progress = Math.min(
                    dsCost.research || 1000,
                    (projects.deathStar.progress || 0) + dsResearchPerTurn
                );

                const completed = progress >= (dsCost.research || 1000);

                GameState.setState({
                    projects: {
                        ...projects,
                        deathStar: {
                            ...projects.deathStar,
                            progress,
                            completed
                        }
                    }
                });

                if (completed) {
                    console.log('Proyecto Death Star completado');
                }
            }
        }
    }

    getTurnInfo() {
        const state = GameState.getState();

        return {
            turn: state.turn,
            controlledPlanets: state.controlledPlanets.length,
            production: this.getTotalProduction()
        };
    }
}

// Exportar instancia global.
window.TurnSystem = new TurnSystemClass();
