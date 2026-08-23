// js/gameplay/Ships.js
// Sistema de naves - flota espacial

class ShipsClass {
    constructor() {
        this.ships = [];
        this.maxShips = 15;
    }

    init() {
        // Cargar naves guardadas
        const saved = SaveSystem.load('ships');
        if (saved && saved.ships) {
            this.ships = saved.ships;
        }

        console.log('Ships: Inicializadas', this.ships.length, 'naves');
    }

    addShip(shipData) {
        if (this.ships.length >= this.maxShips) {
            console.warn('Ships: Máximo de naves alcanzado');
            return false;
        }

        const ship = {
            id: 'ship_' + Date.now(),
            name: shipData.name || 'Nave',
            icon: shipData.icon || '🚀',
            color: shipData.color || '#d9534f',
            type: shipData.type || 'fighter',
            x: shipData.x || 0,
            y: shipData.y || 0,
            level: shipData.level || 1,
            health: shipData.health || 100,
            maxHealth: shipData.maxHealth || 100,
            addedAt: Date.now()
        };

        this.ships.push(ship);
        this.save();
        
        EventBus.emit('ships:added', { ship });
        return true;
    }

    removeShip(id) {
        const index = this.ships.findIndex(s => s.id === id);
        if (index === -1) return false;
        
        const ship = this.ships[index];
        this.ships.splice(index, 1);
        this.save();
        
        EventBus.emit('ships:removed', { ship });
        return true;
    }

    getShip(id) {
        return this.ships.find(s => s.id === id);
    }

    update(deltaTime) {
        // Lógica de actualización de naves
    }

    save() {
        SaveSystem.save('ships', {
            ships: this.ships,
            lastSaved: Date.now()
        });
    }

    // Utilidad: generar nave aleatoria
    generateRandomShip() {
        const names = ['X-Wing', 'TIE Fighter', 'Falcon', 'Star Destroyer', 'Interceptor'];
        const types = ['fighter', 'bomber', 'frigate', 'cruiser', 'carrier'];

        return {
            name: names[Math.floor(Math.random() * names.length)],
            type: types[Math.floor(Math.random() * types.length)],
            level: Math.floor(Math.random() * 5) + 1
        };
    }
}

// Exportar instancia global
window.Ships = new ShipsClass();
