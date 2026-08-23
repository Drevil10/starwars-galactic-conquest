/**
 * SaveSystem.js
 * Sistema de guardado y carga usando LocalStorage
 */

const SaveSystem = {
    saveKey: Constants.GAME.SAVE_KEY,
    autoSaveInterval: 60,
    autoSaveTimer: 0,
    autoSaveEnabled: true,

    initialize() {
        console.log('[SaveSystem] Sistema inicializado');
        EventBus.subscribe(Constants.EVENTS.GAME.UPDATE, (data) => {
            if (this.autoSaveEnabled) {
                this.autoSaveTimer += data.deltaTime;
                if (this.autoSaveTimer >= this.autoSaveInterval) {
                    this.autoSave();
                    this.autoSaveTimer = 0;
                }
            }
        });
    },

    save(data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(this.saveKey, serialized);
            console.log(`[SaveSystem] Partida guardada (${serialized.length} bytes)`);
            return true;
        } catch (error) {
            console.error('[SaveSystem] Error al guardar:', error);
            if (error.name === 'QuotaExceededError') {
                console.warn('[SaveSystem] Espacio lleno');
                EventBus.emit(Constants.EVENTS.UI.SHOW_NOTIFICATION, {
                    message: 'Espacio de guardado lleno',
                    type: 'error'
                });
            }
            return false;
        }
    },

    load() {
        try {
            const serialized = localStorage.getItem(this.saveKey);
            if (!serialized) {
                console.log('[SaveSystem] No hay partida guardada');
                return null;
            }
            const data = JSON.parse(serialized);
            console.log(`[SaveSystem] Partida cargada (${serialized.length} bytes)`);
            return data;
        } catch (error) {
            console.error('[SaveSystem] Error al cargar:', error);
            return null;
        }
    },

    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    },

    delete() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('[SaveSystem] Partida eliminada');
            return true;
        } catch (error) {
            console.error('[SaveSystem] Error al eliminar:', error);
            return false;
        }
    },

    autoSave() {
        const data = GameState.serialize();
        this.save(data);
        if (GameState.settings.notifications) {
            EventBus.emit(Constants.EVENTS.UI.SHOW_NOTIFICATION, {
                message: 'Partida guardada',
                type: 'info',
                duration: 2000
            });
        }
    },

    getSaveInfo() {
        const data = this.load();
        if (!data) return null;
        return {
            version: data.gameInfo?.version,
            lastSave: data.gameInfo?.lastSave,
            playTime: data.gameInfo?.playTime,
            level: data.progress?.level,
            resources: data.resources
        };
    }
};

window.SaveSystem = SaveSystem;