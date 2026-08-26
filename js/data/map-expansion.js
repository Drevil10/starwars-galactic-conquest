// Primera expansión de sistemas galácticos.
const galacticExpansion = {
  systems: [
    { id: 'bespin-system', name: 'Sistema Bespin', planets: [{ id: 'bespin', name: 'Bespin', type: 'gas', owner: 'neutral', position: { x: 1230, y: 540 }, resources: { credits: 110, minerals: 25, energy: 90, research: 20 }, routes: ['hoth', 'endor'] }] },
    { id: 'scarif-system', name: 'Sistema Scarif', planets: [{ id: 'scarif', name: 'Scarif', type: 'tropical', owner: 'empire', position: { x: 1040, y: 980 }, resources: { credits: 70, minerals: 40, energy: 55, research: 120 }, routes: ['jedha', 'lothal'] }] },
    { id: 'jedha-system', name: 'Sistema Jedha', planets: [{ id: 'jedha', name: 'Jedha', type: 'holy', owner: 'neutral', position: { x: 760, y: 1080 }, resources: { credits: 35, minerals: 45, energy: 35, research: 100 }, routes: ['geonosis', 'scarif'] }] },
    { id: 'ahch-to-system', name: 'Sistema Ahch-To', planets: [{ id: 'ahch-to', name: 'Ahch-To', type: 'ocean', owner: 'neutral', position: { x: 1320, y: 800 }, resources: { credits: 25, minerals: 20, energy: 60, research: 110 }, routes: ['endor', 'crait'] }] },
    { id: 'crait-system', name: 'Sistema Crait', planets: [{ id: 'crait', name: 'Crait', type: 'salt', owner: 'rebels', position: { x: 1290, y: 350 }, resources: { credits: 30, minerals: 90, energy: 35, research: 30 }, routes: ['ahch-to', 'hoth'] }] },
    { id: 'exegol-system', name: 'Sistema Exegol', planets: [{ id: 'exegol', name: 'Exegol', type: 'storm', owner: 'empire', position: { x: 980, y: 1140 }, resources: { credits: 60, minerals: 75, energy: 100, research: 130 }, routes: ['jakku', 'mustafar'] }] }
  ]
};

if (typeof galaxyMap !== 'undefined' && Array.isArray(galaxyMap.systems)) {
  const existing = new Set(galaxyMap.systems.map(system => system.id));
  galacticExpansion.systems.forEach(system => {
    if (!existing.has(system.id)) galaxyMap.systems.push(system);
  });
}
