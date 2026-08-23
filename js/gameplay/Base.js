// js/gameplay/Base.js
// Sistema de gestión de la base - edificios, construcción, recursos

class BaseClass {
    constructor() {
        this.buildings = [];
        this.selectedBuilding = null;
        this.buildMode = false;
        this.availableBuildings = [
            {
                id: 'command-center',
                name: 'Centro de Comando',
                icon: '🏛️',
                color: '#4a90d9',
                cost: { credits: 100, crystals: 0, energy: 50 },
                size: 2,
                description: 'Centro de operaciones de tu base'
            },
            {
                id: 'power-plant',
                name: 'Planta de Energía',
                icon: '⚡',
                color: '#ffd700',
                cost: { credits: 50, crystals: 10, energy: 0 },
                size: 1,
                description: 'Genera energía para tu base'
            },
            {
                id: 'mine',
                name: 'Mina de Cristales',
                icon: '💎',
                color: '#9b59b6',
                cost: { credits: 75, crystals: 0, energy: 25 },
                size: 1,
                description: 'Extrae cristales del subsuelo'
            },
            {
                id: 'barracks',
                name: 'Cuarteles',
                icon: '🎖️',
                color: '#e74c3c',
                cost: { credits: 150, crystals: 25, energy: 50 },
                size: 2,
                description: 'Entrena personajes'
            },
            {
                id: 'hangar',
                name: 'Hangar',
                icon: '🚀',
                color: '#3498db',
                cost: { credits: 200, crystals: 50, energy: 75 },
                size: 2,
                description: 'Construye y repara naves'
            }
        ];
    }

    init() {
        // Cargar edificios guardados
        const saved = SaveSystem.load('base');
        if (saved && saved.buildings) {
            this.buildings = saved.buildings;
        } else {
            // Edificio inicial
            this.addBuilding('command-center', 2, 2);
        }

        console.log('Base: Inicializada con', this.buildings.length, 'edificios');
        
        // Suscribirse a eventos de input
        EventBus.on('input:canvasClick', (pos) => this.handleCanvasClick(pos.x, pos.y));
        EventBus.on('input:tap', (pos) => this.handleCanvasClick(pos.x, pos.y));
    }

    addBuilding(buildingId, gridX, gridY) {
        const buildingTemplate = this.availableBuildings.find(b => b.id === buildingId);
        if (!buildingTemplate) return false;

        const building = {
            id: buildingId,
            name: buildingTemplate.name,
            icon: buildingTemplate.icon,
            color: buildingTemplate.color,
            x: gridX,
            y: gridY,
            size: buildingTemplate.size,
            level: 1,
            placedAt: Date.now()
        };

        // Verificar si hay colisión
        if (this.checkCollision(building)) {
            console.warn('Base: Colisión detectada');
            return false;
        }

        this.buildings.push(building);
        this.save();
        
        // Notificar cambio
        EventBus.emit('base:buildingAdded', { building });
        
        return true;
    }

    removeBuilding(index) {
        if (index < 0 || index >= this.buildings.length) return false;
        
        const building = this.buildings[index];
        this.buildings.splice(index, 1);
        this.save();
        
        EventBus.emit('base:buildingRemoved', { building });
        return true;
    }

    checkCollision(newBuilding) {
        return this.buildings.some(existing => {
            // Verificar superposición simple (para edificios de 1x1 o 2x2)
            const overlapX = Math.abs(existing.x - newBuilding.x) < (existing.size + newBuilding.size) / 2;
            const overlapY = Math.abs(existing.y - newBuilding.y) < (existing.size + newBuilding.size) / 2;
            return overlapX && overlapY;
        });
    }

    canAfford(buildingId) {
        const building = this.availableBuildings.find(b => b.id === buildingId);
        if (!building) return false;

        const resources = GameState.getResources();
        return resources.credits >= building.cost.credits &&
               resources.crystals >= building.cost.crystals &&
               resources.energy >= building.cost.energy;
    }

