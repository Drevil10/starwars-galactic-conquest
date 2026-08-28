// js/gameplay/CommandSystem.js
// Lógica aislada para las acciones de la fase de Mando.

const CommandSystem = {
  maxDefense: 5,
  actionCost: 1,

  getState() {
    if (typeof GameState === 'undefined') {
      return null;
    }

    return GameState.getState();
  },

  getPlanet(planetId) {
    if (
      !window.galaxyMap ||
      !Array.isArray(window.galaxyMap.systems)
    ) {
      return null;
    }

    for (const system of window.galaxyMap.systems) {
      const planet = (system.planets || []).find(
        candidate => candidate.id === planetId
      );

      if (planet) {
        return planet;
      }
    }

    return null;
  },

  getCommandPoints() {
    const state = this.getState();

    return Number.isFinite(state?.commandPoints)
      ? state.commandPoints
      : 0;
  },

  getDefense(planetId) {
    const state = this.getState();
    const defenses = state?.planetDefenses || {};

    return Number.isFinite(defenses[planetId])
      ? defenses[planetId]
      : 0;
  },

  isCommandPhase() {
    const state = this.getState();

    return state?.turnPhase === 'command';
  },

  isPlayerPlanet(planetId) {
    if (
      typeof TerritorySystem === 'undefined' ||
      typeof TerritorySystem.getPlanetStatus !== 'function'
    ) {
      return false;
    }

    return TerritorySystem.getPlanetStatus(planetId) === 'player';
  },

  canUseCommandAction(planetId) {
    if (!this.isCommandPhase()) {
      return {
        allowed: false,
        message: 'Las órdenes solo pueden emitirse durante la fase de Mando.'
      };
    }

    if (!this.getPlanet(planetId)) {
      return {
        allowed: false,
        message: 'El planeta seleccionado no existe.'
      };
    }

    if (!this.isPlayerPlanet(planetId)) {
      return {
        allowed: false,
        message: 'Solo puedes dar órdenes a planetas bajo tu control.'
      };
    }

    if (this.getCommandPoints() < this.actionCost) {
      return {
        allowed: false,
        message: 'No tienes suficientes puntos de mando.'
      };
    }

    return {
      allowed: true,
      message: ''
    };
  },

  updateState(changes) {
    if (typeof GameState === 'undefined') {
      return false;
    }

    if (typeof GameState.setState === 'function') {
      GameState.setState(changes);
      return true;
    }

    const state = GameState.getState();

    Object.assign(state, changes);

    if (typeof GameState.save === 'function') {
      GameState.save();
    }

    return true;
  },

  spendCommandPoint() {
    const currentPoints = this.getCommandPoints();

    if (currentPoints < this.actionCost) {
      return false;
    }

    return this.updateState({
      commandPoints: currentPoints - this.actionCost
    });
  },

  fortifyPlanet(planetId) {
    const validation = this.canUseCommandAction(planetId);

    if (!validation.allowed) {
      return validation;
    }

    const currentDefense = this.getDefense(planetId);

    if (currentDefense >= this.maxDefense) {
      return {
        allowed: false,
        message: 'La defensa de este planeta ya está al máximo.'
      };
    }

    const state = this.getState();
    const defenses = {
      ...(state?.planetDefenses || {}),
      [planetId]: currentDefense + 1
    };

    if (!this.spendCommandPoint()) {
      return {
        allowed: false,
        message: 'No se ha podido gastar el punto de mando.'
      };
    }

    this.updateState({
      planetDefenses: defenses
    });

    const planet = this.getPlanet(planetId);

    return {
      allowed: true,
      message: `${planet.name} ha sido fortificado. Defensa: ${currentDefense + 1}/${this.maxDefense}.`,
      defense: currentDefense + 1,
      commandPoints: this.getCommandPoints()
    };
  },

  setCapital(planetId) {
    const validation = this.canUseCommandAction(planetId);

    if (!validation.allowed) {
      return validation;
    }

    const state = this.getState();

    if (state?.playerCapital === planetId) {
      return {
        allowed: false,
        message: 'Este planeta ya es tu capital.'
      };
    }

    if (!this.spendCommandPoint()) {
      return {
        allowed: false,
        message: 'No se ha podido gastar el punto de mando.'
      };
    }

    this.updateState({
      playerCapital: planetId
    });

    const planet = this.getPlanet(planetId);

    return {
      allowed: true,
      message: `${planet.name} es ahora la capital de tu facción.`,
      commandPoints: this.getCommandPoints()
    };
  }
};

window.CommandSystem = CommandSystem;
