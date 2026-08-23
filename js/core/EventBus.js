// js/core/EventBus.js
// Sistema de eventos para comunicación entre módulos

class EventBusClass {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
        
        // Retornar función para unsubscribe
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events.has(event)) return;
        
        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data = {}) {
        if (!this.events.has(event)) return;
        
        const callbacks = this.events.get(event);
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('EventBus: Error en listener', event, error);
            }
        });
    }

    once(event, callback) {
        const wrapper = (data) => {
            this.off(event, wrapper);
            callback(data);
        };
        this.on(event, wrapper);
    }

    clear(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }
}

// Exportar instancia global
window.EventBus = new EventBusClass();
