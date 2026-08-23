class ArchiveClass {
    constructor() {
        this.categories = [
            { id: 'all', label: 'Todos' }, { id: 'characters', label: 'Personajes' }, { id: 'ships', label: 'Naves' },
            { id: 'planets', label: 'Planetas' }, { id: 'weapons', label: 'Armas' }, { id: 'vehicles', label: 'Vehiculos' },
            { id: 'droids', label: 'Droides' }, { id: 'creatures', label: 'Criaturas' }
        ];
        this.assets = [
            { name: 'Darth Vader', category: 'characters', path: 'assets/svg/characters/darth_vader.svg' },
            { name: 'Luke Skywalker', category: 'characters', path: 'assets/svg/characters/luke_skywalker.svg' },
            { name: 'X-Wing', category: 'ships', path: 'assets/svg/ships/xwing.svg' },
            { name: 'TIE Fighter', category: 'ships', path: 'assets/svg/ships/tie_fighter.svg' },
            { name: 'Death Star', category: 'ships', path: 'assets/svg/ships/death_star.svg' },
            { name: 'Tatooine', category: 'planets', path: 'assets/svg/planets/tatooine.svg' },
            { name: 'Endor', category: 'planets', path: 'assets/svg/planets/endor.svg' },
            { name: 'Lightsaber', category: 'weapons', path: 'assets/svg/weapons/lightsaber.svg' },
            { name: 'Blaster', category: 'weapons', path: 'assets/svg/weapons/blaster.svg' },
            { name: 'Speeder Bike', category: 'vehicles', path: 'assets/svg/vehicles/speeder_bike.svg' },
            { name: 'AT-AT', category: 'vehicles', path: 'assets/svg/vehicles/at_at.svg' },
            { name: 'R2-D2', category: 'droids', path: 'assets/svg/droids/r2d2.svg' },
            { name: 'C-3PO', category: 'droids', path: 'assets/svg/droids/c3po.svg' },
            { name: 'Wampa', category: 'creatures', path: 'assets/svg/creatures/wampa.svg' },
            { name: 'Rancor', category: 'creatures', path: 'assets/svg/creatures/rancor.svg' }
        ];
        this.activeCategory = 'all';
        this.query = '';
    }
    show() {
        const area = document.getElementById('game-area');
        if (!area) return;
        area.querySelectorAll('.canvas-overlay').forEach((el) => el.remove());
        this.panel = document.createElement('div');
        this.panel.className = 'canvas-overlay';
        this.panel.innerHTML = '<h3 class="archive-title">Archivo Galactico</h3><input id="archive-search" class="archive-search" type="search" placeholder="Buscar assets"><div id="archive-filters" class="archive-filters"></div><div id="archive-grid" class="archive-grid"></div><button id="close-archive" class="action-btn cancel" style="width:100%;margin-top:14px;">Cerrar</button>';
        area.appendChild(this.panel);
        this.panel.querySelector('#archive-search').addEventListener('input', (event) => { this.query = event.target.value; this.renderGrid(); });
        this.panel.querySelector('#close-archive').addEventListener('click', () => { this.panel.remove(); if (window.Navigation) Navigation.switchTab('base'); });
        this.renderFilters();
        this.renderGrid();
    }
    renderFilters() {
        const root = this.panel.querySelector('#archive-filters');
        root.innerHTML = '';
        this.categories.forEach((category) => {
            const button = document.createElement('button');
            button.className = 'archive-filter' + (category.id === this.activeCategory ? ' active' : '');
            button.textContent = category.label;
            button.addEventListener('click', () => { this.activeCategory = category.id; this.renderFilters(); this.renderGrid(); });
            root.appendChild(button);
        });
    }
    renderGrid() {
        const root = this.panel.querySelector('#archive-grid');
        const needle = this.query.trim().toLowerCase();
        const filtered = this.assets.filter((asset) => (this.activeCategory === 'all' || asset.category === this.activeCategory) && (!needle || asset.name.toLowerCase().includes(needle)));
        root.innerHTML = '';
        if (!filtered.length) { root.innerHTML = '<div class="archive-empty">No se encontraron assets.</div>'; return; }
        filtered.forEach((asset) => {
            const card = document.createElement('button');
            card.className = 'archive-card';
            const category = this.categories.find((item) => item.id === asset.category);
            card.innerHTML = '<span class="archive-card-title"></span><span class="archive-card-category"></span>';
            card.querySelector('.archive-card-title').textContent = asset.name;
            card.querySelector('.archive-card-category').textContent = category ? category.label : asset.category;
            card.addEventListener('click', () => this.showDetail(asset));
            root.appendChild(card);
        });
    }
    showDetail(asset) {
        const category = this.categories.find((item) => item.id === asset.category);
        this.panel.innerHTML = '<h3 class="archive-title">Detalle del asset</h3><div class="archive-detail"><div><strong>Nombre</strong><br>' + asset.name + '</div><div><strong>Categoria</strong><br>' + (category ? category.label : asset.category) + '</div><div><strong>Ruta</strong><br>' + asset.path + '</div></div><button id="back-archive" class="action-btn" style="width:100%;margin-top:14px;">Volver</button><button id="close-archive" class="action-btn cancel" style="width:100%;margin-top:8px;">Cerrar</button>';
        this.panel.querySelector('#back-archive').addEventListener('click', () => this.show());
        this.panel.querySelector('#close-archive').addEventListener('click', () => { this.panel.remove(); if (window.Navigation) Navigation.switchTab('base'); });
    }
}
window.Archive = new ArchiveClass();
