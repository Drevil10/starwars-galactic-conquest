/**
 * ResourceManager.js
 * Sistema de gesti�n de recursos y producci�n
 */

const ResourceManager = {
    baseProduction: { credits: 0, materials: 0, energy: 0 },
    modifiers: { credits: 1, materials: 1, energy: 1 },
    productionTimer: 0,
    productionInterval: 1,

    initialize() {
        console.log('[ResourceManager] Sistema inicializado');
        EventBus.subscribe(Constants.EVENTS.BASE.BUILD, (data) => this.onBuildingBuilt(data));
        EventBus.subscribe(Constants.EVENTS.BASE.UPGRADE, (data) => this.onBuildingUpgraded(data));
    },

    start() {
        this.baseProduction = {
            credits: Constants.BALANCE.RESOURCE_PRODUCTION.credits,
            materials: Constants.BALANCE.RESOURCE_PRODUCTION.materials,
            energy: Constants.BALANCE.RESOURCE_PRODUCTION.energy
        };
        this.updateProduction();
    },

    update(deltaTime) {
        this.productionTimer += deltaTime;
        if (this.productionTimer >= this.productionInterval) {
            this.produce();
            this.productionTimer = 0;
        }
    },

    produce() {
        const production = {
            credits: this.baseProduction.credits * this.modifiers.credits,
            materials: this.baseProduction.materials * this.modifiers.materials,
            energy: this.baseProduction.energy * this.modifiers.energy
        };
        
        GameState.modifyResource('credits', production.credits);
        GameState.modifyResource('materials', production.materials);
        GameState.modifyResource('energy', production.energy);
        
        EventBus.emit(Constants.EVENTS.UI.UPDATE_RESOURCES, {
            credits: GameState.resources.credits,
            materials: GameState.resources.materials,
            energy: GameState.resources.energy
        });
    },

    updateProduction() {
        this.baseProduction = {
            credits: Constants.BALANCE.RESOURCE_PRODUCTION.credits,
            materials: Constants.BALANCE.RESOURCE_PRODUCTION.materials,
            energy: Constants.BALANCE.RESOURCE_PRODUCTION.energy
        };
        
        GameState.base.buildings.forEach(building => {
            if (building.production) {
                for (const [resource, amount] of Object.entries(building.production)) {
                    if (this.baseProduction[resource] !== undefined) {
                        this.baseProduction[resource] += amount;
                    }
                }
            }
        });
        
        GameState.production = { ...this.baseProduction };
        console.log('[ResourceManager] Producci�n actualizada:', this.baseProduction);
    },

    onBuildingBuilt(data) { this.updateProduction(); },
    onBuildingUpgraded(data) { this.updateProduction(); },
    getResources() { return { ...GameState.resources }; },
    getProduction() { return { ...this.baseProduction }; },
    canAfford(costs) { return GameState.canAfford(costs); },
    pay(costs) { return GameState.payCosts(costs); },

    addResources(amounts) {
        for (const [type, amount] of Object.entries(amounts)) {
            if (amount > 0) GameState.modifyResource(type, amount);
        }
        EventBus.emit(Constants.EVENTS.UI.UPDATE_RESOURCES, {
            credits: GameState.resources.credits,
            materials: GameState.resources.materials,
            energy: GameState.resources.energy
        });
    }
};

window.ResourceManager = ResourceManager;