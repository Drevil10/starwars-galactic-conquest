// js/data/factions-data.js
// Datos iniciales de las facciones jugables.

window.FactionData = {
    imperial: {
        id: 'imperial',
        name: 'Imperio Galáctico',
        shortName: 'Imperio',
        capital: 'coruscant',
        color: '#e53935',
        icon: '⚔️',

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
        icon: '✦',

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
    }
};
