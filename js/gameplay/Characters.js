/**
 * Characters.js
 * Sistema de personajes - Todos los bandos de Star Wars
 */

const Characters = {
    roster: [],
    recruited: [],

    initialize() {
        console.log('[Characters] Sistema inicializado');
        this.initializeRoster();
    },

    initializeRoster() {
        // REP�BLICA
        this.addCharacter({
            id: 'anakin_republic', name: 'Anakin Skywalker', faction: Constants.FACTIONS.REPUBLIC,
            role: 'Jedi Knight', rarity: 'legendary',
            stats: { attack: 95, defense: 85, speed: 90, leadership: 80 },
            abilities: ['Force Push', 'Lightsaber Combat', 'Piloting Ace'],
            unlockCost: { credits: 5000, materials: 2000, energy: 1000 }
        });
        this.addCharacter({
            id: 'obiwan_republic', name: 'Obi-Wan Kenobi', faction: Constants.FACTIONS.REPUBLIC,
            role: 'Jedi Master', rarity: 'legendary',
            stats: { attack: 90, defense: 90, speed: 85, leadership: 95 },
            abilities: ['Force Barrier', 'Master Duelist', 'Tactical Genius'],
            unlockCost: { credits: 5000, materials: 2000, energy: 1000 }
        });
        this.addCharacter({
            id: 'yoda', name: 'Yoda', faction: Constants.FACTIONS.REPUBLIC,
            role: 'Grand Master', rarity: 'legendary',
            stats: { attack: 85, defense: 80, speed: 95, leadership: 100 },
            abilities: ['Force Lightning', 'Wisdom', 'Battle Meditation'],
            unlockCost: { credits: 7500, materials: 3000, energy: 1500 }
        });
        this.addCharacter({
            id: 'macewindu', name: 'Mace Windu', faction: Constants.FACTIONS.REPUBLIC,
            role: 'Jedi Master', rarity: 'epic',
            stats: { attack: 95, defense: 85, speed: 88, leadership: 85 },
            abilities: ['Vaapad', 'Force Crush', 'Council Authority'],
            unlockCost: { credits: 4000, materials: 1500, energy: 800 }
        });

        // SEPARATISTAS
        this.addCharacter({
            id: 'dooku', name: 'Conde Dooku', faction: Constants.FACTIONS.SEPARATISTS,
            role: 'Sith Lord', rarity: 'legendary',
            stats: { attack: 92, defense: 82, speed: 87, leadership: 90 },
            abilities: ['Force Lightning', 'Makashi Style', 'Political Influence'],
            unlockCost: { credits: 5000, materials: 2000, energy: 1000 }
        });
        this.addCharacter({
            id: 'grievous', name: 'General Grievous', faction: Constants.FACTIONS.SEPARATISTS,
            role: 'Supreme Commander', rarity: 'epic',
            stats: { attack: 90, defense: 75, speed: 92, leadership: 85 },
            abilities: ['Quad Lightsaber', 'Cybernetic Enhancement', 'Tactical Droid Control'],
            unlockCost: { credits: 4000, materials: 1500, energy: 800 }
        });
        this.addCharacter({
            id: 'asajj', name: 'Asajj Ventress', faction: Constants.FACTIONS.SEPARATISTS,
            role: 'Dark Acolyte', rarity: 'rare',
            stats: { attack: 85, defense: 75, speed: 90, leadership: 70 },
            abilities: ['Dual Lightsabers', 'Force Choke', 'Assassin'],
            unlockCost: { credits: 2500, materials: 1000, energy: 500 }
        });

        // IMPERIO
        this.addCharacter({
            id: 'vader', name: 'Darth Vader', faction: Constants.FACTIONS.EMPIRE,
            role: 'Sith Lord', rarity: 'legendary',
            stats: { attack: 98, defense: 90, speed: 80, leadership: 95 },
            abilities: ['Force Choke', 'Lightsaber Mastery', 'Fear Aura'],
            unlockCost: { credits: 7500, materials: 3000, energy: 1500 }
        });
        this.addCharacter({
            id: 'palpatine', name: 'Emperador Palpatine', faction: Constants.FACTIONS.EMPIRE,
            role: 'Sith Emperor', rarity: 'legendary',
            stats: { attack: 90, defense: 75, speed: 70, leadership: 100 },
            abilities: ['Force Storm', 'Sith Lightning', 'Galactic Control'],
            unlockCost: { credits: 10000, materials: 5000, energy: 2500 }
        });
        this.addCharacter({
            id: 'thrawn', name: 'Gran Almirante Thrawn', faction: Constants.FACTIONS.EMPIRE,
            role: 'Grand Admiral', rarity: 'epic',
            stats: { attack: 80, defense: 85, speed: 75, leadership: 98 },
            abilities: ['Tactical Genius', 'Art Analysis', 'Fleet Command'],
            unlockCost: { credits: 5000, materials: 2000, energy: 1000 }
        });
        this.addCharacter({
            id: 'tarkin', name: 'Gran Moff Tarkin', faction: Constants.FACTIONS.EMPIRE,
            role: 'Governor', rarity: 'rare',
            stats: { attack: 60, defense: 70, speed: 65, leadership: 90 },
            abilities: ['Rule by Fear', 'Death Star Command', 'Political Power'],
            unlockCost: { credits: 3000, materials: 1200, energy: 600 }
        });

        // REBELI�N
        this.addCharacter({
            id: 'luke', name: 'Luke Skywalker', faction: Constants.FACTIONS.REBELLION,
            role: 'Jedi Knight', rarity: 'legendary',
            stats: { attack: 92, defense: 85, speed: 88, leadership: 90 },
            abilities: ['Force Sensitivity', 'Lightsaber Combat', 'X-Wing Pilot'],
            unlockCost: { credits: 5000, materials: 2000, energy: 1000 }
        });
        this.addCharacter({
            id: 'leia', name: 'Princesa Leia', faction: Constants.FACTIONS.REBELLION,
            role: 'General', rarity: 'epic',
            stats: { attack: 75, defense: 80, speed: 78, leadership: 95 },
            abilities: ['Diplomacy', 'Combat Training', 'Rebel Command'],
            unlockCost: { credits: 4000, materials: 1500, energy: 800 }
        });
        this.addCharacter({
            id: 'han', name: 'Han Solo', faction: Constants.FACTIONS.REBELLION,
            role: 'Smuggler', rarity: 'epic',
            stats: { attack: 85, defense: 75, speed: 90, leadership: 80 },
            abilities: ['Quick Draw', 'Piloting Ace', 'Lucky Shot'],
            unlockCost: { credits: 4000, materials: 1500, energy: 800 }
        });
        this.addCharacter({
            id: 'chewie', name: 'Chewbacca', faction: Constants.FACTIONS.REBELLION,
            role: 'Warrior', rarity: 'rare',
            stats: { attack: 90, defense: 85, speed: 70, leadership: 65 },
            abilities: ['Bowcaster', 'Co-Pilot', 'Mechanic'],
            unlockCost: { credits: 2500, materials: 1000, energy: 500 }
        });

        // PRIMERA ORDEN
        this.addCharacter({
            id: 'kylo', name: 'Kylo Ren', faction: Constants.FACTIONS.FIRST_ORDER,
            role: 'Supreme Leader', rarity: 'legendary',
            stats: { attack: 94, defense: 82, speed: 85, leadership: 88 },
            abilities: ['Force Freeze', 'Lightsaber Combat', 'Dark Side Rage'],
            unlockCost: { credits: 6000, materials: 2500, energy: 1200 }
        });
        this.addCharacter({
            id: 'hux', name: 'General Hux', faction: Constants.FACTIONS.FIRST_ORDER,
            role: 'General', rarity: 'rare',
            stats: { attack: 70, defense: 75, speed: 72, leadership: 85 },
            abilities: ['Starkiller Command', 'Discipline', 'Artillery Strike'],
            unlockCost: { credits: 3000, materials: 1200, energy: 600 }
        });

        // RESISTENCIA
        this.addCharacter({
            id: 'rey', name: 'Rey', faction: Constants.FACTIONS.RESISTANCE,
            role: 'Jedi', rarity: 'legendary',
            stats: { attack: 90, defense: 85, speed: 92, leadership: 85 },
            abilities: ['Force Projection', 'Staff Combat', 'Scavenger'],
            unlockCost: { credits: 5500, materials: 2200, energy: 1100 }
        });
        this.addCharacter({
            id: 'finn', name: 'Finn', faction: Constants.FACTIONS.RESISTANCE,
            role: 'Stormtrooper', rarity: 'rare',
            stats: { attack: 80, defense: 78, speed: 82, leadership: 75 },
            abilities: ['Combat Training', 'Blaster Expert', 'Defector'],
            unlockCost: { credits: 2500, materials: 1000, energy: 500 }
        });
        this.addCharacter({
            id: 'poe', name: 'Poe Dameron', faction: Constants.FACTIONS.RESISTANCE,
            role: 'Pilot', rarity: 'epic',
            stats: { attack: 85, defense: 75, speed: 95, leadership: 82 },
            abilities: ['X-Wing Ace', 'Quick Maneuvers', 'Resistance Leader'],
            unlockCost: { credits: 4000, materials: 1500, energy: 800 }
        });

        console.log(`[Characters] Cat�logo inicializado con ${this.roster.length} personajes`);
    },

    addCharacter(character) {
        this.roster.push({ ...character, level: 1, experience: 0, recruited: false });
    },

    getCharacter(id) { return this.roster.find(c => c.id === id) || null; },
    getByFaction(faction) { return this.roster.filter(c => c.faction === faction); },
    getByRarity(rarity) { return this.roster.filter(c => c.rarity === rarity); },

    recruit(id) {
        const character = this.getCharacter(id);
        if (!character || character.recruited) return false;
        if (!GameState.canAfford(character.unlockCost)) {
            console.warn('[Characters] Recursos insuficientes');
            return false;
        }
        GameState.payCosts(character.unlockCost);
        character.recruited = true;
        GameState.characters.recruited.push(id);
        console.log(`[Characters] ${character.name} reclutado`);
        EventBus.emit(Constants.EVENTS.CHARACTERS.RECRUIT, { character });
        return true;
    },

    render(ctx, width, height) {
        const recruitedCount = this.roster.filter(c => c.recruited).length;
        Renderer.drawText(ctx, {
            text: `Personajes: ${recruitedCount}/${this.roster.length}`,
            x: width / 2, y: 50, color: '#FFE81F', size: 24
        });
    }
};

window.Characters = Characters;