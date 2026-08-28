// js/gameplay/TurnPhaseSystem.js
// Ciclo base: Mando -> Construir -> Investigar -> Militar -> fin de turno.

const TurnPhaseSystem = {
  phases: [
    {
      id: 'command',
      label: 'Mando',
      compactLabel: 'Mando',
      tab: 'map'
    },
    {
      id: 'construction',
      label: 'Construir',
      compactLabel: 'Const.',
      tab: 'build'
    },
    {
      id: 'research',
      label: 'Investigar',
      compactLabel: 'Invest.',
      tab: 'research'
    },
    {
      id: 'military',
      label: 'Militar',
      compactLabel: 'Militar',
      tab: 'military'
    }
  ],

  commandPointsPerTurn: 3,
  installed: false,

  install() {
    if (
      this.installed ||
      typeof GameState === 'undefined' ||
      typeof TurnSystem === 'undefined' ||
      typeof CampaignSystem === 'undefined'
    ) {
      return;
    }

    this.installed = true;

    this.hideTurnDecorations();
    this.patchCampaignStart();
    this.patchTurnAdvance();
    this.patchTurnLabel();
    this.scheduleUIRefresh();
  },

  hideTurnDecorations() {
    if (document.getElementById('turn-phase-mobile-fix')) {
      return;
    }

    const style = document.createElement('style');

    style.id = 'turn-phase-mobile-fix';

    style.textContent = `
      #next-turn-btn .resource-icon,
      #next-turn-btn .turn-arrow {
        display: none;
      }

      #next-turn-btn #turn-info {
        white-space: nowrap;
      }
    `;

    document.head.appendChild(style);
  },

  patchCampaignStart() {
    const originalStartCampaign = CampaignSystem.startCampaign.bind(
      CampaignSystem
    );

    CampaignSystem.startCampaign = factionId => {
      const result = originalStartCampaign(factionId);

      if (result && result.success) {
        GameState.setState({
          turnPhase: 'command',
          commandPoints: this.commandPointsPerTurn,
          completedPhases: [],
          turnLog: []
        });

        this.scheduleUIRefresh();
      }

      return result;
    };
  },

  patchTurnAdvance() {
    const originalNextTurn = TurnSystem.nextTurn.bind(TurnSystem);

    TurnSystem.nextTurn = () => {
      const state = GameState.getState();
      const phase = state.turnPhase || 'command';

      const phaseIndex = this.phases.findIndex(
        item => item.id === phase
      );

      const nextPhase = this.phases[phaseIndex + 1];

      // Aún quedan fases dentro del turno actual.
      if (nextPhase) {
        GameState.setState({
          turnPhase: nextPhase.id,

          completedPhases: [
            ...new Set([
              ...(state.completedPhases || []),
              phase
            ])
          ],

          turnLog: [
            ...(state.turnLog || []),
            `Fase completada: ${this.getPhase(phase).label}`
          ]
        });

        this.openPhaseTab(nextPhase.tab);
        this.scheduleUIRefresh();

        return {
          turn: state.turn,
          phase: nextPhase.id,
          phaseChanged: true,
          finishedTurn: false
        };
      }

      // La fase Militar termina el turno real.
      const result = originalNextTurn();
      const nextTurn = GameState.getState().turn;

      GameState.setState({
        turnPhase: 'command',
        commandPoints: this.commandPointsPerTurn,
        completedPhases: [],

        turnLog: [
          `Turno ${nextTurn}: fase de Mando iniciada.`
        ]
      });

      this.openPhaseTab('map');
      this.scheduleUIRefresh();

      return {
        ...result,
        phase: 'command',
        phaseChanged: true,
        finishedTurn: true
      };
    };
  },

  patchTurnLabel() {
    const originalUpdateTurnUI = GameState.updateTurnUI.bind(GameState);

    GameState.updateTurnUI = () => {
      originalUpdateTurnUI();
      this.scheduleUIRefresh();
    };
  },

  getPhase(phaseId) {
    return (
      this.phases.find(phase => phase.id === phaseId) ||
      this.phases[0]
    );
  },

  openPhaseTab(tabId) {
    const tab = document.querySelector(
      `.nav-btn[data-tab="${tabId}"]`
    );

    if (tab) {
      tab.click();
    }
  },

  scheduleUIRefresh() {
    window.setTimeout(() => {
      this.refreshUI();
    }, 0);
  },

  refreshUI() {
    if (typeof GameState === 'undefined') {
      return;
    }

    const state = GameState.getState();

    const turnEl = document.getElementById('turn-info');
    const turnButton = document.getElementById('next-turn-btn');

    if (
      !turnEl ||
      !turnButton ||
      state.gameState !== 'playing'
    ) {
      return;
    }

    const phase = this.getPhase(
      state.turnPhase || 'command'
    );

    const points = Number.isFinite(state.commandPoints)
      ? state.commandPoints
      : this.commandPointsPerTurn;

    // Texto corto para que entre en el hueco del botón superior.
    turnEl.textContent = `T${state.turn} · ${phase.compactLabel}`;

    turnButton.dataset.phase = phase.id;

    turnButton.setAttribute(
      'aria-label',
      `Turno ${state.turn}, fase ${phase.label}, ${points} puntos de mando disponibles`
    );
  }
};

window.TurnPhaseSystem = TurnPhaseSystem;

window.addEventListener('load', () => {
  TurnPhaseSystem.install();
});
