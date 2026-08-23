/**
 * Ships.js
 * Sistema de naves - Todas las naves de Star Wars
 */

const Ships = {
    catalog: [],
    fleet: [],

    initialize() {
        console.log('[Ships] Sistema inicializado');
        this.initializeCatalog();
    },

    initializeCatalog() {
        // REP�BLICA
        this.addShip({
            id: 'venator', name: 'Venator-class Star Destroyer', faction: Constants.FACTIONS.REPUBLIC,
            type: 'capital', class: 'Star Destroyer',
            stats: { attack: 85, defense: 80, speed: 70, capacity: 100 },
            buildCost: { credits: 5000, materials: 3000, energy: 1500 }, buildTime: 300
        });
        this.addShip({
            id: 'acclamator', name: 'Acclamator-class Assault Ship', faction: Constants.FACTIONS.REPUBLIC,
            type: 'capital', class: 'Assault Ship',
            stats: { attack: 75, defense: 75, speed: 65, capacity: 80 },
            buildCost: { credits: 4000, materials: 2500, energy: 1200 }, buildTime: 240
        });
        this.addShip({
            id: 'jedi_interceptor', name: 'Jedi Starfighter', faction: Constants.FACTIONS.REPUBLIC,
            type: 'fighter', class: 'Interceptor',
            stats: { attack: 70, defense: 60, speed: 95, capacity: 1 },
            buildCost: { credits: 1500, materials: 800, energy: 400 }, buildTime: 120
        });

        // SEPARATISTAS
        this.addShip({
            id: 'lucrehulk', name: 'Lucrehulk-class Battleship', faction: Constants.FACTIONS.SEPARATISTS,
            type: 'capital', class: 'Battleship',
            stats: { attack: 90, defense: 85, speed: 50, capacity: 150 },
            buildCost: { credits: 6000, materials: 4000, energy: 2000 }, buildTime: 360
        });
        this.addShip({
            id: 'providence', name: 'Providence-class Dreadnought', faction: Constants.FACTIONS.SEPARATISTS,
            type: 'capital', class: 'Dreadnought',
            stats: { attack: 88, defense: 78, speed: 60, capacity: 120 },
            buildCost: { credits: 5500, materials: 3500, energy: 1800 }, buildTime: 330
        });
        this.addShip({
            id: 'vulture', name: 'Vulture Droid', faction: Constants.FACTIONS.SEPARATISTS,
            type: 'fighter', class: 'Starfighter',
            stats: { attack: 65, defense: 55, speed: 90, capacity: 1 },
            buildCost: { credits: 1000, materials: 600, energy: 300 }, buildTime: 90
        });

        // IMPERIO
        this.addShip({
            id: 'executor', name: 'Executor-class Star Dreadnought', faction: Constants.FACTIONS.EMPIRE,
            type: 'capital', class: 'Super Star Destroyer',
            stats: { attack: 100, defense: 95, speed: 55, capacity: 200 },
            buildCost: { credits: 15000, materials: 10000, energy: 5000 }, buildTime: 600
        });
        this.addShip({
            id: 'imperial_star_destroyer', name: 'Imperial I-class Star Destroyer', faction: Constants.FACTIONS.EMPIRE,
            type: 'capital', class: 'Star Destroyer',
            stats: { attack: 88, defense: 85, speed: 65, capacity: 100 },
            buildCost: { credits: 7000, materials: 4500, energy: 2200 }, buildTime: 420
        });
        this.addShip({
            id: 'tie_fighter', name: 'TIE/ln Fighter', faction: Constants.FACTIONS.EMPIRE,
            type: 'fighter', class: 'Starfighter',
            stats: { attack: 65, defense: 50, speed: 92, capacity: 1 },
            buildCost: { credits: 1200, materials: 700, energy: 350 }, buildTime: 100
        });
        this.addShip({
            id: 'tie_interceptor', name: 'TIE/IN Interceptor', faction: Constants.FACTIONS.EMPIRE,
            type: 'fighter', class: 'Interceptor',
            stats: { attack: 72, defense: 55, speed: 96, capacity: 1 },
            buildCost: { credits: 1800, materials: 1000, energy: 500 }, buildTime: 130
        });

        // REBELI�N
        this.addShip({
            id: 'falcon', name: 'Millennium Falcon', faction: Constants.FACTIONS.REBELLION,
            type: 'special', class: 'Light Freighter',
            stats: { attack: 80, defense: 75, speed: 90, capacity: 10 },
            buildCost: { credits: 8000, materials: 5000, energy: 2500 }, buildTime: 480, unique: true
        });
        this.addShip({
            id: 'mon_calamari', name: 'MC80 Star Cruiser', faction: Constants.FACTIONS.REBELLION,
            type: 'capital', class: 'Star Cruiser',
            stats: { attack: 82, defense: 80, speed: 68, capacity: 90 },
            buildCost: { credits: 6500, materials: 4000, energy: 2000 }, buildTime: 390
        });
        this.addShip({
            id: 'xwing', name: 'X-Wing Starfighter', faction: Constants.FACTIONS.REBELLION,
            type: 'fighter', class: 'Starfighter',
            stats: { attack: 75, defense: 65, speed: 88, capacity: 1 },
            buildCost: { credits: 2000, materials: 1200, energy: 600 }, buildTime: 150
        });
        this.addShip({
            id: 'ywing', name: 'Y-Wing Bomber', faction: Constants.FACTIONS.REBELLION,
            type: 'fighter', class: 'Bomber',
            stats: { attack: 80, defense: 60, speed: 70, capacity: 2 },
            buildCost: { credits: 2200, materials: 1400, energy: 700 }, buildTime: 160
        });
        this.addShip({
            id: 'awing', name: 'A-Wing Starfighter', faction: Constants.FACTIONS.REBELLION,
            type: 'fighter', class: 'Interceptor',
            stats: { attack: 70, defense: 55, speed: 98, capacity: 1 },
            buildCost: { credits: 1800, materials: 1000, energy: 500 }, buildTime: 130
        });

        // PRIMERA ORDEN
        this.addShip({
            id: 'finalizer', name: 'Finalizer', faction: Constants.FACTIONS.FIRST_ORDER,
            type: 'capital', class: 'Resurgent Star Destroyer',
            stats: { attack: 92, defense: 88, speed: 62, capacity: 110 },
            buildCost: { credits: 8000, materials: 5000, energy: 2500 }, buildTime: 480
        });
        this.addShip({
            id: 'starkiller', name: 'Starkiller Base', faction: Constants.FACTIONS.FIRST_ORDER,
            type: 'superweapon', class: 'Superweapon',
            stats: { attack: 100, defense: 90, speed: 30, capacity: 500 },
            buildCost: { credits: 50000, materials: 30000, energy: 15000 }, buildTime: 1800, unique: true
        });
        this.addShip({
            id: 'tie_fo', name: 'TIE/fo Fighter', faction: Constants.FACTIONS.FIRST_ORDER,
            type: 'fighter', class: 'Starfighter',
            stats: { attack: 70, defense: 58, speed: 90, capacity: 1 },
            buildCost: { credits: 1500, materials: 900, energy: 450 }, buildTime: 110
        });

        // RESISTENCIA
        this.addShip({
            id: 'raddus', name: 'Raddus', faction: Constants.FACTIONS.RESISTANCE,
            type: 'capital', class: 'MC85 Star Cruiser',
            stats: { attack: 85, defense: 82, speed: 70, capacity: 95 },
            buildCost: { credits: 7000, materials: 4500, energy: 2200 }, buildTime: 420
        });
        this.addShip({
            id: 'black_one', name: 'T-70 X-Wing (Black One)', faction: Constants.FACTIONS.RESISTANCE,
            type: 'fighter', class: 'Starfighter',
            stats: { attack: 78, defense: 68, speed: 90, capacity: 1 },
            buildCost: { credits: 2500, materials: 1500, energy: 750 }, buildTime: 170, unique: true
        });

        console.log(`[Ships] Cat�logo inicializado con ${this.catalog.length} naves`);
    },

    addShip(ship) {
        this.catalog.push({ ...ship, owned: 0, level: 1 });
    },

    getShip(id) { return this.catalog.find(s => s.id === id) || null; },
    getByFaction(faction) { return this.catalog.filter(s => s.faction === faction); },
    getByType(type) { return this.catalog.filter(s => s.type === type); },

    build(id) {
        const ship = this.getShip(id);
        if (!ship) return false;
        if (ship.unique && ship.owned > 0) {
            console.warn('[Ships] Nave �nica ya pose�da');
            return false;
        }
        if (!GameState.canAfford(ship.buildCost)) {
            console.warn('[Ships] Recursos insuficientes');
            return false;
        }
        GameState.payCosts(ship.buildCost);
        ship.owned++;
        GameState.ships.fleet.push({
            id: ship.id, name: ship.name, level: 1, status: 'docked'
        });
        console.log(`[Ships] ${ship.name} construida`);
        EventBus.emit(Constants.EVENTS.SHIPS.BUILD, { ship });
        return true;
    },

    render(ctx, width, height) {
        const fleetCount = GameState.ships.fleet.length;
        Renderer.drawText(ctx, {
            text: `Flota: ${fleetCount} naves`,
            x: width / 2, y: 50, color: '#FFE81F', size: 24
        });
    }
};

window.Ships = Ships;