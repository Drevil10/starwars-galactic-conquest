// js/ui/CampaignMapViewport.js
// Ajusta el canvas y centra el mapa cuando se abre la pantalla de campaña.

class CampaignMapViewportClass {
    constructor() {
        this.canvas = null;
        this.gameScreen = null;
        this.resizeTimer = null;
        this.observer = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) {
            return true;
        }

        this.canvas = document.getElementById('game-canvas');
        this.gameScreen = document.getElementById('game-screen');

        if (!this.canvas || !this.gameScreen) {
            console.error(
                'CampaignMapViewport: No se encontró #game-canvas o #game-screen.'
            );

            return false;
        }

        this.bindEvents();
        this.initialized = true;

        return true;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.scheduleLayout();
        });

        window.addEventListener('orientationchange', () => {
            this.scheduleLayout();
        });

        window.addEventListener('pageshow', () => {
            this.scheduleLayout();
        });

        this.observer = new MutationObserver(() => {
            if (this.isGameScreenVisible()) {
                this.scheduleLayout();
            }
        });

        this.observer.observe(this.gameScreen, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    isGameScreenVisible() {
        if (!this.gameScreen) {
            return false;
        }

        const rect = this.gameScreen.getBoundingClientRect();

        return (
            this.gameScreen.classList.contains('active') &&
            rect.width > 0 &&
            rect.height > 0
        );
    }

    scheduleLayout() {
        if (!this.initialized && !this.init()) {
            return;
        }

        if (!this.isGameScreenVisible()) {
            return;
        }

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                this.updateLayout();
            });
        });

        clearTimeout(this.resizeTimer);

        this.resizeTimer = setTimeout(() => {
            this.updateLayout();
        }, 180);
    }

    updateLayout() {
        if (!this.canvas || !this.isGameScreenVisible()) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return;
        }

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.round(rect.width * pixelRatio);
        const height = Math.round(rect.height * pixelRatio);

        if (
            this.canvas.width !== width ||
            this.canvas.height !== height
        ) {
            this.canvas.width = width;
            this.canvas.height = height;
        }

        if (
            typeof MapSystem !== 'undefined' &&
            typeof MapSystem.fitToViewport === 'function'
        ) {
            MapSystem.fitToViewport();
        }

        if (
            typeof MapSystem !== 'undefined' &&
            typeof MapSystem.render === 'function'
        ) {
            MapSystem.render();
        }

        console.log('CampaignMapViewport: Canvas reajustado.', {
            cssWidth: Math.round(rect.width),
            cssHeight: Math.round(rect.height),
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height,
            pixelRatio
        });
    }
}

window.CampaignMapViewport = new CampaignMapViewportClass();

window.addEventListener('load', () => {
    CampaignMapViewport.init();
});
