// js/systems/SaveSystem.js
// Sistema de guardado - LocalStorage con versionado y migración

class SaveSystemClass {
    constructor() {
        this.VERSION = 1;
        this.PREFIX = 'swgc_';
    }

    save(key, data) {
        try {
            const saveData = {
                version: this.VERSION,
                timestamp: Date.now(),
                data: data
            };
            
            localStorage.setItem(this.PREFIX + key, JSON.stringify(saveData));
            console.log('SaveSystem: Guardado', key);
            return true;
        } catch (error) {
            console.error('SaveSystem: Error al guardar', key, error);
            return false;
        }
    }

    load(key) {
        try {
            const json = localStorage.getItem(this.PREFIX + key);
            if (!json) return null;
            
            const saveData = JSON.parse(json);
            
            // Verificar versión y migrar si es necesario
            if (saveData.version < this.VERSION) {
                console.log('SaveSystem: Migrando de v', saveData.version, 'a v', this.VERSION);
                return this.migrate(saveData.data, saveData.version, this.VERSION);
            }
            
            return saveData.data;
        } catch (error) {
            console.error('SaveSystem: Error al cargar', key, error);
            return null;
        }
    }

    migrate(data, fromVersion, toVersion) {
        // Implementar migraciones aquí si cambian los esquemas
        // Ejemplo: if (fromVersion === 1 && toVersion === 2) { ... }
        
        // Por ahora, retorno los datos tal cual (compatibilidad hacia atrás)
        return data;
    }

    exists(key) {
        return localStorage.getItem(this.PREFIX + key) !== null;
    }

    remove(key) {
        try {
            localStorage.removeItem(this.PREFIX + key);
            console.log('SaveSystem: Eliminado', key);
            return true;
        } catch (error) {
            console.error('SaveSystem: Error al eliminar', key, error);
            return false;
        }
    }

    clear(key) {
        return this.remove(key);
    }

    clearAll() {
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.PREFIX)) {
                    keys.push(key);
                }
            }
            
            keys.forEach(key => localStorage.removeItem(key));
            console.log('SaveSystem: Todos los datos eliminados');
            return true;
        } catch (error) {
            console.error('SaveSystem: Error al limpiar todo', error);
            return false;
        }
    }

    // Utilidad: listar todos los saves
    listSaves() {
        const saves = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    saves.push({
                        key: key.replace(this.PREFIX, ''),
                        version: data.version,
                        timestamp: data.timestamp
                    });
                } catch (e) {
                    // Ignorar datos corruptos
                }
            }
        }
        return saves;
    }
}

// Exportar instancia global
window.SaveSystem = new SaveSystemClass();
