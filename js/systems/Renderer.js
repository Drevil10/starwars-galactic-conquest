/**
 * Renderer.js
 * Sistema de renderizado del juego
 */

const Renderer = {
    width: 0,
    height: 0,
    camera: { x: 0, y: 0, zoom: 1 },
    renderQueue: [],

    initialize() {
        console.log('[Renderer] Sistema inicializado');
    },

    onResize(width, height) {
        this.width = width;
        this.height = height;
        console.log(`[Renderer] Resize: ${width}x${height}`);
    },

    clear(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
    },

    drawSpaceBackground(ctx) {
        const gradient = ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2,
            Math.max(this.width, this.height)
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#0f0f1e');
        gradient.addColorStop(1, '#0a0e27');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        this.drawStars(ctx);
    },

    drawStars(ctx) {
        const starCount = 200;
        for (let i = 0; i < starCount; i++) {
            const x = (Math.sin(i * 12.9898) * 43758.5453) % this.width;
            const y = (Math.cos(i * 78.233) * 43758.5453) % this.height;
            const size = (Math.sin(i * 5.567) + 2) * 0.5;
            const alpha = (Math.sin(i * 3.234) + 1) / 2 * 0.5 + 0.2;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(Math.abs(x), Math.abs(y), size, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    drawSprite(ctx, config) {
        const { image, x, y, width = 32, height = 32, rotation = 0, scale = 1, color = null } = config;
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        if (image) {
            ctx.drawImage(image, -width / 2, -height / 2, width, height);
        } else if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(-width / 2, -height / 2, width, height);
        }
        ctx.restore();
    },

    drawText(ctx, config) {
        const { text, x, y, color = '#FFFFFF', size = 16, align = 'center', font = 'Arial' } = config;
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${size}px ${font}`;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        ctx.restore();
    },

    drawShape(ctx, config) {
        const { type = 'rect', x, y, width, height, color = '#FFFFFF', radius = 0 } = config;
        ctx.save();
        ctx.fillStyle = color;
        if (type === 'rect') {
            if (radius > 0) {
                ctx.beginPath();
                ctx.roundRect(x, y, width, height, radius);
                ctx.fill();
            } else {
                ctx.fillRect(x, y, width, height);
            }
        } else if (type === 'circle') {
            ctx.beginPath();
            ctx.arc(x, y, width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    },

    render(ctx) {
        this.drawSpaceBackground(ctx);
        if (Navigation && Navigation.currentTab === Constants.TABS.BASE) {
            Base.render(ctx, this.width, this.height);
        }
        this.drawDebugInfo(ctx);
    },

    drawDebugInfo(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(10, 10, 200, 80);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`FPS: ${Constants.CANVAS.FPS}`, 20, 30);
        ctx.fillText(`Recursos: ₡${GameState.resources.credits}`, 20, 50);
        ctx.fillText(`Base Nivel: ${GameState.base.level}`, 20, 70);
        ctx.restore();
    }
};

window.Renderer = Renderer;