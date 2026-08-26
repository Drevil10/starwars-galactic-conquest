// Expansión de sistemas galácticos.
// map-data.js contiene 16 sistemas base, incluidos Lothal y Mustafar.
// Este archivo añade 16 sistemas nuevos, para un total de 32.

const galacticExpansion = {
  systems: [
    {
      id: 'bespin-system',
      name: 'Sistema Bespin',
      planets: [{
        id: 'bespin',
        name: 'Bespin',
        type: 'gas',
        owner: 'neutral',
        position: { x: 1230, y: 540 },
        resources: { credits: 110, minerals: 25, energy: 90, research: 20 },
        routes: ['hoth', 'endor', 'sullust']
      }]
    },

    {
      id: 'scarif-system',
      name: 'Sistema Scarif',
      planets: [{
        id: 'scarif',
        name: 'Scarif',
        type: 'tropical',
        owner: 'empire',
        position: { x: 1040, y: 980 },
        resources: { credits: 70, minerals: 40, energy: 55, research: 120 },
        routes: ['jedha', 'lothal', 'ord-mantell']
      }]
    },

    {
      id: 'jedha-system',
      name: 'Sistema Jedha',
      planets: [{
        id: 'jedha',
        name: 'Jedha',
        type: 'holy',
        owner: 'neutral',
        position: { x: 760, y: 1080 },
        resources: { credits: 35, minerals: 45, energy: 35, research: 100 },
        routes: ['geonosis', 'scarif', 'dathomir']
      }]
    },

    {
      id: 'ahch-to-system',
      name: 'Sistema Ahch-To',
      planets: [{
        id: 'ahch-to',
        name: 'Ahch-To',
        type: 'ocean',
        owner: 'neutral',
        position: { x: 1320, y: 800 },
        resources: { credits: 25, minerals: 20, energy: 60, research: 110 },
        routes: ['endor', 'crait']
      }]
    },

    {
      id: 'crait-system',
      name: 'Sistema Crait',
      planets: [{
        id: 'crait',
        name: 'Crait',
        type: 'salt',
        owner: 'rebels',
        position: { x: 1290, y: 350 },
        resources: { credits: 30, minerals: 90, energy: 35, research: 30 },
        routes: ['ahch-to', 'hoth', 'ilum']
      }]
    },

    {
      id: 'exegol-system',
      name: 'Sistema Exegol',
      planets: [{
        id: 'exegol',
        name: 'Exegol',
        type: 'storm',
        owner: 'empire',
        position: { x: 980, y: 1140 },
        resources: { credits: 60, minerals: 75, energy: 100, research: 130 },
        routes: ['jakku', 'mustafar', 'moraband', 'ord-mantell']
      }]
    },

    {
      id: 'dathomir-system',
      name: 'Sistema Dathomir',
      planets: [{
        id: 'dathomir',
        name: 'Dathomir',
        type: 'forest',
        owner: 'neutral',
        position: { x: 610, y: 980 },
        resources: { credits: 35, minerals: 65, energy: 70, research: 85 },
        routes: ['jedha', 'geonosis', 'yavin-iv', 'moraband', 'felucia']
      }]
    },

    {
      id: 'yavin-iv-system',
      name: 'Sistema Yavin IV',
      planets: [{
        id: 'yavin-iv',
        name: 'Yavin IV',
        type: 'jungle',
        owner: 'rebels',
        position: { x: 520, y: 760 },
        resources: { credits: 45, minerals: 35, energy: 65, research: 90 },
        routes: ['dathomir', 'kashyyyk', 'yavin-prime', 'naboo-moon']
      }]
    },

    {
      id: 'ilum-system',
      name: 'Sistema Ilum',
      planets: [{
        id: 'ilum',
        name: 'Ilum',
        type: 'ice',
        owner: 'neutral',
        position: { x: 1120, y: 260 },
        resources: { credits: 30, minerals: 80, energy: 55, research: 120 },
        routes: ['crait', 'hoth']
      }]
    },

    {
      id: 'moraband-system',
      name: 'Sistema Moraband',
      planets: [{
        id: 'moraband',
        name: 'Moraband',
        type: 'barren',
        owner: 'neutral',
        position: { x: 650, y: 1180 },
        resources: { credits: 40, minerals: 70, energy: 55, research: 125 },
        routes: ['dathomir', 'exegol']
      }]
    },

    {
      id: 'yavin-prime-system',
      name: 'Sistema Yavin Prime',
      planets: [{
        id: 'yavin-prime',
        name: 'Yavin Prime',
        type: 'gas',
        owner: 'rebels',
        position: { x: 430, y: 820 },
        resources: { credits: 55, minerals: 20, energy: 95, research: 40 },
        routes: ['yavin-iv', 'tatooine', 'kessel']
      }]
    },

    {
      id: 'kessel-system',
      name: 'Sistema Kessel',
      planets: [{
        id: 'kessel',
        name: 'Kessel',
        type: 'mining',
        owner: 'neutral',
        position: { x: 380, y: 620 },
        resources: { credits: 95, minerals: 110, energy: 35, research: 30 },
        routes: ['corellia', 'yavin-prime']
      }]
    },

    {
      id: 'naboo-moon-system',
      name: 'Sistema Luna de Naboo',
      planets: [{
        id: 'naboo-moon',
        name: 'Luna de Naboo',
        type: 'ocean',
        owner: 'republic',
        position: { x: 540, y: 560 },
        resources: { credits: 35, minerals: 30, energy: 70, research: 70 },
        routes: ['naboo', 'yavin-iv']
      }]
    },

    {
      id: 'sullust-system',
      name: 'Sistema Sullust',
      planets: [{
        id: 'sullust',
        name: 'Sullust',
        type: 'volcanic',
        owner: 'empire',
        position: { x: 1080, y: 700 },
        resources: { credits: 70, minerals: 105, energy: 100, research: 40 },
        routes: ['bespin', 'endor']
      }]
    },

    {
      id: 'felucia-system',
      name: 'Sistema Felucia',
      planets: [{
        id: 'felucia',
        name: 'Felucia',
        type: 'jungle',
        owner: 'neutral',
        position: { x: 820, y: 880 },
        resources: { credits: 40, minerals: 45, energy: 75, research: 90 },
        routes: ['dathomir', 'ryloth']
      }]
    },

    {
      id: 'ord-mantell-system',
      name: 'Sistema Ord Mantell',
      planets: [{
        id: 'ord-mantell',
        name: 'Ord Mantell',
        type: 'industrial',
        owner: 'neutral',
        position: { x: 1160, y: 1060 },
        resources: { credits: 100, minerals: 85, energy: 60, research: 35 },
        routes: ['scarif', 'exegol']
      }]
    }
  ]
};

// Evita duplicados si este archivo se carga más de una vez.
if (typeof galaxyMap !== 'undefined' && Array.isArray(galaxyMap.systems)) {
  const existing = new Set(galaxyMap.systems.map(system => system.id));

  galacticExpansion.systems.forEach(system => {
    if (!existing.has(system.id)) {
      galaxyMap.systems.push(system);
    }
  });
}
