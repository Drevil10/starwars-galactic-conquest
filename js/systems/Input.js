// js/systems/Input.js
// Sistema de entrada - maneja touch y mouse sin bloquear botones

class InputClass {
    constructor() {
        this.isTouch = false;
        this.startPos = { x: 0, y: 0 };
        this.currentPos = { x: 0, y: 0 };
        this.isDragging = false;
    }

    init() {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;

        // Detectar si es dispositivo táctil
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Eventos de touch - SIN preventDefault global
        canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // Eventos de mouse
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('click', (e) => this.handleClick(e));

        console.log('Input: Inicializado', { isTouch: this.isTouch });
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.startPos = Game.getCSSCoordinates(touch.clientX, touch.clientY);
            this.currentPos = { ...this.startPos };
            this.isDragging = false;
            
            EventBus.emit('input:touchStart', {
                x: this.startPos.x,
                y: this.startPos.y
            });
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const pos = Game.getCSSCoordinates(touch.clientX, touch.clientY);
            
            // Detectar si es drag (movimiento > 10px)
            const dx = pos.x - this.startPos.x;
            const dy = pos.y - this.startPos.y;
            if (Math.sqrt(dx * dx + dy * dy) > 10) {
                this.isDragging = true;
            }
            
            this.currentPos = pos;
            
            EventBus.emit('input:touchMove', {
                x: pos.x,
                y: pos.y,
                deltaX: dx,
                deltaY: dy
            });
        }
    }

    handleTouchEnd(e) {
        if (!this.isDragging) {
            // Es un tap/click
            EventBus.emit('input:tap', {
                x: this.startPos.x,
                y: this.startPos.y
            });
        }
        
        EventBus.emit('input:touchEnd', {
            x: this.currentPos.x,
            y: this.currentPos.y
        });
        
        this.isDragging = false;
    }

    handleMouseDown(e) {
        this.startPos = Game.getCSSCoordinates(e.clientX, e.clientY);
        this.currentPos = { ...this.startPos };
        this.isDragging = false;
        
        EventBus.emit('input:mouseDown', {
            x: this.startPos.x,
            y: this.startPos.y
        });
    }

    handleMouseMove(e) {
        const pos = Game.getCSSCoordinates(e.clientX, e.clientY);
        const dx = pos.x - this.startPos.x;
        const dy = pos.y - this.startPos.y;
        
        if (Math.sqrt(dx * dx + dy * dy) > 10) {
            this.isDragging = true;
        }
        
        this.currentPos = pos;
        
        EventBus.emit('input:mouseMove', {
            x: pos.x,
            y: pos.y,
            deltaX: dx,
            deltaY: dy
        });
    }

    handleMouseUp(e) {
        if (!this.isDragging) {
            EventBus.emit('input:click', {
                x: this.startPos.x,
                y: this.startPos.y
            });
        }
        
        EventBus.emit('input:mouseUp', {
            x: this.currentPos.x,
            y: this.currentPos.y
        });
        
        this.isDragging = false;
    }

    handleClick(e) {
        const pos = Game.getCSSCoordinates(e.clientX, e.clientY);
        EventBus.emit('input:canvasClick', pos);
    }

    // Utilidad: obtener posición actual
    getPosition() {
        return { ...this.currentPos };
    }

    isDrag() {
        return this.isDragging;
    }
}

// Exportar instancia global
window.Input = new InputClass();
