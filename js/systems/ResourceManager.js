// js/systems/ResourceManager.js
// Sistema de gestión de recursos - producción automática

class ResourceManagerClass {
    constructor() {
        this.productionTimers = new Map();
        this.lastProductionTime = Date.now();
    }

    init() {
        // Iniciar producción automática
        this.startProduction();
        console.log('ResourceManager: Producción iniciada');
    }

    startProduction() {
        // Producción continua basada en tiempo
        setInterval(() => {
            this.produceResources();
        }, 1000); // Cada segundo
    }

    produceResources() {
        const now = Date.now();
        const deltaTime = (now - this.lastProductionTime) / 1000;
        
        // Calcular producción basada en edificios
        let creditsProd = Constants.PRODUCTION_RATES.credits;
        let crystalsProd = Constants.PRODUCTION_RATES.crystals;
        let energyProd = Constants.PRODUCTION_RATES.energy;

        // Bonificación por edificios (ejemplo)
        if (typeof Base !== 'undefined' && Base.buildings) {
            Base.buildings.forEach(building => {
                if (building.id === 'power-plant') {
                    energyProd += 1;
                } else if (building.id === 'mine') {
                    crystalsProd += 0.5;
                }
            });
        }

        // Añadir recursos
        GameState.addResources({
            credits: creditsProd * deltaTime,
            crystals: crystalsProd * deltaTime,
            energy: energyProd * deltaTime
        });

        this.lastProductionTime = now;
    }

    getProductionRate() {
        let creditsProd = Constants.PRODUCTION_RATES.credits;
        let crystalsProd = Constants.PRODUCTION_RATES.crystals;
        let energyProd = Constants.PRODUCTION_RATES.energy;

        if (typeof Base !== 'undefined' && Base.buildings) {
            Base.buildings.forEach(building => {
                if (building.id === 'power-plant') {
                    energyProd += 1;
                } else if (building.id === 'mine') {
                    crystalsProd += 0.5;
                }
            });
        }

        return {
            credits: creditsProd,
            crystals: crystalsProd,
            energy: energyProd
        };
    }
}

// Exportar instancia global
window.ResourceManager = new ResourceManagerClass();
