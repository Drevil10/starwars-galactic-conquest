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
  originalNextTurn: null,
  originalStartCampaign: null,
  originalUpdateTurnUI: null,

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

    this.patchCampaignStart();
    this.patchTurnAdvance();
    this.patchTurnLabel();
    this.refreshUI();
  },

  patchCampaignStart() {
    this.originalStartCampaign = CampaignSystem.startCampaign.bind(
      CampaignSystem
    );

    CampaignSystem.startCampaign = factionId => {
      const result = this.originalStartCampaign(factionId);

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
    this.originalNextTurn = TurnSystem.nextTurn.bind(TurnSystem);

    TurnSystem.nextTurn = () => {
      const state = GameState.getState();
      const phase = state.turnPhase || 'command';

      const currentIndex = this.phases.findIndex(
        item => item.id === phase
      );

      const nextIndex = currentIndex + 1;

      if (nextIndex < this.phases.length) {
        const nextPhase = this.phases[nextIndex];

        const completedPhases = [
          ...new Set([
            ...(state.completedPhases || []),
            phase
          ])
        ];

        GameState.setState({
          turnPhase: nextPhase.id,
          completedPhases,
          turnLog: [
            ...(state.turnLog || []),
            `Fase completada: ${this.getPhaseLabel(phase)}`
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

      const result = this.originalNextTurn();
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
    this.originalUpdateTurnUI = GameState.updateTurnUI.bind(GameState);

    GameState.updateTurnUI = () => {
      this.originalUpdateTurnUI();
      this.scheduleUIRefresh();
    };
  },

  getPhase(phaseId) {
    return this.phases.find(item => item.id === phaseId) || this.phases[0];
  },

  getPhaseLabel(phaseId) {
    return this.getPhase(phaseId).label;
  },

  getCompactPhaseLabel(phaseId) {
    return this.getPhase(phaseId).compactLabel;
  },

  getCurrentPhase() {
    if (typeof GameState === 'undefined') {
      return 'command';
    }

    return GameState.getState().turnPhase || 'command';
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

    if (!turnEl || !turnButton || state.gameState !== 'playing') {
      return;
    }

    const phase = state.turnPhase || 'command';
    const label = this.getPhaseLabel(phase);
    const compactLabel = this.getCompactPhaseLabel(phase);

    const points = Number.isFinite(state.commandPoints)
      ? state.commandPoints
      : this.commandPointsPerTurn;

    turnEl.textContent = `T${state.turn} · ${compactLabel}`;

    turnButton.setAttribute(
      'aria-label',
      `Turno ${state.turn}, fase ${label}, ${points} puntos de mando disponibles`
    );

    turnButton.dataset.phase = phase;
  }
};

window.TurnPhaseSystem = TurnPhaseSystem;

window.addEventListener('load', () => {
  TurnPhaseSystem.install();
});
