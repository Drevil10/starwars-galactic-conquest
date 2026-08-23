/**
 * Base.js
 * Sistema de gesti�n y construcci�n de la base
 */

const Base = {
    buildings: [],
    constructed: [],
    grid: { rows: 5, cols: 6, cellSize: 100 },

    initialize() {
        console.log('[Base] Sistema inicializado');
        this.initializeBuildings();
    },

    initializeBuildings() {
        this.addBuilding({
            id: 'command_center', name: 'Centro de Comando', type: 'core',
            description: 'El coraz�n de tu base. Aumenta la producci�n de todos los recursos.',
            stats: { production: { credits: 5, materials: 2, energy: 1 } },
            buildCost: { credits: 500, materials: 300, energy: 150 },
            buildTime: 60, size: { width: 2, height: 2 }
        });
        this.addBuilding({
            id: 'material_mine', name: 'Mina de Materiales', type: 'production',
            description: 'Extrae materiales de asteroides cercanos.',
            stats: { production: { materials: 10 } },
            buildCost: { credits: 200, materials: 100, energy: 50 },
            buildTime: 30, size: { width: 1, height: 1 }
        });
        this.addBuilding({
            id: 'power_plant', name: 'Planta de Energ�a', type: 'production',
            description: 'Genera energ�a para tu base.',
            stats: { production: { energy: 8 } },
            buildCost: { credits: 250, materials: 150, energy: 0 },
            buildTime: 35, size: { width: 1, height: 1 }
        });
        this.addBuilding({
            id: 'credit_exchange', name: 'Banco de Cr�ditos', type: 'production',
            description: 'Genera cr�ditos mediante comercio.',
            stats: { production: { credits: 15 } },
            buildCost: { credits: 300, materials: 200, energy: 100 },
            buildTime: 40, size: { width: 1, height: 1 }
        });
        this.addBuilding({
            id: 'hangar', name: 'Hangar', type: 'military',
            description: 'Permite construir y mantener naves.',
            stats: { shipCapacity: 5, buildSpeed: 1.1 },
            buildCost: { credits: 400, materials: 300, energy: 150 },
            buildTime: 50, size: { width: 2, height: 1 }
        });
        this.addBuilding({
            id: 'barracks', name: 'Barracas', type: 'military',
            description: 'Entrena y aloja personajes.',
            stats: { characterCapacity: 3, trainingSpeed: 1.1 },
            buildCost: { credits: 350, materials: 250, energy: 120 },
            buildTime: 45, size: { width: 1, height: 1 }
        });
        this.addBuilding({
            id: 'research_lab', name: 'Laboratorio', type: 'research',
            description: 'Investiga nuevas tecnolog�as y mejoras.',
            stats: { researchSpeed: 1.2 },
            buildCost: { credits: 500, materials: 350, energy: 200 },
            buildTime: 60, size: { width: 2, height: 1 }
        });
        this.addBuilding({
            id: 'defense_wall', name: 'Muro Defensivo', type: 'defense',
            description: 'Protege tu base de ataques.',
            stats: { defense: 50 },
            buildCost: { credits: 150, materials: 200, energy: 50 },
            buildTime: 25, size: { width: 1, height: 1 }
        });
        this.addBuilding({
            id: 'defense_tower', name: 'Torre de Defensa', type: 'defense',
            description: 'Dispara autom�ticamente a enemigos cercanos.',
            stats: { defense: 100, attack: 30 },
            buildCost: { credits: 300, materials: 250, energy: 100 },
            buildTime: 40, size: { width: 1, height: 1 }
        });
        this.addBuilding({
            id: 'storage', name: 'Almac�n', type: 'storage',
            description: 'Aumenta la capacidad m�xima de recursos.',
            stats: { storageBonus: { credits: 2000, materials: 1000, energy: 500 } },
            buildCost: { credits: 200, materials: 150, energy: 75 },
            buildTime: 30, size: { width: 1, height: 1 }
        });

        console.log(`[Base] ${this.buildings.length} edificios disponibles`);
    },

    addBuilding(building) { this.buildings.push(building); },
    getBuilding(id) { return this.buildings.find(b => b.id === id) || null; },

    build(id, gridX, gridY) {
        const building = this.getBuilding(id);
        if (!building) {
            console.warn('[Base] Edificio no encontrado');
            return false;
        }
        if (!GameState.canAfford(building.buildCost)) {
            console.warn('[Base] Recursos insuficientes');
            return false;
        }
        if (!this.canPlaceAt(building, gridX, gridY)) {
            console.warn('[Base] Posici�n inv�lida');
            return false;
        }
        GameState.payCosts(building.buildCost);
        const constructedBuilding = {
            ...building, instanceId: Date.now(),
            gridX, gridY, level: 1, completed: true
        };
        this.constructed.push(constructedBuilding);
        GameState.base.buildings.push(constructedBuilding);
        console.log(`[Base] ${building.name} construido en (${gridX}, ${gridY})`);
        EventBus.emit(Constants.EVENTS.BASE.BUILD, { building: constructedBuilding, gridX, gridY });
        return true;
    },

    canPlaceAt(building, gridX, gridY) {
        const size = building.size || { width: 1, height: 1 };
        if (gridX < 0 || gridY < 0 ||
            gridX + size.width > this.grid.cols ||
            gridY + size.height > this.grid.rows) {
            return false;
        }
        for (const existing of this.constructed) {
            const existingSize = existing.size || { width: 1, height: 1 };
            if (gridX < existing.gridX + existingSize.width &&
                gridX + size.width > existing.gridX &&
                gridY < existing.gridY + existingSize.height &&
                gridY + size.height > existing.gridY) {
                return false;
            }
        }
        return true;
    },

    upgrade(instanceId) {
        const building = this.constructed.find(b => b.instanceId === instanceId);
        if (!building) return false;
        const upgradeCost = {
            credits: Math.floor(building.buildCost.credits * 1.5),
            materials: Math.floor(building.buildCost.materials * 1.5),
            energy: Math.floor(building.buildCost.energy * 1.5)
        };
        if (!GameState.canAfford(upgradeCost)) {
            console.warn('[Base] Recursos insuficientes para mejorar');
            return false;
        }
        GameState.payCosts(upgradeCost);
        building.level++;
        if (building.stats.production) {
            for (const resource of Object.keys(building.stats.production)) {
                building.stats.production[resource] *= 1.1;
            }
        }
        console.log(`[Base] ${building.name} mejorado a nivel ${building.level}`);
        EventBus.emit(Constants.EVENTS.BASE.UPGRADE, { building });
        return true;
    },

    render(ctx, width, height) {
        const totalWidth = this.grid.cols * this.grid.cellSize;
        const totalHeight = this.grid.rows * this.grid.cellSize;
        const offsetX = (width - totalWidth) / 2;
        const offsetY = (height - totalHeight) / 2;
        this.drawGrid(ctx, offsetX, offsetY);
        this.drawBuildings(ctx, offsetX, offsetY);
        this.drawInfo(ctx, width, height);
    },

    drawGrid(ctx, offsetX, offsetY) {
        ctx.save();
        ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
        ctx.fillRect(offsetX - 10, offsetY - 10,
            this.grid.cols * this.grid.cellSize + 20,
            this.grid.rows * this.grid.cellSize + 20);
        ctx.strokeStyle = 'rgba(255, 232, 31, 0.3)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= this.grid.cols; x++) {
            ctx.beginPath();
            ctx.moveTo(offsetX + x * this.grid.cellSize, offsetY);
            ctx.lineTo(offsetX + x * this.grid.cellSize, offsetY + this.grid.rows * this.grid.cellSize);
            ctx.stroke();
        }
        for (let y = 0; y <= this.grid.rows; y++) {
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY + y * this.grid.cellSize);
            ctx.lineTo(offsetX + this.grid.cols * this.grid.cellSize, offsetY + y * this.grid.cellSize);
            ctx.stroke();
        }
        ctx.restore();
    },

    drawBuildings(ctx, offsetX, offsetY) {
        for (const building of this.constructed) {
            const size = building.size || { width: 1, height: 1 };
            const x = offsetX + building.gridX * this.grid.cellSize;
            const y = offsetY + building.gridY * this.grid.cellSize;
            const width = size.width * this.grid.cellSize - 4;
            const height = size.height * this.grid.cellSize - 4;
            const colors = {
                core: '#FFE81F', production: '#4CAF50', military: '#F44336',
                research: '#2196F3', defense: '#9C27B0', storage: '#FF9800'
            };
            const color = colors[building.type] || '#8B8B8B';
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(x + 4, y + 4, width, height);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
            ctx.strokeStyle = '#FFE81F';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            if (building.level > 1) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`Lv.${building.level}`, x + width / 2, y + height / 2);
            }
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '11px Arial';
            ctx.fillText(building.name, x + width / 2, y + height - 10);
            ctx.restore();
        }
    },

    drawInfo(ctx, width, height) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, height - 120, 250, 110);
        ctx.fillStyle = '#FFE81F';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Base Nivel ${GameState.base.level}`, 20, height - 100);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.fillText(`Edificios: ${this.constructed.length}`, 20, height - 75);
        ctx.fillText(`Capacidad: ${this.grid.rows * this.grid.cols}`, 20, height - 55);
        ctx.fillStyle = '#4CAF50';
        ctx.font = '12px Arial';
        ctx.fillText(`Prod: ₡${GameState.production.credits}/s  ◆${GameState.production.materials}/s  ⚡${GameState.production.energy}/s`, 20, height - 30);
        ctx.restore();
    }
};

window.Base = Base;