/**
 * EventBus.js
 * Sistema de comunicaci�n entre m�dulos mediante eventos
 */

const EventBus = {
    listeners: {},

    subscribe(event, callback, context = null) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        
        this.listeners[event].push({ callback, context });
        return () => this.unsubscribe(event, callback);
    },

    unsubscribe(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(
            listener => listener.callback !== callback
        );
        if (this.listeners[event].length === 0) {
            delete this.listeners[event];
        }
    },

    emit(event, data = {}) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(({ callback, context }) => {
            if (context) {
                callback.call(context, data);
            } else {
                callback(data);
            }
        });
    },

    once(event, callback) {
        const unsubscribe = this.subscribe(event, (data) => {
            unsubscribe();
            callback(data);
        });
        return unsubscribe;
    },

    clear(event = null) {
        if (event) {
            delete this.listeners[event];
        } else {
            this.listeners = {};
        }
    },

    listenerCount(event) {
        return this.listeners[event] ? this.listeners[event].length : 0;
    }
};

window.EventBus = EventBus;