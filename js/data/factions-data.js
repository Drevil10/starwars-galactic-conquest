// js/data/factions-data.js
// Datos iniciales de las facciones jugables.

window.FactionData = {
    imperial: {
        id: 'imperial',
        name: 'Imperio Galáctico',
        shortName: 'Imperio',
        capital: 'coruscant',
        color: '#e53935',

        emblem: 'assets/effects/imperial-symbol.svg',
        emblemAlt: 'Emblema del Imperio Galáctico',

        description:
            'Un poder centralizado con una economía fuerte, defensas sólidas y acceso futuro a la maquinaria militar imperial.',

        playstyle:
            'Expansión militar, fortificación de sistemas clave y control de rutas estratégicas.',

        startingResources: {
            credits: 150,
            minerals: 80,
            energy: 120,
            research: 20
        },

        startingPlanets: [
            'coruscant',
            'corellia',
            'alderaan'
        ],

        startingFleets: [
            {
                id: 'imperial-first-fleet',
                name: 'Primera Flota Imperial',
                location: 'coruscant',
                owner: 'imperial',
                ships: {
                    starDestroyer: 1,
                    tieFighter: 6,
                    transport: 1
                }
            }
        ],

        startingMission: {
            id: 'imperial-secure-core',
            title: 'Asegurar el Núcleo',
            description:
                'Consolida el control imperial sobre el Núcleo y prepara la expansión hacia los sistemas fronterizos.'
        }
    },

    rebel: {
        id: 'rebel',
        name: 'Alianza Rebelde',
        shortName: 'Rebelión',
        capital: 'yavin-iv',
        color: '#43a047',

        emblem: 'assets/effects/rebel-symbol.svg',
        emblemAlt: 'Emblema de la Alianza Rebelde',

        description:
            'Una alianza de mundos libres que compensa su menor poder militar inicial con movilidad, investigación y determinación.',

        playstyle:
            'Movilidad, desarrollo tecnológico y conquista de sistemas vulnerables.',

        startingResources: {
            credits: 100,
            minerals: 60,
            energy: 110,
            research: 45
        },

        startingPlanets: [
            'yavin-iv',
            'yavin-prime',
            'kashyyyk'
        ],

        startingFleets: [
            {
                id: 'rebel-task-force',
                name: 'Grupo de Combate Rebelde',
                location: 'yavin-iv',
                owner: 'rebel',
                ships: {
                    monCalamariCruiser: 1,
                    xWing: 5,
                    transport: 1
                }
            }
        ],

        startingMission: {
            id: 'rebel-spark-hope',
            title: 'Encender la Esperanza',
            description:
                'Protege Yavin IV, fortalece tus rutas y libera sistemas estratégicos del control imperial.'
        }
    },

    separatist: {
        id: 'separatist',
        name: 'Confederación Separatista',
        shortName: 'Separatistas',
        capital: 'geonosis',
        color: '#f57c00',

        emblem: 'assets/effects/separatist-symbol.svg',
        emblemAlt: 'Emblema de la Confederación Separatista',

        description:
            'Una alianza industrial que domina la producción pesada, los droides de combate y las economías de guerra.',

        playstyle:
            'Producción industrial, flotas de droides y conquista mediante superioridad numérica.',

        startingResources: {
            credits: 125,
            minerals: 105,
            energy: 85,
            research: 25
        },

        startingPlanets: [
            'geonosis',
            'mustafar',
            'utapau'
        ],

        startingFleets: [
            {
                id: 'separatist-assault-fleet',
                name: 'Flota de Asalto Separatista',
                location: 'geonosis',
                owner: 'separatist',
                ships: {
                    lucrehulk: 1,
                    vultureDroid: 8,
                    transport: 1
                }
            }
        ],

        startingMission: {
            id: 'separatist-forge-war',
            title: 'Forjar la Guerra',
            description:
                'Asegura Geonosis y Mustafar, amplía la producción de droides y abre una ruta de expansión hacia el Borde Exterior.'
        }
    },

    mandalorian: {
        id: 'mandalorian',
        name: 'Clanes Mandalorianos',
        shortName: 'Mandalorianos',
        capital: 'mandalore',
        color: '#8e44ad',

        emblem: 'assets/effects/mandalorian-symbol.svg',
        emblemAlt: 'Emblema de los Clanes Mandalorianos',

        description:
            'Clanes guerreros que combinan disciplina militar, tecnología propia y una expansión basada en la fuerza.',

        playstyle:
            'Fuerza militar, movilidad de élite y control de territorios estratégicos.',

        startingResources: {
            credits: 115,
            minerals: 95,
            energy: 75,
            research: 25
        },

        startingPlanets: [
            'mandalore',
            'ryloth',
            'felucia'
        ],

        startingFleets: [
            {
                id: 'mandalorian-war-clan',
                name: 'Clan de Guerra Mandaloriano',
                location: 'mandalore',
                owner: 'mandalorian',
                ships: {
                    mandalorianCruiser: 1,
                    fangFighter: 6,
                    transport: 1
                }
            }
        ],

        startingMission: {
            id: 'mandalorian-honor-clans',
            title: 'Honor de los Clanes',
            description:
                'Refuerza Mandalore, reúne a los clanes dispersos y asegura las rutas hacia los sistemas del Borde Medio.'
        }
    }
};