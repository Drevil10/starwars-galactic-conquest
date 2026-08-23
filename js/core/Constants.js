/**
 * Constants.js
 * Configuracion global y valores constantes del juego
 */

const Constants = {
    GAME: {
        TITLE: 'Star Wars: Galactic Conquest',
        VERSION: '1.0.0',
        SAVE_KEY: 'sw_galactic_conquest_save',
        SAVE_VERSION: 1
    },

    RESOURCES: {
        CREDITS: 'credits',
        MATERIALS: 'materials',
        ENERGY: 'energy'
    },

    RESOURCE_CONFIG: {
        credits: {
            name: 'Creditos',
            icon: 'C',
            color: '#FFE81F',
            maxCapacity: 10000
        },
        materials: {
            name: 'Materiales',
            icon: 'M',
            color: '#4CAF50',
            maxCapacity: 5000
        },
        energy: {
            name: 'Energia',
            icon: 'E',
            color: '#2196F3',
            maxCapacity: 3000
        }
    },

    FACTIONS: {
        REPUBLIC: 'republic',
        SEPARATISTS: 'separatists',
        EMPIRE: 'empire',
        REBELLION: 'rebellion',
        FIRST_ORDER: 'first_order',
        RESISTANCE: 'resistance'
    },

    FACTION_CONFIG: {
        republic: {
            name: 'Republica Galactica',
            color: '#1E3A8A',
            icon: '🔵'
        },
        separatists: {
            name: 'Separatistas',
            color: '#DC2626',
            icon: '🔴'
        },
        empire: {
            name: 'Imperio Galactico',
            color: '#1F2937',
            icon: '⚫'
        },
        rebellion: {
            name: 'Alianza Rebelde',
            color: '#F59E0B',
            icon: '🟠'
        },
        first_order: {
            name: 'Primera Orden',
            color: '#7F1D1D',
            icon: '🔴'
        },
        resistance: {
            name: 'Resistencia',
            color: '#3B82F6',
            icon: '🔵'
        }
    },

    SCREENS: {
        START: 'start-screen',
        GAME: 'game-screen'
    },

    TABS: {
        BASE: 'base',
        CHARACTERS: 'characters',
        SHIPS: 'ships',
        EXPLORE: 'explore',
        MISSIONS: 'missions'
    },

    CANVAS: {
        MIN_WIDTH: 800,
        MIN_HEIGHT: 600,
        FPS: 60
    },

    EVENTS: {
        NAVIGATION: {
            CHANGE_TAB: 'navigation:change_tab',
            SCREEN_CHANGE: 'navigation:screen_change'
        },
        GAME: {
            START: 'game:start',
            LOAD: 'game:load',
            SAVE: 'game:save',
            UPDATE: 'game:update',
            RENDER: 'game:render'
        },
        RESOURCES: {
            UPDATE: 'resources:update',
            CHANGE: 'resources:change'
        },
        BASE: {
            BUILD: 'base:build',
            UPGRADE: 'base:upgrade',
            COLLECT: 'base:collect'
        },
        CHARACTERS: {
            RECRUIT: 'characters:recruit',
            ASSIGN: 'characters:assign',
            LEVEL_UP: 'characters:level_up'
        },
        SHIPS: {
            BUILD: 'ships:build',
            UPGRADE: 'ships:upgrade',
            DEPLOY: 'ships:deploy'
        },
        EXPLORE: {
            START: 'explore:start',
            COMPLETE: 'explore:complete',
            ENCOUNTER: 'explore:encounter'
        },
        UI: {
            UPDATE_RESOURCES: 'ui:update_resources',
            SHOW_NOTIFICATION: 'ui:show_notification',
            OPEN_MODAL: 'ui:open_modal',
            CLOSE_MODAL: 'ui:close_modal'
        }
    },

    BALANCE: {
        RESOURCE_PRODUCTION: {
            credits: 10,
            materials: 5,
            energy: 3
        },
        BUILDING_COSTS: {
            credits: 100,
            materials: 50,
            energy: 25
        },
        MISSION_REWARDS: {
            easy: { credits: 50, materials: 25, energy: 10 },
            medium: { credits: 150, materials: 75, energy: 30 },
            hard: { credits: 300, materials: 150, energy: 60 }
        }
    }
};

window.Constants = Constants;