// js/ui/Navigation.js
// Sistema de navegación - botones inferiores

class NavigationClass {
    constructor() {
        this.currentTab = 'base';
        this.tabs = ['base', 'characters', 'ships', 'explore', 'missions'];
    }

    init() {
        const nav = document.getElementById('bottom-nav');
        if (!nav) return;

        const buttons = nav.querySelectorAll('.nav-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.switchTab(screen);
            });
        });

        console.log('Navigation: Inicializada');
    }

    switchTab(tabName) {
        if (!this.tabs.includes(tabName)) {
            console.warn('Navigation: Tab inválido', tabName);
            return;
        }

        // Actualizar UI
        const nav = document.getElementById('bottom-nav');
        if (nav) {
            nav.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.screen === tabName) {
                    btn.classList.add('active');
                }
            });
        }

        this.currentTab = tabName;
        GameState.setScreen(tabName);

        EventBus.emit('navigation:tabChanged', { tab: tabName });
        console.log('Navigation: Tab cambiado a', tabName);

        // Mostrar contenido del tab
        this.showTabContent(tabName);
    }

    showTabContent(tabName) {
        // Limpiar overlays anteriores
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.querySelectorAll('.canvas-overlay').forEach(el => el.remove());
        }

        switch(tabName) {
            case 'base':
                // Mostrar cuadrícula de base
                Renderer.render();
                break;
            case 'characters':
                this.showCharactersPanel();
                break;
            case 'ships':
                this.showShipsPanel();
                break;
            case 'explore':
                this.showExplorePanel();
                break;
            case 'missions':
                this.showMissionsPanel();
                break;
        }
    }

    showCharactersPanel() {
        const panel = document.createElement('div');
        panel.className = 'canvas-overlay';
        panel.style.position = 'absolute';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.minWidth = '300px';
        panel.style.maxWidth = '90%';

        let html = '<h3 style="margin-bottom: 1rem; color: #ffd700;">Personajes</h3>';
        html += '<p style="color: #aaa; margin-bottom: 1rem;">' + Characters.characters.length + ' / ' + Characters.maxCharacters + '</p>';
        
        if (Characters.characters.length === 0) {
            html += '<p style="color: #888;">No tienes personajes aún.</p>';
        } else {
            Characters.characters.forEach(char => {
                html += `
                    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">${char.icon}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: 600;">${char.name}</div>
                            <div style="font-size: 0.75rem; color: #888;">Nivel ${char.level} - ${char.class}</div>
                        </div>
                    </div>
                `;
            });
        }

        html += '<button class="action-btn" id="recruit-char" style="width: 100%; margin-top: 1rem;">Reclutar Personaje</button>';
        html += '<button class="action-btn cancel" id="close-char-panel" style="width: 100%; margin-top: 0.5rem;">Cerrar</button>';

        panel.innerHTML = html;
        document.getElementById('game-area').appendChild(panel);

        // Event listeners
        panel.querySelector('#close-char-panel').addEventListener('click', () => {
            panel.remove();
            Navigation.switchTab('base');
        });

        panel.querySelector('#recruit-char').addEventListener('click', () => {
            const newChar = Characters.generateRandomCharacter();
            Characters.addCharacter(newChar);
            panel.remove();
            this.showCharactersPanel();
        });
    }

    showShipsPanel() {
        const panel = document.createElement('div');
        panel.className = 'canvas-overlay';
        panel.style.position = 'absolute';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.minWidth = '300px';
        panel.style.maxWidth = '90%';

        let html = '<h3 style="margin-bottom: 1rem; color: #ffd700;">Flota</h3>';
        html += '<p style="color: #aaa; margin-bottom: 1rem;">' + Ships.ships.length + ' / ' + Ships.maxShips + '</p>';
        
        if (Ships.ships.length === 0) {
            html += '<p style="color: #888;">No tienes naves aún.</p>';
        } else {
            Ships.ships.forEach(ship => {
                html += `
                    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">${ship.icon}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: 600;">${ship.name}</div>
                            <div style="font-size: 0.75rem; color: #888;">Nivel ${ship.level} - ${ship.type}</div>
                        </div>
                    </div>
                `;
            });
        }

        html += '<button class="action-btn" id="build-ship" style="width: 100%; margin-top: 1rem;">Construir Nave</button>';
        html += '<button class="action-btn cancel" id="close-ship-panel" style="width: 100%; margin-top: 0.5rem;">Cerrar</button>';

        panel.innerHTML = html;
        document.getElementById('game-area').appendChild(panel);

        panel.querySelector('#close-ship-panel').addEventListener('click', () => {
            panel.remove();
            Navigation.switchTab('base');
        });

        panel.querySelector('#build-ship').addEventListener('click', () => {
            const newShip = Ships.generateRandomShip();
            Ships.addShip(newShip);
            panel.remove();
            this.showShipsPanel();
        });
    }

    showExplorePanel() {
        const panel = document.createElement('div');
        panel.className = 'canvas-overlay';
        panel.style.position = 'absolute';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.minWidth = '280px';
        panel.style.maxWidth = '90%';

        const html = `
            <h3 style="margin-bottom: 1rem; color: #ffd700;">Explorar</h3>
            <p style="color: #aaa; margin-bottom: 1.5rem;">Envía tu flota a explorar la galaxia en busca de recursos y tesoros.</p>
            <button class="action-btn confirm" id="start-explore" style="width: 100%;">Iniciar Exploración</button>
            <button class="action-btn cancel" id="close-explore-panel" style="width: 100%; margin-top: 0.5rem;">Cerrar</button>
        `;

        panel.innerHTML = html;
        document.getElementById('game-area').appendChild(panel);

        panel.querySelector('#close-explore-panel').addEventListener('click', () => {
            panel.remove();
            Navigation.switchTab('base');
        });

        panel.querySelector('#start-explore').addEventListener('click', () => {
            alert('Funcionalidad de exploración en desarrollo...');
        });
    }

    showMissionsPanel() {
        const panel = document.createElement('div');
        panel.className = 'canvas-overlay';
        panel.style.position = 'absolute';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.minWidth = '300px';
        panel.style.maxWidth = '90%';

        const html = `
            <h3 style="margin-bottom: 1rem; color: #ffd700;">Misiones</h3>
            <p style="color: #aaa; margin-bottom: 1.5rem;">Completa misiones para ganar recompensas.</p>
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <div style="font-weight: 600; margin-bottom: 0.5rem;">Primera Base</div>
                <div style="font-size: 0.875rem; color: #888; margin-bottom: 0.5rem;">Construye tu primer edificio</div>
                <div style="color: #ffd700; font-size: 0.875rem;">Recompensa: 100 💰</div>
            </div>
            <button class="action-btn cancel" id="close-missions-panel" style="width: 100%;">Cerrar</button>
        `;

        panel.innerHTML = html;
        document.getElementById('game-area').appendChild(panel);

        panel.querySelector('#close-missions-panel').addEventListener('click', () => {
            panel.remove();
            Navigation.switchTab('base');
        });
    }
}

// Exportar instancia global
window.Navigation = new NavigationClass();
