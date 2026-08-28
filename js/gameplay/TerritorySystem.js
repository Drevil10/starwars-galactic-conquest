const TerritorySystem = {
  playerFactionId: null,

  factions: {
    empire: { name: 'Imperio Galactico', capital: 'coruscant' },
    rebels: { name: 'Alianza Rebelde', capital: 'yavin-iv' },
    separatists: { name: 'Confederacion de Sistemas Independientes', capital: 'geonosis' },
    mandalorians: { name: 'Clanes Mandalorianos', capital: 'mandalore' }
  },

  init(factionId) {
    if (!this.factions[factionId]) return false;
    this.playerFactionId = factionId;
    return true;
  },

  allPlanets() {
    if (!window.galaxyMap || !Array.isArray(window.galaxyMap.systems)) return [];
    return window.galaxyMap.systems.flatMap(system => system.planets || []);
  },

  getPlanet(planetId) {
    return this.allPlanets().find(planet => planet.id === planetId) || null;
  },

  getControlledPlanetIds() {
    if (typeof GameState === 'undefined' || typeof GameState.getState !== 'function') return [];
    const state = GameState.getState();
    return Array.isArray(state.controlledPlanets) ? state.controlledPlanets : [];
  },

  getPlanetOwner(planetId) {
    return this.getPlanet(planetId)?.owner || 'neutral';
  },

  isPlayableFaction(factionId) {
    return Object.prototype.hasOwnProperty.call(this.factions, factionId);
  },

  isPlayerPlanet(planetId) {
    const controlled = this.getControlledPlanetIds();
    if (controlled.length > 0) return controlled.includes(planetId);
    return Boolean(this.playerFactionId && this.getPlanetOwner(planetId) === this.playerFactionId);
  },

  isEnemyPlanet(planetId) {
    const owner = this.getPlanetOwner(planetId);
    return this.isPlayableFaction(owner) && !this.isPlayerPlanet(planetId);
  },

  isNeutralPlanet(planetId) {
    return !this.isPlayerPlanet(planetId) && !this.isEnemyPlanet(planetId);
  },

  getPlanetStatus(planetId) {
    if (this.isPlayerPlanet(planetId)) return 'player';
    if (this.isEnemyPlanet(planetId)) return 'enemy';
    return 'neutral';
  },

  getPlayerCapital() {
    return this.playerFactionId ? this.factions[this.playerFactionId].capital : null;
  },

  getPlanetResources(planetId) {
    return this.getPlanet(planetId)?.resources || null;
  },

  getPlanetRoutes(planetId) {
    return this.getPlanet(planetId)?.routes || [];
  },

  getPlanetType(planetId) {
    return this.getPlanet(planetId)?.type || null;
  },

  getFactionName(factionId) {
    if (window.galaxyMap?.factions?.[factionId]?.name) {
      return window.galaxyMap.factions[factionId].name;
    }
    return this.factions[factionId]?.name || 'Desconocida';
  }
};

window.TerritorySystem = TerritorySystem;