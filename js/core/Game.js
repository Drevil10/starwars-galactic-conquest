/**
 * Game.js
 * Orquestador principal del juego
 */

const Game = {
    isRunning: false,
    isPaused: false,
    lastTime: 0,
    accumulator: 0,
    systems: {},
    canvas: null,
    ctx: null,

    initialize() {
        console.log(`[Game] Inicializando ${Constants.GAME.TITLE} v${Constants.GAME.VERSION}`);
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.initializeSystems();
        this.setupEventListeners();
        console.log('[Game] Inicializacion completada');
    },

    initializeSystems() {
        this.systems.input = Input;
        this.systems.renderer = Renderer;
        this.systems.save = SaveSystem;
        this.systems.resources = ResourceManager;
        this.systems.base = Base;
        this.systems.characters = Characters;
        this.systems.ships = Ships;
        this.systems.navigation = Navigation;
        this.systems.screens = Screens;
        
        Object.values(this.systems).forEach(system => {
            if (system.initialize && typeof system.initialize === 'function') {
                system.initialize();
            }
        });
    },

    setupEventListeners() {
        EventBus.subscribe(Constants.EVENTS.GAME.START, () => this.start());
        EventBus.subscribe(Constants.EVENTS.GAME.LOAD, () => this.load());
        EventBus.subscribe(Constants.EVENTS.GAME.SAVE, () => this.save());
    },

    resizeCanvas() {
        const gameArea = document.getElementById('game-area');
        this.canvas.width = gameArea.clientWidth;
        this.canvas.height = gameArea.clientHeight;
        if (this.canvas.width < Constants.CANVAS.MIN_WIDTH) this.canvas.width = Constants.CANVAS.MIN_WIDTH;
        if (this.canvas.height < Constants.CANVAS.MIN_HEIGHT) this.canvas.height = Constants.CANVAS.MIN_HEIGHT;
        if (this.systems.renderer && this.systems.renderer.onResize) {
            this.systems.renderer.onResize(this.canvas.width, this.canvas.height);
        }
    },

    start() {
        if (this.isRunning) return;
        console.log('[Game] Iniciando partida nueva');
        GameState.initialize();
        EventBus.emit(Constants.EVENTS.NAVIGATION.SCREEN_CHANGE, { screen: Constants.SCREENS.GAME });
        Object.values(this.systems).forEach(system => {
            if (system.start && typeof system.start === 'function') system.start();
        });
        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();
        this.accumulator = 0;
        requestAnimationFrame((time) => this.gameLoop(time));
        console.log('[Game] Juego iniciado');
    },

    load() {
        const savedData = this.systems.save.load();
        if (savedData && GameState.deserialize(savedData)) {
            console.log('[Game] Partida cargada');
            EventBus.emit(Constants.EVENTS.NAVIGATION.SCREEN_CHANGE, { screen: Constants.SCREENS.GAME });
            Object.values(this.systems).forEach(system => {
                if (system.start && typeof system.start === 'function') system.start();
            });
            this.isRunning = true;
            this.isPaused = false;
            this.lastTime = performance.now();
            this.accumulator = 0;
            requestAnimationFrame((time) => this.gameLoop(time));
        } else {
            console.warn('[Game] No se pudo cargar la partida');
        }
    },

    save() {
        const data = GameState.serialize();
        this.systems.save.save(data);
        console.log('[Game] Partida guardada');
    },

    pause() {
        this.isPaused = true;
        console.log('[Game] Juego pausado');
    },

    resume() {
        this.isPaused = false;
        this.lastTime = performance.now();
        console.log('[Game] Juego continuado');
    },

    stop() {
        this.isRunning = false;
        console.log('[Game] Juego detenido');
    },

    gameLoop(currentTime) {
        if (!this.isRunning) return;
        requestAnimationFrame((time) => this.gameLoop(time));
        if (this.isPaused) return;
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.accumulator += deltaTime;
        const fixedTimeStep = 1 / Constants.CANVAS.FPS;
        while (this.accumulator >= fixedTimeStep) {
            this.update(fixedTimeStep);
            this.accumulator -= fixedTimeStep;
        }
        this.render();
    },

    update(deltaTime) {
        GameState.gameInfo.playTime += deltaTime;
        Object.values(this.systems).forEach(system => {
            if (system.update && typeof system.update === 'function') system.update(deltaTime);
        });
        EventBus.emit(Constants.EVENTS.GAME.UPDATE, { deltaTime });
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Object.values(this.systems).forEach(system => {
            if (system.render && typeof system.render === 'function') system.render(this.ctx);
        });
        EventBus.emit(Constants.EVENTS.GAME.RENDER, { ctx: this.ctx });
    }
};

window.Game = Game;