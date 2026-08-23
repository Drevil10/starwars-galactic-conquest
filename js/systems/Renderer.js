// js/systems/Renderer.js
// Renderiza la base en píxeles CSS. Game.js aplica el escalado DPR al contexto.

class RendererClass {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.gridSize = 40;
        this.gridOffset = { x: 0, y: 0 };
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.stars = [];
    }

    onResize(width, height) {
        this.width = Math.max(1, width);
        this.height = Math.max(1, height);
        this.recalculateGridMetrics();
    }

    recalculateGridMetrics() {
        const cells = Constants.GRID_SIZE;
        const horizontalPadding = Math.min(24, Math.max(8, this.width * 0.04));
        const verticalPadding = Math.min(24, Math.max(8, this.height * 0.04));
        const availableWidth = Math.max(1, this.width - horizontalPadding * 2);
        const availableHeight = Math.max(1, this.height - verticalPadding * 2);

        // Escala la cuadrícula para que siempre entre completa en el canvas.
        this.gridSize = Math.max(18, Math.floor(Math.min(
            availableWidth / cells,
            availableHeight / cells,
            64
        )));

        const gridWidth = cells * this.gridSize;
        const gridHeight = cells * this.gridSize;
        this.gridOffset.x = Math.round((this.width - gridWidth) / 2);
        this.gridOffset.y = Math.round((this.height - gridHeight) / 2);
    }

    render() {
        const ctx = Game.ctx;
        if (!ctx || !this.width || !this.height) return;

        ctx.save();
        this.drawSpaceBackground(ctx);

        if (GameState.getCurrentScreen() === 'base') {
            this.drawBaseGrid(ctx);
            if (typeof Base !== 'undefined' && Array.isArray(Base.buildings)) {
                this.drawBuildings(ctx, Base.buildings);
            }
        }

        ctx.restore();
    }

    drawSpaceBackground(ctx) {
        ctx.fillStyle = '#0b0d25';
        ctx.fillRect(0, 0, this.width, this.height);

        if (!this.stars.length) {
            for (let index = 0; index < 120; index += 1) {
                this.stars.push({
                    x: Math.random(),
                    y: Math.random(),
                    size: Math.random() * 1.5 + 0.4,
                    alpha: Math.random() * 0.55 + 0.2
                });
            }
        }

        for (const star of this.stars) {
            ctx.globalAlpha = star.alpha;
            ctx.fillStyle = '#dce9ff';
            ctx.beginPath();
            ctx.arc(star.x * this.width, star.y * this.height, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    drawBaseGrid(ctx) {
        const cells = Constants.GRID_SIZE;
        const size = this.gridSize;
        const left = this.gridOffset.x;
        const top = this.gridOffset.y;
        const total = cells * size;

        ctx.fillStyle = 'rgba(9, 14, 42, 0.72)';
        ctx.fillRect(left, top, total, total);

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.32)';
        ctx.lineWidth = 1;
        for (let index = 0; index <= cells; index += 1) {
            const x = left + index * size;
            const y = top + index * size;
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, top + total);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(left, y);
            ctx.lineTo(left + total, y);
            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, total, total);
    }

    drawBuildings(ctx, buildings) {
        for (const building of buildings) {
            const x = this.gridOffset.x + building.x * this.gridSize;
            const y = this.gridOffset.y + building.y * this.gridSize;
            const width = Math.max(this.gridSize - 4, 1);
            const height = Math.max(this.gridSize - 4, 1);
            const iconSize = Math.max(12, Math.min(24, this.gridSize * 0.56));

            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(x + 4, y + 4, width, height);
            ctx.fillStyle = building.color || '#4a90d9';
            ctx.fillRect(x + 2, y + 2, width, height);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 2, y + 2, width, height);

            ctx.fillStyle = '#fff';
            ctx.font = `${iconSize}px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(building.icon || '🏠', x + this.gridSize / 2, y + this.gridSize / 2);
        }
    }

    screenToGrid(screenX, screenY) {
        return {
            x: Math.floor((screenX - this.gridOffset.x) / this.gridSize),
            y: Math.floor((screenY - this.gridOffset.y) / this.gridSize)
        };
    }

    gridToScreen(gridX, gridY) {
        return {
            x: this.gridOffset.x + gridX * this.gridSize + this.gridSize / 2,
            y: this.gridOffset.y + gridY * this.gridSize + this.gridSize / 2
        };
    }

    isPointInGrid(x, y) {
        const total = Constants.GRID_SIZE * this.gridSize;
        return x >= this.gridOffset.x && x <= this.gridOffset.x + total &&
            y >= this.gridOffset.y && y <= this.gridOffset.y + total;
    }
}

window.Renderer = new RendererClass();
