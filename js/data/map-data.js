// Datos del mapa galctico - Estructura base
// Fcil de editar: aadir/quitar planetas, cambiar recursos, rutas, etc.

const galaxyMap = {
  // Lista de sistemas estelares
  systems: [
    {
      id: 'coruscant-system',
      name: 'Sistema Coruscant',
      planets: [
        {
          id: 'coruscant',
          name: 'Coruscant',
          type: 'capital',
          resources: {
            credits: 100,
            minerals: 20,
            energy: 50,
            research: 30
          },
          owner: 'republic', // republic, empire, rebels, separatists, mandalorians, neutral
          position: { x: 400, y: 300 }, // posicin en el canvas
          routes: ['corellia', 'kuat', 'alderaan'] // rutas a otros planetas
        }
      ]
    },
    {
      id: 'corellia-system',
      name: 'Sistema Corellia',
      planets: [
        {
          id: 'corellia',
          name: 'Corellia',
          type: 'industrial',
          resources: {
            credits: 60,
            minerals: 80,
            energy: 40,
            research: 20
          },
          owner: 'republic',
          position: { x: 350, y: 350 },
          routes: ['coruscant', 'alderaan']
        }
      ]
    },
    {
      id: 'alderaan-system',
      name: 'Sistema Alderaan',
      planets: [
        {
          id: 'alderaan',
          name: 'Alderaan',
          type: 'agricultural',
          resources: {
            credits: 40,
            minerals: 30,
            energy: 30,
            research: 40
          },
          owner: 'republic',
          position: { x: 450, y: 350 },
          routes: ['coruscant', 'corellia', 'tatooine']
        }
      ]
    },
    {
      id: 'tatooine-system',
      name: 'Sistema Tatooine',
      planets: [
        {
          id: 'tatooine',
          name: 'Tatooine',
          type: 'desert',
          resources: {
            credits: 20,
            minerals: 50,
            energy: 60,
            research: 10
          },
          owner: 'neutral',
          position: { x: 500, y: 400 },
          routes: ['alderaan', 'naboo']
        }
      ]
    },
    {
      id: 'naboo-system',
      name: 'Sistema Naboo',
      planets: [
        {
          id: 'naboo',
          name: 'Naboo',
          type: 'agricultural',
          resources: {
            credits: 50,
            minerals: 40,
            energy: 40,
            research: 30
          },
          owner: 'republic',
          position: { x: 550, y: 450 },
          routes: ['tatooine', 'kamino']
        }
      ]
    },
    {
      id: 'kamino-system',
      name: 'Sistema Kamino',
      planets: [
        {
          id: 'kamino',
          name: 'Kamino',
          type: 'ocean',
          resources: {
            credits: 30,
            minerals: 20,
            energy: 30,
            research: 60
          },
          owner: 'republic',
          position: { x: 600, y: 500 },
          routes: ['naboo', 'geonosis']
        }
      ]
    },
    {
      id: 'geonosis-system',
      name: 'Sistema Geonosis',
      planets: [
        {
          id: 'geonosis',
          name: 'Geonosis',
          type: 'industrial',
          resources: {
            credits: 40,
            minerals: 100,
            energy: 50,
            research: 20
          },
          owner: 'separatists',
          position: { x: 650, y: 550 },
          routes: ['kamino', 'utapau']
        }
      ]
    },
    {
      id: 'utapau-system',
      name: 'Sistema Utapau',
      planets: [
        {
          id: 'utapau',
          name: 'Utapau',
          type: 'barren',
          resources: {
            credits: 30,
            minerals: 60,
            energy: 40,
            research: 20
          },
          owner: 'neutral',
          position: { x: 700, y: 600 },
          routes: ['geonosis', 'mustafar']
        }
      ]
    },
    {
      id: 'mustafar-system',
      name: 'Sistema Mustafar',
      planets: [
        {
          id: 'mustafar',
          name: 'Mustafar',
          type: 'volcanic',
          resources: {
            credits: 20,
            minerals: 120,
            energy: 80,
            research: 10
          },
          owner: 'separatists',
          position: { x: 750, y: 650 },
          routes: ['utapau', 'kashyyyk']
        }
      ]
    },
    {
      id: 'kashyyyk-system',
      name: 'Sistema Kashyyyk',
      planets: [
        {
          id: 'kashyyyk',
          name: 'Kashyyyk',
          type: 'forest',
          resources: {
            credits: 40,
            minerals: 70,
            energy: 50,
            research: 30
          },
          owner: 'republic',
          position: { x: 800, y: 700 },
          routes: ['mustafar', 'ryloth']
        }
      ]
    },
    {
      id: 'ryloth-system',
      name: 'Sistema Ryloth',
      planets: [
        {
          id: 'ryloth',
          name: 'Ryloth',
          type: 'barren',
          resources: {
            credits: 30,
            minerals: 50,
            energy: 40,
            research: 20
          },
          owner: 'neutral',
          position: { x: 850, y: 750 },
          routes: ['kashyyyk', 'lothal']
        }
      ]
    },
    {
      id: 'lothal-system',
      name: 'Sistema Lothal',
      planets: [
        {
          id: 'lothal',
          name: 'Lothal',
          type: 'agricultural',
          resources: {
            credits: 40,
            minerals: 40,
            energy: 40,
            research: 30
          },
          owner: 'empire',
          position: { x: 900, y: 800 },
          routes: ['ryloth', 'mandalore']
        }
      ]
    },
    {
      id: 'mandalore-system',
      name: 'Sistema Mandalore',
      planets: [
        {
          id: 'mandalore',
          name: 'Mandalore',
          type: 'barren',
          resources: {
            credits: 50,
            minerals: 80,
            energy: 60,
            research: 40
          },
          owner: 'mandalorians',
          position: { x: 950, y: 850 },
          routes: ['lothal', 'hoth']
        }
      ]
    },
    {
      id: 'hoth-system',
      name: 'Sistema Hoth',
      planets: [
        {
          id: 'hoth',
          name: 'Hoth',
          type: 'ice',
          resources: {
            credits: 20,
            minerals: 90,
            energy: 30,
            research: 10
          },
          owner: 'rebels',
          position: { x: 1000, y: 900 },
          routes: ['mandalore', 'endor']
        }
      ]
    },
    {
      id: 'endor-system',
      name: 'Sistema Endor',
      planets: [
        {
          id: 'endor',
          name: 'Endor',
          type: 'forest',
          resources: {
            credits: 30,
            minerals: 40,
            energy: 40,
            research: 30
          },
          owner: 'neutral',
          position: { x: 1050, y: 950 },
          routes: ['hoth', 'jakku']
        }
      ]
    },
    {
      id: 'jakku-system',
      name: 'Sistema Jakku',
      planets: [
        {
          id: 'jakku',
          name: 'Jakku',
          type: 'desert',
          resources: {
            credits: 20,
            minerals: 50,
            energy: 40,
            research: 10
          },
          owner: 'neutral',
          position: { x: 1100, y: 1000 },
          routes: ['endor']
        }
      ]
    }
  ],

  // Facciones disponibles
  factions: {
    republic: {
      name: 'Repblica Galctica',
      color: '#0066cc',
      bonus: 'research'
    },
    empire: {
      name: 'Imperio Galctico',
      color: '#cc0000',
      bonus: 'minerals'
    },
    rebels: {
      name: 'Alianza Rebelde',
      color: '#00cc00',
      bonus: 'energy'
    },
    separatists: {
      name: 'Confederacin de Sistemas Independientes',
      color: '#ff9900',
      bonus: 'credits'
    },
    mandalorians: {
      name: 'Clanes Mandalorianos',
      color: '#9900cc',
      bonus: 'energy'
    },
    neutral: {
      name: 'Neutral',
      color: '#666666',
      bonus: 'none'
    }
  }
};
