// js/ui/TurnStatusPanel.js
// Indicador visual aislado de turno, fase y puntos de mando.

const TurnStatusPanel = {
  turnInfo: null,
  nextTurnButton: null,
  refreshTimer: null,
  lastSignature: '',

  init() {
    if (this.turnInfo) {
      return;
    }

    this.turnInfo = document.getElementById('turn-info');
    this.nextTurnButton = document.getElementById('next-turn-btn');

    if (!this.turnInfo || !this.nextTurnButton) {
      return;
    }

    this.applyStyles();
    this.refresh();

    this.refreshTimer = window.setInterval(() => {
      this.refresh();
    }, 250);
  },

  getState() {
    if (typeof GameState === 'undefined' ||
        typeof GameState.getState !== 'function') {
      return {};
    }

    return GameState.getState() || {};
  },

  getTurnNumber(state) {
    const candidates = [
      state.turn,
      state.turnNumber,
      state.currentTurn
    ];

    const value = candidates.find(Number.isFinite);

    return value || 1;
  },

  getPhase(state) {
    const phase = state.turnPhase || state.phase || 'command';

    const labels = {
      command: 'MANDO',
      construction: 'CONSTRUIR',
      research: 'INVESTIGAR',
      military: 'MILITAR'
    };

    return {
      id: phase,
      label: labels[phase] || String(phase).toUpperCase()
    };
  },

  getCommandPoints(state) {
    const remaining = Number.isFinite(state.commandPoints)
      ? state.commandPoints
      : 0;

    const maximum = Number.isFinite(state.maxCommandPoints)
      ? state.maxCommandPoints
      : Number.isFinite(state.commandPointsMax)
        ? state.commandPointsMax
        : Math.max(3, remaining);

    return {
      remaining,
      maximum
    };
  },

  applyStyles() {
    Object.assign(this.nextTurnButton.style, {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '148px',
      minHeight: '76px',
      padding: '9px 32px 9px 12px',
      textAlign: 'left'
    });

    Object.assign(this.turnInfo.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '3px',
      lineHeight: '1.05'
    });
  },

  refresh() {
    if (!this.turnInfo || !this.nextTurnButton) {
      return;
    }

    const state = this.getState();
    const turn = this.getTurnNumber(state);
    const phase = this.getPhase(state);
    const commandPoints = this.getCommandPoints(state);

    const signature = [
      turn,
      phase.id,
      commandPoints.remaining,
      commandPoints.maximum
    ].join('|');

    if (signature === this.lastSignature) {
      return;
    }

    this.lastSignature = signature;

    this.turnInfo.innerHTML = '';

    const topLine = document.createElement('span');
    topLine.textContent = `T${turn} · ${phase.label}`;

    Object.assign(topLine.style, {
      color: '#1d8cff',
      fontSize: '16px',
      fontWeight: '800',
      letterSpacing: '0.2px'
    });

    this.turnInfo.appendChild(topLine);

    if (phase.id === 'command') {
      const bottomLine = document.createElement('span');
      bottomLine.textContent =
        `PM ${commandPoints.remaining}/${commandPoints.maximum}`;

      Object.assign(bottomLine.style, {
        color: commandPoints.remaining > 0
          ? '#a9c7ff'
          : '#ff9b9b',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.35px'
      });

      this.turnInfo.appendChild(bottomLine);
    }

    const actionLabel = phase.id === 'command'
      ? commandPoints.remaining > 0
        ? `Finalizar Mando: quedan ${commandPoints.remaining} PM.`
        : 'Finalizar fase de Mando.'
      : `Avanzar desde la fase de ${phase.label.toLowerCase()}.`;

    this.nextTurnButton.setAttribute('aria-label', actionLabel);
    this.nextTurnButton.title = actionLabel;
  }
};

window.TurnStatusPanel = TurnStatusPanel;

window.addEventListener('load', () => {
  TurnStatusPanel.init();
});
