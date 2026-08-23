// js/gameplay/Characters.js
// Sistema de personajes - gestión de tripulación y héroes

class CharactersClass {
    constructor() {
        this.characters = [];
        this.maxCharacters = 20;
    }

    init() {
        // Cargar personajes guardados
        const saved = SaveSystem.load('characters');
        if (saved && saved.characters) {
            this.characters = saved.characters;
        }

        console.log('Characters: Inicializados', this.characters.length, 'personajes');
    }

    addCharacter(characterData) {
        if (this.characters.length >= this.maxCharacters) {
            console.warn('Characters: Máximo de personajes alcanzado');
            return false;
        }

        const character = {
            id: 'char_' + Date.now(),
            name: characterData.name || 'Personaje',
            icon: characterData.icon || '👤',
            color: characterData.color || '#5cb85c',
            x: characterData.x || 0,
            y: characterData.y || 0,
            level: characterData.level || 1,
            exp: characterData.exp || 0,
            class: characterData.class || 'soldier',
            addedAt: Date.now()
        };

        this.characters.push(character);
        this.save();
        
        EventBus.emit('characters:added', { character });
        return true;
    }

    removeCharacter(id) {
        const index = this.characters.findIndex(c => c.id === id);
        if (index === -1) return false;
        
        const character = this.characters[index];
        this.characters.splice(index, 1);
        this.save();
        
        EventBus.emit('characters:removed', { character });
        return true;
    }

    getCharacter(id) {
        return this.characters.find(c => c.id === id);
    }

    update(deltaTime) {
        // Lógica de actualización de personajes
    }

    save() {
        SaveSystem.save('characters', {
            characters: this.characters,
            lastSaved: Date.now()
        });
    }

    // Utilidad: generar personaje aleatorio
    generateRandomCharacter() {
        const names = ['Luke', 'Leia', 'Han', 'Chewie', 'Yoda', 'Obi-Wan', 'Anakin', 'Padmé'];
        const icons = ['👤', '🧑‍🚀', '🧑‍✈️', '🧑‍⚕️', '🧑‍🔧'];
        const classes = ['soldier', 'pilot', 'medic', 'engineer', 'scout'];

        return {
            name: names[Math.floor(Math.random() * names.length)],
            icon: icons[Math.floor(Math.random() * icons.length)],
            class: classes[Math.floor(Math.random() * classes.length)],
            level: Math.floor(Math.random() * 5) + 1
        };
    }
}

// Exportar instancia global
window.Characters = new CharactersClass();