    purchaseBuilding(buildingId) {
        const building = this.availableBuildings.find(b => b.id === buildingId);
        if (!building || !this.canAfford(buildingId)) return false;

        // Descontar recursos
        GameState.addResources({
            credits: -building.cost.credits,
            crystals: -building.cost.crystals,
            energy: -building.cost.energy
        });

        this.buildMode = true;
        this.selectedBuilding = building;
        
        EventBus.emit('base:buildModeActivated', { building });
        return true;
    }

    cancelBuildMode() {
        this.buildMode = false;
        this.selectedBuilding = null;
        EventBus.emit('base:buildModeDeactivated');
    }

    update(deltaTime) {
        // Lógica de actualización de edificios
        // Producción de recursos, etc.
    }

    getBuildingAt(gridX, gridY) {
        return this.buildings.find(b => b.x === gridX && b.y === gridY);
    }

    getBuildingsInRadius(centerX, centerY, radius) {
        return this.buildings.filter(b => {
            const dx = b.x - centerX;
            const dy = b.y - centerY;
            return Math.sqrt(dx * dx + dy * dy) <= radius;
        });
    }

    save() {
        SaveSystem.save('base', {
            buildings: this.buildings,
            lastSaved: Date.now()
        });
    }

    // UI: Mostrar panel de construcción
    showBuildPanel() {
        const panel = document.createElement('div');
        panel.className = 'canvas-overlay';
        panel.id = 'build-panel';
        panel.style.position = 'absolute';
        panel.style.bottom = '80px';
        panel.style.left = '50%';
        panel.style.transform = 'translateX(-50%)';
        panel.style.minWidth = '280px';
        panel.style.maxWidth = '90%';

        let html = '<h3 style="margin-bottom: 1rem; color: #ffd700;">Construir</h3>';
        html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">';
        
        this.availableBuildings.forEach(building => {
            const canAfford = this.canAfford(building.id);
            html += `
                <button class="action-btn ${canAfford ? '' : 'cancel'}" 
                        data-building="${building.id}"
                        ${!canAfford ? 'disabled' : ''}
                        style="flex-direction: column; padding: 0.75rem;">
                    <span style="font-size: 1.5rem;">${building.icon}</span>
                    <span style="font-size: 0.75rem; margin-top: 0.25rem;">${building.name}</span>
                    <span style="font-size: 0.65rem; margin-top: 0.25rem; color: #ffd700;">
                        💰${building.cost.credits} 💎${building.cost.crystals} ⚡${building.cost.energy}
                    </span>
                </button>
            `;
        });
        
        html += '</div>';
        html += `<button class="action-btn cancel" id="cancel-build" style="width: 100%; margin-top: 1rem;">Cancelar</button>`;

        panel.innerHTML = html;
        document.getElementById('game-area').appendChild(panel);

        // Event listeners
        panel.querySelectorAll('[data-building]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const buildingId = e.currentTarget.dataset.building;
                this.purchaseBuilding(buildingId);
                panel.remove();
            });
        });

        panel.querySelector('#cancel-build').addEventListener('click', () => {
            this.cancelBuildMode();
            panel.remove();
        });
    }

    // Manejar click en el canvas para construcción
    handleCanvasClick(screenX, screenY) {
        if (!this.buildMode || !this.selectedBuilding) return;

        const gridPos = Renderer.screenToGrid(screenX, screenY);
        
        // Verificar límites de la cuadrícula
        if (gridPos.x < 0 || gridPos.x >= Constants.GRID_SIZE ||
            gridPos.y < 0 || gridPos.y >= Constants.GRID_SIZE) {
            return;
        }
        
        if (this.addBuilding(this.selectedBuilding.id, gridPos.x, gridPos.y)) {
            this.buildMode = false;
            this.selectedBuilding = null;
            EventBus.emit('base:buildingPlaced', { x: gridPos.x, y: gridPos.y });
        }
    }
}

// Exportar instancia global
window.Base = new BaseClass();
