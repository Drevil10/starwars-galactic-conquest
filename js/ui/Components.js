/**
 * Components.js
 * Componentes de UI reutilizables
 */

const Components = {
    createProgressBar(current, max, color = '#4CAF50') {
        const percentage = Math.min(100, Math.max(0, (current / max) * 100));
        return `<div class="progress-bar" style="width: 100%; height: 20px; background: rgba(0,0,0,0.5); border-radius: 4px; overflow: hidden;">
            <div class="progress-fill" style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.3s;"></div>
        </div>`;
    },

    createCharacterCard(character) {
        const factionConfig = Constants.FACTION_CONFIG[character.faction];
        const rarityColors = {
            common: '#8B8B8B', rare: '#2196F3', epic: '#9C27B0', legendary: '#FFE81F'
        };
        return `<div class="character-card" style="
            background: linear-gradient(135deg, rgba(10,14,39,0.9) 0%, rgba(5,7,20,0.95) 100%);
            border: 2px solid ${rarityColors[character.rarity]};
            border-radius: 8px; padding: 15px; margin: 10px;
            width: 200px; display: inline-block; vertical-align: top;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 48px;">${character.faction === Constants.FACTIONS.REPUBLIC || character.faction === Constants.FACTIONS.RESISTANCE ? '🔵' : '🔴'}</div>
                <h3 style="color: #FFE81F; margin: 10px 0 5px 0; font-size: 16px;">${character.name}</h3>
                <div style="color: ${factionConfig.color}; font-size: 12px;">${factionConfig.name}</div>
            </div>
            <div style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 4px; margin: 10px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 12px;">
                    <div style="color: #F44336;">⚔️ ATK: ${character.stats.attack}</div>
                    <div style="color: #4CAF50;">🛡️ DEF: ${character.stats.defense}</div>
                    <div style="color: #2196F3;">⚡ SPD: ${character.stats.speed}</div>
                    <div style="color: #FF9800;">👑 LDR: ${character.stats.leadership}</div>
                </div>
            </div>
            <div style="font-size: 11px; color: #8B8B8B; margin-top: 10px;">
                <div>${character.role}</div>
                <div style="text-transform: uppercase; color: ${rarityColors[character.rarity]};">${character.rarity}</div>
            </div>
            ${!character.recruited ? `
                <button class="btn-recruit" style="
                    width: 100%; margin-top: 10px; padding: 8px;
                    background: linear-gradient(135deg, #FFE81F 0%, #FFD700 100%);
                    border: none; border-radius: 4px; color: #0A0E27;
                    font-weight: bold; cursor: pointer; transition: all 0.3s;
                " onclick="Components.recruitCharacter('${character.id}')">Reclutar</button>
            ` : `<div style="text-align: center; margin-top: 10px; color: #4CAF50; font-weight: bold;">✓ Reclutado</div>`}
        </div>`;
    },

    createShipCard(ship) {
        const typeIcons = { capital: '🚢', fighter: '✈️', special: '⭐', superweapon: '💀' };
        return `<div class="ship-card" style="
            background: linear-gradient(135deg, rgba(10,14,39,0.9) 0%, rgba(5,7,20,0.95) 100%);
            border: 2px solid #2196F3; border-radius: 8px; padding: 15px;
            margin: 10px; width: 200px; display: inline-block; vertical-align: top;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
            <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 48px;">${typeIcons[ship.type] || '🚀'}</div>
                <h3 style="color: #FFE81F; margin: 10px 0 5px 0; font-size: 14px;">${ship.name}</h3>
                <div style="color: #8B8B8B; font-size: 11px;">${ship.class}</div>
            </div>
            <div style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 4px; margin: 10px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 12px;">
                    <div style="color: #F44336;">⚔️ ${ship.stats.attack}</div>
                    <div style="color: #4CAF50;">🛡️ ${ship.stats.defense}</div>
                    <div style="color: #2196F3;">⚡ ${ship.stats.speed}</div>
                    <div style="color: #FF9800;">📦 ${ship.stats.capacity}</div>
                </div>
            </div>
            <div style="font-size: 11px; color: #8B8B8B; margin-top: 10px;">
                <div>Costo: ₡${ship.buildCost.credits} ◆${ship.buildCost.materials} ⚡${ship.buildCost.energy}</div>
                <div>Tiempo: ${ship.buildTime}s</div>
            </div>
            ${ship.owned === 0 ? `
                <button class="btn-build" style="
                    width: 100%; margin-top: 10px; padding: 8px;
                    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                    border: none; border-radius: 4px; color: #FFFFFF;
                    font-weight: bold; cursor: pointer; transition: all 0.3s;
                " onclick="Components.buildShip('${ship.id}')">Construir</button>
            ` : `<div style="text-align: center; margin-top: 10px; color: #4CAF50; font-weight: bold;">✓ En Flota (${ship.owned})</div>`}
        </div>`;
    },

    createBuildingCard(building) {
        const typeColors = {
            core: '#FFE81F', production: '#4CAF50', military: '#F44336',
            research: '#2196F3', defense: '#9C27B0', storage: '#FF9800'
        };
        return `<div class="building-card" style="
            background: linear-gradient(135deg, rgba(10,14,39,0.9) 0%, rgba(5,7,20,0.95) 100%);
            border: 2px solid ${typeColors[building.type]}; border-radius: 8px;
            padding: 15px; margin: 10px; width: 180px;
            display: inline-block; vertical-align: top;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
            <h3 style="color: #FFE81F; margin: 0 0 5px 0; font-size: 14px;">${building.name}</h3>
            <div style="color: ${typeColors[building.type]}; font-size: 11px; text-transform: uppercase; margin-bottom: 10px;">${building.type}</div>
            <p style="color: #8B8B8B; font-size: 11px; margin: 10px 0; min-height: 40px;">${building.description}</p>
            <div style="font-size: 11px; color: #8B8B8B; margin-top: 10px;">
                <div>Costo: ₡${building.buildCost.credits} ◆${building.buildCost.materials} ⚡${building.buildCost.energy}</div>
                ${building.size ? `<div>Tama�o: ${building.size.width}x${building.size.height}</div>` : ''}
            </div>
            <button class="btn-build-building" style="
                width: 100%; margin-top: 10px; padding: 8px;
                background: linear-gradient(135deg, ${typeColors[building.type]} 0%, rgba(255,255,255,0.2) 100%);
                border: none; border-radius: 4px; color: #FFFFFF;
                font-weight: bold; cursor: pointer; transition: all 0.3s;
            " onclick="Components.selectBuilding('${building.id}')">Construir</button>
        </div>`;
    },

    recruitCharacter(characterId) { Characters.recruit(characterId); },
    buildShip(shipId) { Ships.build(shipId); },
    selectBuilding(buildingId) { console.log(`[Components] Edificio seleccionado: ${buildingId}`); },

    showNotification(message, type = 'info', duration = 3000) {
        const colors = { info: '#2196F3', success: '#4CAF50', error: '#F44336', warning: '#FF9800' };
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: linear-gradient(135deg, ${colors[type]} 0%, rgba(0,0,0,0.9) 100%);
            color: #FFFFFF; padding: 15px 25px; border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
};

EventBus.subscribe(Constants.EVENTS.UI.UPDATE_RESOURCES, (data) => {
    const creditsEl = document.querySelector('#resource-credits .resource-value');
    const materialsEl = document.querySelector('#resource-materials .resource-value');
    const energyEl = document.querySelector('#resource-energy .resource-value');
    if (creditsEl) creditsEl.textContent = data.credits;
    if (materialsEl) materialsEl.textContent = data.materials;
    if (energyEl) energyEl.textContent = data.energy;
});

EventBus.subscribe(Constants.EVENTS.UI.SHOW_NOTIFICATION, (data) => {
    Components.showNotification(data.message, data.type, data.duration);
});

window.Components = Components;