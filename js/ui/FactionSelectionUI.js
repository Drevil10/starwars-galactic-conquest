// js/ui/FactionSelectionUI.js
// Interfaz de selección de facción para iniciar una campaña.

class FactionSelectionUIClass {
    constructor() {
        this.container = null;
        this.onFactionSelected = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) {
            return true;
        }

        this.container = document.getElementById('faction-selection');

        if (!this.container) {
            console.error(
                'FactionSelectionUI: No se encontró el contenedor #faction-selection.'
            );

            return false;
        }

        if (typeof CampaignSystem === 'undefined') {
            console.error(
                'FactionSelectionUI: CampaignSystem no está disponible.'
            );

            return false;
        }

        this.initialized = true;

        return true;
    }

    show(options = {}) {
        if (!this.init()) {
            return;
        }

        this.onFactionSelected = options.onSelect || null;

        this.render();
        this.container.style.display = 'flex';
    }

    hide() {
        if (!this.container) {
            return;
        }

        this.container.style.display = 'none';
    }

    render() {
        const factions = CampaignSystem.getFactions();

        this.container.innerHTML = `
            <div class="faction-selection-panel">
                <div class="faction-selection-header">
                    <span class="faction-selection-kicker">NUEVA CAMPAÑA</span>
                    <h2>Elige tu facción</h2>
                    <p>
                        Tu elección define la capital, los recursos iniciales,
                        la flota de partida y el estilo de expansión.
                    </p>
                </div>

                <div class="faction-selection-grid">
                    ${factions
                        .map(faction => this.createFactionCard(faction))
                        .join('')}
                </div>
            </div>
        `;

        this.bindButtons();
    }

    createFactionCard(faction) {
        const resources = faction.startingResources;

        return `
            <button
                class="faction-card"
                type="button"
                data-faction-id="${faction.id}"
                style="--faction-color: ${faction.color};"
            >
                <div class="faction-card-top">
                    <span class="faction-card-icon">
                        <img
                            src="${faction.emblem}"
                            alt="${faction.emblemAlt}"
                            width="30"
                            height="30"
                            style="width:30px; height:30px; object-fit:contain;"
                        />
                    </span>

                    <span class="faction-card-name">
                        ${faction.name}
                    </span>
                </div>

                <p class="faction-card-description">
                    ${faction.description}
                </p>

                <div class="faction-card-section">
                    <span class="faction-card-label">Capital</span>
                    <strong>${this.formatPlanetName(faction.capital)}</strong>
                </div>

                <div class="faction-card-section">
                    <span class="faction-card-label">Estilo</span>
                    <span>${faction.playstyle}</span>
                </div>

                <div class="faction-card-resources">
                    <span title="Energía">⚡ ${resources.energy}</span>
                    <span title="Créditos">🪙 ${resources.credits}</span>
                    <span title="Minerales">⛏️ ${resources.minerals}</span>
                    <span title="Investigación">🧪 ${resources.research}</span>
                </div>

                <span class="faction-card-action">
                    Jugar como ${faction.shortName}
                </span>
            </button>
        `;
    }

    formatPlanetName(planetId) {
        return planetId
            .split('-')
            .map(part => {
                return part.charAt(0).toUpperCase() + part.slice(1);
            })
            .join(' ');
    }

    bindButtons() {
        const buttons = this.container.querySelectorAll('.faction-card');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const factionId = button.dataset.factionId;

                if (!factionId) {
                    return;
                }

                this.selectFaction(factionId);
            });
        });
    }

    selectFaction(factionId) {
        const result = CampaignSystem.startCampaign(factionId);

        if (!result.success) {
            console.error(
                'FactionSelectionUI: No se pudo iniciar la campaña.',
                result.error
            );

            return;
        }

        if (typeof this.onFactionSelected === 'function') {
            this.onFactionSelected(result);
        }

        this.hide();
    }
}

window.FactionSelectionUI = new FactionSelectionUIClass();
