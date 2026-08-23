// js/core/GameState.js
// Estado centralizado del juego

class GameStateClass {
    constructor() {
        this.state = {
            credits: Constants.INITIAL_RESOURCES.credits,
            crystals: Constants.INITIAL_RESOURCES.crystals,
            energy: Constants.INITIAL_RESOURCES.energy,
            screen: Constants.SCREENS.START,
            gameState: Constants.STATES.MENU,
            startTime: Date.now(),
            lastSaveTime: Date.now()
        };
        
        this.listeners = new Map();
    }

    init() {
        // Cargar estado guardado
        const saved = SaveSystem.load('gameState');
        if (saved) {
            this.state = { ...this.state, ...saved };
            console.log('GameState: Estado cargado', this.state);
        }
        
        // Iniciar auto-guardado
        if (Constants.GAME.AUTO_SAVE) {
            setInterval(() => this.autoSave(), Constants.GAME.SAVE_INTERVAL);
        }
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };
        
        // Notificar cambios
        Object.keys(newState).forEach(key => {
            this.emit(`change:${key}`, { 
                key, 
                oldValue: oldState[key], 
                newValue: this.state[key] 
            });
        });
        
        this.emit('change', { oldState, newState: this.state });
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        
        return () => this.unsubscribe(event, callback);
    }

    unsubscribe(event, callback) {
        if (!this.listeners.has(event)) return;
        
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (!this.listeners.has(event)) return;
        
        this.listeners.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('GameState: Error en listener', event, error);
            }
        });
    }

    // Recursos
    getResources() {
        return {
            credits: this.state.credits,
            crystals: this.state.crystals,
            energy: this.state.energy
        };
    }

    addResources(changes) {
        const newResources = { ...this.state };
        
        if (changes.credits !== undefined) {
            newResources.credits = Math.max(0, Math.min(
                Constants.RESOURCE_LIMITS.credits,
                this.state.credits + changes.credits
            ));
        }
        
        if (changes.crystals !== undefined) {
            newResources.crystals = Math.max(0, Math.min(
                Constants.RESOURCE_LIMITS.crystals,
                this.state.crystals + changes.crystals
            ));
        }
        
        if (changes.energy !== undefined) {
            newResources.energy = Math.max(0, Math.min(
                Constants.RESOURCE_LIMITS.energy,
                this.state.energy + changes.energy
            ));
        }
        
        this.setState(newResources);
        
        // Actualizar UI
        this.updateResourceUI();
    }

    setResource(resource, value) {
        if (Constants.RESOURCES[resource.toUpperCase()] === undefined) {
            console.warn('GameState: Recurso inválido', resource);
            return;
        }
        
        const cappedValue = Math.max(0, Math.min(
            Constants.RESOURCE_LIMITS[resource],
            value
        ));
        
        this.setState({ [resource]: cappedValue });
        this.updateResourceUI();
    }

    canAfford(cost) {
        return this.state.credits >= (cost.credits || 0) &&
               this.state.crystals >= (cost.crystals || 0) &&
               this.state.energy >= (cost.energy || 0);
    }

    // Pantallas
    getCurrentScreen() {
        return this.state.screen;
    }

    setScreen(screen) {
        if (!Constants.SCREENS[screen.toUpperCase()]) {
            console.warn('GameState: Pantalla inválida', screen);
            return;
        }
        
        this.setState({ screen });
    }

    // Estado del juego
    getGameState() {
        return this.state.gameState;
    }

    setGameState(gameState) {
        if (!Constants.STATES[gameState.toUpperCase()]) {
            console.warn('GameState: Estado inválido', gameState);
            return;
        }
        
        this.setState({ gameState });
    }

    // UI
    updateResourceUI() {
        const creditsEl = document.querySelector('#resource-credits .resource-value');
        const crystalsEl = document.querySelector('#resource-crystals .resource-value');
        const energyEl = document.querySelector('#resource-energy .resource-value');
        
        if (creditsEl) creditsEl.textContent = Math.floor(this.state.credits);
        if (crystalsEl) crystalsEl.textContent = Math.floor(this.state.crystals);
        if (energyEl) energyEl.textContent = Math.floor(this.state.energy);
    }

    // Auto-guardado
    autoSave() {
        SaveSystem.save('gameState', this.state);
        this.state.lastSaveTime = Date.now();
        console.log('GameState: Auto-guardado completado');
    }

    // Guardado manual
    save() {
        SaveSystem.save('gameState', this.state);
        console.log('GameState: Guardado manual completado');
    }

    // Reset
    reset() {
        this.state = {
            credits: Constants.INITIAL_RESOURCES.credits,
            crystals: Constants.INITIAL_RESOURCES.crystals,
            energy: Constants.INITIAL_RESOURCES.energy,
            screen: Constants.SCREENS.START,
            gameState: Constants.STATES.MENU,
            startTime: Date.now(),
            lastSaveTime: Date.now()
        };
        
        SaveSystem.clear('gameState');
        this.updateResourceUI();
        console.log('GameState: Reset completado');
    }
}

// Exportar instancia global
window.GameState = new GameStateClass();
