/**
 * Input.js
 * Sistema de gesti�n de inputs
 */

const Input = {
    keys: {},
    mouse: { x: 0, y: 0, leftDown: false, rightDown: false, clicked: false },
    canvas: null,

    initialize() {
        this.canvas = document.getElementById('game-canvas');
        
        window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
        window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
        
        if (this.canvas) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            this.canvas.addEventListener('mousedown', (e) => {
                if (e.button === 0) this.mouse.leftDown = true;
                if (e.button === 2) this.mouse.rightDown = true;
            });
            
            this.canvas.addEventListener('mouseup', (e) => {
                if (e.button === 0) {
                    this.mouse.leftDown = false;
                    this.mouse.clicked = true;
                }
                if (e.button === 2) this.mouse.rightDown = false;
            });
            
            this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
            this.canvas.addEventListener('click', () => setTimeout(() => { this.mouse.clicked = false; }, 100));
            
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.mouse.x = touch.clientX - rect.left;
                this.mouse.y = touch.clientY - rect.top;
                this.mouse.leftDown = true;
                this.mouse.clicked = true;
            });
            
            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.mouse.x = touch.clientX - rect.left;
                this.mouse.y = touch.clientY - rect.top;
            });
            
            this.canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.mouse.leftDown = false;
                setTimeout(() => { this.mouse.clicked = false; }, 100);
            });
        }
        
        console.log('[Input] Sistema inicializado');
    },

    isKeyDown(code) { return this.keys[code] === true; },
    isMouseDown() { return this.mouse.leftDown; },
    getMousePosition() { return { x: this.mouse.x, y: this.mouse.y }; },
    wasClicked() { return this.mouse.clicked; },

    update(deltaTime) {
        if (this.mouse.clicked) this.mouse.clicked = false;
    }
};

window.Input = Input;