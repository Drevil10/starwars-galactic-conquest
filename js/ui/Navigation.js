class NavigationClass {
    constructor() { this.currentTab = 'base'; this.tabs = ['base', 'characters', 'ships', 'explore', 'missions']; }
    init() {
        const nav = document.getElementById('bottom-nav');
        if (!nav) return;
        nav.querySelectorAll('.nav-btn[data-screen]').forEach((btn) => btn.addEventListener('click', (event) => this.switchTab(event.currentTarget.dataset.screen)));
        const menuButton = document.getElementById('menu-btn');
        if (menuButton) menuButton.addEventListener('click', () => this.showMenuPanel());
    }
    switchTab(tabName) {
        if (!this.tabs.includes(tabName)) return;
        const nav = document.getElementById('bottom-nav');
        if (nav) nav.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.screen === tabName));
        this.currentTab = tabName;
        if (window.GameState) GameState.setScreen(tabName);
        if (window.EventBus) EventBus.emit('navigation:tabChanged', { tab: tabName });
        this.showTabContent(tabName);
    }
    clearOverlays() { const area = document.getElementById('game-area'); if (area) area.querySelectorAll('.canvas-overlay').forEach((el) => el.remove()); }
    makePanel(html) { const panel = document.createElement('div'); panel.className = 'canvas-overlay'; panel.innerHTML = html; document.getElementById('game-area').appendChild(panel); return panel; }
    showTabContent(tabName) {
        this.clearOverlays();
        if (tabName === 'base') { if (window.Renderer) Renderer.render(); return; }
        if (tabName === 'characters') return this.showCharactersPanel();
        if (tabName === 'ships') return this.showShipsPanel();
        if (tabName === 'explore') return this.showExplorePanel();
        if (tabName === 'missions') return this.showMissionsPanel();
    }
    closeToBase(panel) { panel.remove(); this.switchTab('base'); }
    showCharactersPanel() {
        const count = window.Characters ? Characters.characters.length : 0;
        const max = window.Characters ? Characters.maxCharacters : 0;
        const panel = this.makePanel('<h3 style="margin-bottom:1rem;color:#ffd700;">Personajes</h3><p style="color:#aaa;margin-bottom:1rem;">' + count + ' / ' + max + '</p><p style="color:#888;">Gestiona tus heroes desde esta pantalla.</p><button class="action-btn cancel" id="close-panel" style="width:100%;margin-top:1rem;">Cerrar</button>');
        panel.querySelector('#close-panel').addEventListener('click', () => this.closeToBase(panel));
    }
    showShipsPanel() {
        const count = window.Ships ? Ships.ships.length : 0;
        const max = window.Ships ? Ships.maxShips : 0;
        const panel = this.makePanel('<h3 style="margin-bottom:1rem;color:#ffd700;">Flota</h3><p style="color:#aaa;margin-bottom:1rem;">' + count + ' / ' + max + '</p><p style="color:#888;">Gestiona tus naves desde esta pantalla.</p><button class="action-btn cancel" id="close-panel" style="width:100%;margin-top:1rem;">Cerrar</button>');
        panel.querySelector('#close-panel').addEventListener('click', () => this.closeToBase(panel));
    }
    showExplorePanel() {
        const panel = this.makePanel('<h3 style="margin-bottom:1rem;color:#ffd700;">Explorar</h3><p style="color:#aaa;margin-bottom:1.5rem;">Envia tu flota a explorar la galaxia en busca de recursos y tesoros.</p><button class="action-btn" id="start-explore" style="width:100%;">Iniciar exploracion</button><button class="action-btn cancel" id="close-panel" style="width:100%;margin-top:.5rem;">Cerrar</button>');
        panel.querySelector('#start-explore').addEventListener('click', () => alert('Exploracion en desarrollo.'));
        panel.querySelector('#close-panel').addEventListener('click', () => this.closeToBase(panel));
    }
    showMissionsPanel() {
        const panel = this.makePanel('<h3 style="margin-bottom:1rem;color:#ffd700;">Misiones</h3><p style="color:#aaa;margin-bottom:1.5rem;">Completa misiones para ganar recompensas.</p><div style="background:rgba(255,255,255,.05);padding:1rem;border-radius:6px;margin-bottom:1rem;"><div style="font-weight:600;margin-bottom:.5rem;">Primera Base</div><div style="font-size:.875rem;color:#888;margin-bottom:.5rem;">Construye tu primer edificio</div><div style="color:#ffd700;font-size:.875rem;">Recompensa: 100 CREDITOS</div></div><button class="action-btn cancel" id="close-panel" style="width:100%;">Cerrar</button>');
        panel.querySelector('#close-panel').addEventListener('click', () => this.closeToBase(panel));
    }
    showMenuPanel() {
        this.clearOverlays();
        const panel = this.makePanel('<h3 style="margin-bottom:1rem;color:#ffd700;">Menu</h3><div class="archive-menu-list"><button id="open-archive" class="archive-menu-item">Archivo Galactico</button><button id="close-menu" class="action-btn cancel">Cerrar</button></div>');
        panel.querySelector('#open-archive').addEventListener('click', () => { panel.remove(); if (window.Archive) Archive.show(); });
        panel.querySelector('#close-menu').addEventListener('click', () => this.closeToBase(panel));
    }
}
window.Navigation = new NavigationClass();
