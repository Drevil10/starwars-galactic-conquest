// js/core/Game.js
// Módulo principal del juego - maneja el canvas, resize y loop principal

class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.lastTime = 0;
        this.isRunning = false;
        this.pixelRatio = 1;
    }

    init() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            console.error('Game: Canvas no encontrado');
            return false;
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Game: No se pudo obtener el contexto 2D');
            return false;
        }

        // Configurar canvas para touch
        this.canvas.style.touchAction = 'none';

        // Resize inicial
        this.resizeCanvas();

        // Escuchar cambios de tamaño
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // También escuchar orientación en móviles
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resizeCanvas(), 100);
        });

        console.log('Game: Canvas inicializado', {
            width: this.width,
            height: this.height,
            pixelRatio: this.pixelRatio
        });

        return true;
    }

    resizeCanvas() {
        const gameArea = document.getElementById('game-area');
        if (!gameArea || !this.canvas) return;

        // Obtener tamaño real del contenedor en píxeles CSS
        const width = Math.max(1, gameArea.clientWidth);
        const height = Math.max(1, gameArea.clientHeight);
        
        // Limitar pixel ratio a 2 para rendimiento en móviles
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        // Establecer tamaño CSS del canvas
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        // Establecer tamaño real del canvas (píxeles de dispositivo)
        this.canvas.width = Math.floor(width * pixelRatio);
        this.canvas.height = Math.floor(height * pixelRatio);

        // Configurar transformación para dibujar en píxeles CSS
        this.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        // Actualizar estado interno
        this.width = width;
        this.height = height;
        this.pixelRatio = pixelRatio;

        // Notificar al renderer
        if (typeof Renderer !== 'undefined') {
            Renderer.onResize(width, height);
        }

        // Forzar redraw inmediato
        if (typeof Renderer !== 'undefined' && typeof Renderer.render === 'function') {
            Renderer.render();
        }

        console.log('Game: Canvas redimensionado', {
            cssWidth: width,
            cssHeight: height,
            deviceWidth: this.canvas.width,
            deviceHeight: this.canvas.height,
            pixelRatio: pixelRatio
        });
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
        console.log('Game: Loop iniciado');
    }

    stop() {
        this.isRunning = false;
        console.log('Game: Loop detenido');
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Limitar delta time para evitar saltos grandes
        const safeDelta = Math.min(deltaTime, 0.1);

        // Actualizar lógica del juego
        this.update(safeDelta);

        // Renderizar
        this.render();

        // Siguiente frame
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Actualizar sistemas del juego
        if (typeof Base !== 'undefined' && Base.update) {
            Base.update(deltaTime);
        }
        if (typeof Characters !== 'undefined' && Characters.update) {
            Characters.update(deltaTime);
        }
        if (typeof Ships !== 'undefined' && Ships.update) {
            Ships.update(deltaTime);
        }
    }

    render() {
        if (!this.ctx) return;

        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Renderizar sistemas
        if (typeof Renderer !== 'undefined' && Renderer.render) {
            Renderer.render();
        }
    }

    // Utilidad: convertir coordenadas de pantalla a coordenadas del canvas
    getCanvasCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left) * (this.canvas.width / rect.width),
            y: (clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    // Utilidad: obtener coordenadas en píxeles CSS (para lógica del juego)
    getCSSCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
}

// Exportar instancia global
window.Game = new Game();
