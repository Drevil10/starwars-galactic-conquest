// js/ui/CommandPanel.js
// Panel HTML aislado para las acciones de la fase de Mando.

const CommandPanel = {
  root: null,
  planetId: null,
  refreshTimer: null,
  selectionWatcher: null,

  init() {
    if (this.root) {
      return;
    }

    this.root = document.createElement('section');
    this.root.id = 'command-panel';
    this.root.setAttribute('aria-live', 'polite');

    Object.assign(this.root.style, {
      position: 'absolute',
      left: '12px',
      right: '12px',
      top: 'auto',
      width: 'auto',
      maxWidth: 'none',
      display: 'none',
      padding: '12px',
      boxSizing: 'border-box',
      border: '2px solid #3e86dd',
      borderRadius: '4px',
      background: 'rgba(3, 7, 25, 0.97)',
      color: '#edf4ff',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 8px 22px rgba(0, 0, 0, 0.36)',
      zIndex: '20'
    });

    const gameArea = document.getElementById('game-area');

    if (gameArea) {
      gameArea.appendChild(this.root);
    } else {
      document.body.appendChild(this.root);
    }

    window.addEventListener('resize', () => {
      this.position();
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.position();
      }, 180);
    });

    this.watchSelection();
  },

  watchSelection() {
    if (this.selectionWatcher) {
      return;
    }

    this.selectionWatcher = window.setInterval(() => {
      const selectedId =
        typeof MapSystem !== 'undefined' &&
        MapSystem.selectedPlanet
          ? MapSystem.selectedPlanet.id
          : null;

      const phase =
        typeof CommandSystem !== 'undefined'
          ? CommandSystem.isCommandPhase()
          : false;

      const status =
        selectedId &&
        typeof TerritorySystem !== 'undefined' &&
        typeof TerritorySystem.getPlanetStatus === 'function'
          ? TerritorySystem.getPlanetStatus(selectedId)
          : null;

      if (
        selectedId !== this.planetId ||
        !phase ||
        status !== 'player'
      ) {
        this.planetId = selectedId;
        this.render();
      }
    }, 180);
  },

  position() {
    if (!this.root || this.root.style.display === 'none') {
      return;
    }

    const gameArea = document.getElementById('game-area');
    const canvas = document.getElementById('game-canvas');

    if (!gameArea || !canvas) {
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const areaRect = gameArea.getBoundingClientRect();

    const top =
      canvasRect.bottom -
      areaRect.top +
      10;

    this.root.style.top = `${Math.max(0, Math.round(top))}px`;
  },

  getPlanet() {
    if (
      !this.planetId ||
      typeof CommandSystem === 'undefined'
    ) {
      return null;
    }

    return CommandSystem.getPlanet(this.planetId);
  },

  getStatus() {
    if (
      !this.planetId ||
      typeof TerritorySystem === 'undefined' ||
      typeof TerritorySystem.getPlanetStatus !== 'function'
    ) {
      return null;
    }

    return TerritorySystem.getPlanetStatus(this.planetId);
  },

  button(label, action, disabled) {
    const button = document.createElement('button');

    button.type = 'button';
    button.textContent = label;
    button.disabled = disabled;

    Object.assign(button.style, {
      flex: '1 1 128px',
      minHeight: '39px',
      padding: '8px 10px',
      border: '1px solid #3e86dd',
      borderRadius: '4px',
      background: disabled
        ? '#16213d'
        : '#163f71',
      color: disabled
        ? '#7886a8'
        : '#f0f7ff',
      fontWeight: '700',
      fontSize: '11px',
      letterSpacing: '0.2px',
      cursor: disabled
        ? 'default'
        : 'pointer'
    });

    if (!disabled) {
      button.addEventListener(
        'click',
        action
      );
    }

    return button;
  },

  createHeader(commandPoints, defense) {
    const header = document.createElement('div');

    Object.assign(header.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '9px',
      color: '#8fb8ff',
      fontWeight: '700',
      fontSize: '11px',
      letterSpacing: '0.4px'
    });

    const title = document.createElement('span');
    title.textContent = 'ÓRDENES DE MANDO';

    const stats = document.createElement('span');
    stats.textContent =
      `PM: ${commandPoints} · DEF: ${defense}/5`;

    header.append(title, stats);

    return header;
  },

  createMessage(message, color) {
    const element = document.createElement('div');

    element.textContent = message;

    Object.assign(element.style, {
      marginTop: '9px',
      minHeight: '15px',
      color,
      fontSize: '11px',
      lineHeight: '1.35'
    });

    return element;
  },

  render(message = '', success = null) {
    this.init();

    const planet = this.getPlanet();
    const status = this.getStatus();

    const isCommandPhase =
      typeof CommandSystem !== 'undefined' &&
      CommandSystem.isCommandPhase();

    if (
      !planet ||
      status !== 'player' ||
      !isCommandPhase
    ) {
      this.root.style.display = 'none';
      return;
    }

    const commandPoints =
      CommandSystem.getCommandPoints();

    const defense =
      CommandSystem.getDefense(planet.id);

    const canSpend =
      commandPoints >= CommandSystem.actionCost;

    const fortifyDisabled =
      !canSpend ||
      defense >= CommandSystem.maxDefense;

    const capitalDisabled =
      !canSpend ||
      this.isCapital(planet.id);

    this.root.innerHTML = '';
    this.root.style.display = 'block';

    this.root.append(
      this.createHeader(
        commandPoints,
        defense
      )
    );

    const actions = document.createElement('div');

    Object.assign(actions.style, {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    });

    actions.append(
      this.button(
        `FORTIFICAR · ${CommandSystem.actionCost} PM`,
        () => {
          this.execute('fortifyPlanet');
        },
        fortifyDisabled
      ),
      this.button(
        `CAPITAL · ${CommandSystem.actionCost} PM`,
        () => {
          this.execute('setCapital');
        },
        capitalDisabled
      )
    );

    this.root.append(actions);

    if (!message) {
      if (defense >= CommandSystem.maxDefense) {
        message =
          'Defensa planetaria al máximo.';
      } else if (!canSpend) {
        message =
          'No quedan puntos de mando este turno.';
      } else {
        message =
          `Acciones disponibles para ${planet.name}.`;
      }
    }

    const color =
      success === true
        ? '#7be69d'
        : success === false
          ? '#ff9b9b'
          : '#aabce8';

    this.root.append(
      this.createMessage(
        message,
        color
      )
    );

    this.position();
  },

  isCapital(planetId) {
    if (
      typeof TerritorySystem !== 'undefined' &&
      typeof TerritorySystem.getPlayerCapital === 'function'
    ) {
      return (
        TerritorySystem.getPlayerCapital() === planetId
      );
    }

    const state =
      typeof GameState !== 'undefined'
        ? GameState.getState()
        : null;

    return state?.playerCapital === planetId;
  },

  execute(method) {
    if (
      !this.planetId ||
      typeof CommandSystem === 'undefined' ||
      typeof CommandSystem[method] !== 'function'
    ) {
      return;
    }

    const result =
      CommandSystem[method](this.planetId);

    this.render(
      result.message,
      result.allowed
    );

    if (typeof MapSystem !== 'undefined') {
      MapSystem.render();
    }
  }
};

window.CommandPanel = CommandPanel;

window.addEventListener('load', () => {
  CommandPanel.init();
});
