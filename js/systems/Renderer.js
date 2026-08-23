// js/systems/Renderer.js
// Sistema de renderizado - dibuja la cuadrícula de la base y elementos del juego

class RendererClass {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.gridSize = 50; // Tamaño de cada celda en píxeles CSS
        this.gridOffset = { x: 0, y: 0 };
        this.camera = { x: 0, y: 0, zoom: 1 };
    }

    onResize(width, height) {
        this.width = width;
        this.height = height;
        
        // Recalcular offset para centrar la cuadrícula
        this.recalculateGridOffset();
        
        console.log('Renderer: Redimensionado', { width, height });
    }

    recalculateGridOffset() {
        // Centrar la cuadrícula en el canvas
        const gridWidth = Constants.GRID_SIZE * this.gridSize;
        const gridHeight = Constants.GRID_SIZE * this.gridSize;
        
        this.gridOffset.x = (this.width - gridWidth) / 2;
        this.gridOffset.y = (this.height - gridHeight) / 2;
    }

    render() {
        const ctx = Game.ctx;
        if (!ctx) return;

        // Guardar estado
        ctx.save();

        // Aplicar cámara
        ctx.translate(-this.camera.x, -this.camera.y);
        ctx.scale(this.camera.zoom, this.camera.zoom);

        // Dibujar fondo espacial
        this.drawSpaceBackground(ctx);

        // Dibujar cuadrícula de la base
        this.drawBaseGrid(ctx);

        // Dibujar edificios
        if (typeof Base !== 'undefined' && Base.buildings) {
            this.drawBuildings(ctx, Base.buildings);
        }

        // Dibujar personajes
        if (typeof Characters !== 'undefined' && Characters.characters) {
            this.drawCharacters(ctx, Characters.characters);
        }

        // Dibujar naves
        if (typeof Ships !== 'undefined' && Ships.ships) {
            this.drawShips(ctx, Ships.ships);
        }

        // Restaurar estado
        ctx.restore();
    }

    drawSpaceBackground(ctx) {
        // Fondo negro con estrellas
        ctx.fillStyle = '#000011';
        ctx.fillRect(
            this.camera.x,
            this.camera.y,
            this.width / this.camera.zoom,
            this.height / this.camera.zoom
        );

        // Estrellas (generadas una vez y cacheadas)
        if (!this.stars) {
            this.stars = [];
            for (let i = 0; i < 200; i++) {
                this.stars.push({
                    x: Math.random() * 2000,
                    y: Math.random() * 2000,
                    size: Math.random() * 2 + 0.5,
                    brightness: Math.random() * 0.5 + 0.5
                });
            }
        }

        ctx.fillStyle = '#fff';
        this.stars.forEach(star => {
            ctx.globalAlpha = star.brightness;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    drawBaseGrid(ctx) {
        const gridSize = Constants.GRID_SIZE;
        const cellSize = this.gridSize;

        // Dibujar cuadrícula
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.lineWidth = 1;

        for (let x = 0; x <= gridSize; x++) {
            const px = this.gridOffset.x + x * cellSize;
            ctx.beginPath();
            ctx.moveTo(px, this.gridOffset.y);
            ctx.lineTo(px, this.gridOffset.y + gridSize * cellSize);
            ctx.stroke();
        }

        for (let y = 0; y <= gridSize; y++) {
            const py = this.gridOffset.y + y * cellSize;
            ctx.beginPath();
            ctx.moveTo(this.gridOffset.x, py);
            ctx.lineTo(this.gridOffset.x + gridSize * cellSize, py);
            ctx.stroke();
        }

        // Dibujar borde de la base
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.gridOffset.x,
            this.gridOffset.y,
            gridSize * cellSize,
            gridSize * cellSize
        );
    }

    drawBuildings(ctx, buildings) {
        buildings.forEach(building => {
            const x = this.gridOffset.x + building.x * this.gridSize;
            const y = this.gridOffset.y + building.y * this.gridSize;
            const size = this.gridSize - 4;

            // Sombra
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(x + 4, y + 4, size, size);

            // Edificio
            ctx.fillStyle = building.color || '#4a90d9';
            ctx.fillRect(x + 2, y + 2, size, size);

            // Borde
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 2, y + 2, size, size);

            // Icono o texto
            ctx.fillStyle = '#fff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                building.icon || '🏠',
                x + size / 2,
                y + size / 2
            );
        });
    }

    drawCharacters(ctx, characters) {
        characters.forEach(char => {
            const x = this.gridOffset.x + char.x * this.gridSize + this.gridSize / 2;
            const y = this.gridOffset.y + char.y * this.gridSize + this.gridSize / 2;

            // Círculo del personaje
            ctx.fillStyle = char.color || '#5cb85c';
            ctx.beginPath();
            ctx.arc(x, y, this.gridSize * 0.35, 0, Math.PI * 2);
            ctx.fill();

            // Borde
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Icono
            ctx.fillStyle = '#000';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(char.icon || '👤', x, y);
        });
    }

    drawShips(ctx, ships) {
        ships.forEach(ship => {
            const x = this.gridOffset.x + ship.x * this.gridSize + this.gridSize / 2;
            const y = this.gridOffset.y + ship.y * this.gridSize + this.gridSize / 2;

            // Nave (triángulo)
            ctx.fillStyle = ship.color || '#d9534f';
            ctx.beginPath();
            ctx.moveTo(x, y - this.gridSize * 0.4);
            ctx.lineTo(x - this.gridSize * 0.3, y + this.gridSize * 0.3);
            ctx.lineTo(x + this.gridSize * 0.3, y + this.gridSize * 0.3);
            ctx.closePath();
            ctx.fill();

            // Borde
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    // Utilidad: convertir coordenadas de pantalla a coordenadas de la cuadrícula
    screenToGrid(screenX, screenY) {
        const gridX = Math.floor((screenX - this.gridOffset.x) / this.gridSize);
        const gridY = Math.floor((screenY - this.gridOffset.y) / this.gridSize);
        return { x: gridX, y: gridY };
    }

    // Utilidad: convertir coordenadas de la cuadrícula a pantalla
    gridToScreen(gridX, gridY) {
        return {
            x: this.gridOffset.x + gridX * this.gridSize + this.gridSize / 2,
            y: this.gridOffset.y + gridY * this.gridSize + this.gridSize / 2
        };
    }

    // Utilidad: verificar si un punto está dentro de la cuadrícula
    isPointInGrid(x, y) {
        const gridX = this.gridOffset.x;
        const gridY = this.gridOffset.y;
        const gridSize = Constants.GRID_SIZE * this.gridSize;

        return x >= gridX && x <= gridX + gridSize &&
               y >= gridY && y <= gridY + gridSize;
    }
}

// Exportar instancia global
window.Renderer = new RendererClass();
