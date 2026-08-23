class ArchiveClass {
    constructor() {
        this.categories = [
            { id: 'all', label: 'Todos' },
            { id: 'characters', label: 'Personajes' },
            { id: 'ships', label: 'Naves' },
            { id: 'planets', label: 'Planetas' },
            { id: 'weapons', label: 'Armas' },
            { id: 'vehicles', label: 'Vehiculos' },
            { id: 'creatures', label: 'Criaturas' }
        ];
        this.assets = [
            { name: 'Darth Vader', category: 'characters', image: 'assets/characters/iconic/darth-vader.svg', description: 'Antiguo Jedi conocido como Anakin Skywalker. Convertido en el temido ejecutor del Imperio, su presencia se asocia con el lado oscuro y la caza de los ultimos Jedi.' },
            { name: 'Luke Skywalker', category: 'characters', image: 'assets/characters/iconic/luke-skywalker.svg', description: 'Granjero de Tatooine que descubrio su conexion con la Fuerza. Se convirtio en una figura decisiva para la Alianza Rebelde y la restauracion de la esperanza en la galaxia.' },
            { name: 'Leia Organa', category: 'characters', image: 'assets/characters/iconic/princess-leia.svg', description: 'Princesa de Alderaan, lider rebelde y estratega de la Resistencia. Su valor y determinacion unieron a quienes luchaban contra el Imperio.' },
            { name: 'Han Solo', category: 'characters', image: 'assets/characters/iconic/han-solo.svg', description: 'Contrabandista y capitan del Halcon Milenario. Su ingenio y lealtad lo llevaron a convertirse en uno de los heroes mas importantes de la Rebelion.' },
            { name: 'Ahsoka Tano', category: 'characters', image: 'assets/characters/iconic/ahsoka-tano.svg', description: 'Ex padawan de Anakin Skywalker. Tras abandonar la Orden Jedi, siguio luchando por la galaxia con un criterio propio y una fuerte conexion con la Fuerza.' },
            { name: 'Obi-Wan Kenobi', category: 'characters', image: 'assets/characters/iconic/obi-wan-kenobi.svg', description: 'Maestro Jedi que sobrevivio a la caida de la Orden. Fue mentor de Anakin y posteriormente guio a Luke en sus primeros pasos hacia la Fuerza.' },
            { name: 'Yoda', category: 'characters', image: 'assets/characters/iconic/yoda.svg', description: 'Uno de los maestros Jedi mas sabios y longevos. Durante siglos instruyo a generaciones de guardianes de la paz en la galaxia.' },
            { name: 'The Mandalorian', category: 'characters', image: 'assets/characters/iconic/the-mandalorian.svg', description: 'Cazarrecompensas mandaloriano que cruzo la galaxia protegiendo a Grogu. Su viaje lo llevo a redescubrir el significado de su pueblo y su codigo.' },
            { name: 'X-Wing', category: 'ships', image: 'assets/ships/x-wing.svg', description: 'Caza estelar de superioridad espacial utilizado por la Alianza Rebelde y la Nueva Republica. Su configuracion de alas en X combina velocidad, potencia y versatilidad.' },
            { name: 'TIE Fighter', category: 'ships', image: 'assets/ships/tie-fighter.svg', description: 'Caza ligero estandar del Imperio. Rapido, reconocible y producido en grandes cantidades para dominar el espacio imperial.' },
            { name: 'Halcon Milenario', category: 'ships', image: 'assets/ships/millennium-falcon.svg', description: 'Carguero Corelliano modificado por Han Solo y Chewbacca. A pesar de su aspecto, es una de las naves mas rapidas y famosas de la galaxia.' },
            { name: 'Destructor Estelar Imperial', category: 'ships', image: 'assets/ships/imperial-star-destroyer.svg', description: 'Buque capital del Imperio. Su silueta triangular y enorme poder de fuego lo convirtieron en un simbolo de control y presencia militar.' },
            { name: 'Razor Crest', category: 'ships', image: 'assets/ships/razor-crest.svg', description: 'Canonera usada por Din Djarin como hogar y nave de cazarrecompensas. Resistio numerosas misiones antes de ser destruida por fuerzas imperiales.' },
            { name: 'Slave I', category: 'ships', image: 'assets/ships/slave-i.svg', description: 'Nave patrulla Firespray asociada a Jango y Boba Fett. Su diseno vertical y su arsenal la hacen inconfundible entre las naves de cazarrecompensas.' },
            { name: 'Tatooine', category: 'planets', image: 'assets/locations/tatooine.svg', description: 'Planeta desertico de dos soles situado en el Borde Exterior. Fue el hogar de Anakin y Luke Skywalker y escenario de numerosos conflictos.' },
            { name: 'Coruscant', category: 'planets', image: 'assets/locations/coruscant.svg', description: 'Ecumenopolis que sirvio como capital galactica durante la Republica y el Imperio. Su superficie esta cubierta por una ciudad que se extiende por todo el planeta.' },
            { name: 'Endor', category: 'planets', image: 'assets/locations/endor.svg', description: 'Luna boscosa habitada por ewoks. La batalla librada alli fue crucial para la caida del segundo Imperio Galactico.' },
            { name: 'Hoth', category: 'planets', image: 'assets/locations/hoth.svg', description: 'Mundo helado elegido por la Alianza Rebelde para ocultar la Base Eco. Sus llanuras de nieve fueron escenario de una gran ofensiva imperial.' },
            { name: 'Mandalore', category: 'planets', image: 'assets/locations/mandalore.svg', description: 'Planeta natal del pueblo mandaloriano. Su historia esta marcada por guerras, clanes y la lucha por el control del Darksaber.' },
            { name: 'Mustafar', category: 'planets', image: 'assets/locations/mustafar.svg', description: 'Planeta volcanico donde Anakin Skywalker cayo definitivamente al lado oscuro tras su duelo con Obi-Wan Kenobi.' },
            { name: 'Sable de luz azul', category: 'weapons', image: 'assets/weapons/lightsaber-blue.svg', description: 'Arma energetica asociada tradicionalmente a los guardianes Jedi. Su hoja de plasma es capaz de atravesar numerosos materiales y desviar disparos de blaster.' },
            { name: 'Darksaber', category: 'weapons', image: 'assets/weapons/darksaber.svg', description: 'Sable de luz de hoja negra creado por Tarre Vizsla, el primer mandaloriano Jedi. Es un simbolo de liderazgo entre los clanes de Mandalore.' },
            { name: 'Blaster DL-44', category: 'weapons', image: 'assets/weapons/dl-44-blaster.svg', description: 'Pistola blaster de gran potencia popularizada por Han Solo. Es famosa por su fiabilidad y por el caracter de su propietario.' },
            { name: 'Ballesta Wookiee', category: 'weapons', image: 'assets/weapons/wookiee-bowcaster.svg', description: 'Arma energetica tradicional de los wookiees. Combina la estructura de una ballesta con proyectiles de energia de alto impacto.' },
            { name: 'Lanzacohetes', category: 'weapons', image: 'assets/weapons/rocket-launcher.svg', description: 'Arma pesada empleada para enfrentarse a blindados y objetivos reforzados. Su poder de destruccion exige una distancia segura de uso.' },
            { name: 'AT-AT', category: 'vehicles', image: 'assets/vehicles/at-at.svg', description: 'Transporte blindado imperial de cuatro patas. Su tamaño y blindaje lo hicieron temible en los asaltos terrestres, especialmente en Hoth.' },
            { name: 'AT-ST', category: 'vehicles', image: 'assets/vehicles/at-st.svg', description: 'Caminante explorador imperial, mas ligero y maniobrable que el AT-AT. Se desplegaba para patrullas y apoyo de infanteria.' },
            { name: 'Speeder Bike', category: 'vehicles', image: 'assets/vehicles/speeder-bike.svg', description: 'Vehiculo repulsor de alta velocidad, usado por exploradores imperiales y rebeldes. Es ideal para persecuciones a baja altura.' },
            { name: 'Landspeeder', category: 'vehicles', image: 'assets/vehicles/landspeeder.svg', description: 'Vehiculo civil repulsor comun en mundos como Tatooine. Luke Skywalker utilizaba uno para moverse por las granjas de humedad.' },
            { name: 'Sandcrawler', category: 'vehicles', image: 'assets/vehicles/sandcrawler.svg', description: 'Enorme vehiculo oruga utilizado por los jawas para transportar, reparar y comerciar con droides encontrados en el desierto.' },
            { name: 'Acklay', category: 'creatures', image: 'assets/characters/creatures/acklay.svg', description: 'Depredador nativo de Vendaxa, conocido por sus garras afiladas y su comportamiento agresivo. Fue utilizado en la arena de Geonosis.' },
            { name: 'Rancor', category: 'creatures', image: 'assets/characters/creatures/rancor.svg', description: 'Gigantesca criatura carnivora que vive en mundos pantanosos. El rancor de Jabba era una de las amenazas mas temidas de su palacio.' },
            { name: 'Wampa', category: 'creatures', image: 'assets/characters/creatures/wampa.svg', description: 'Depredador de pelaje blanco adaptado a los hielos de Hoth. Su fuerza y camuflaje lo convierten en un peligro para los viajeros del planeta.' },
            { name: 'Porg', category: 'creatures', image: 'assets/characters/creatures/porg.svg', description: 'Pequena ave marina originaria de Ahch-To. Sus grandes ojos y curiosidad hicieron que se convirtiera en una presencia inolvidable para la tripulacion.' },
            { name: 'Tauntaun', category: 'creatures', image: 'assets/characters/creatures/tauntaun.svg', description: 'Montura nativa de Hoth, adaptada al frio extremo. La Alianza Rebelde la utilizo para patrullar alrededor de la Base Eco.' }
        ];
        this.activeCategory = 'all';
        this.query = '';
    }

    show() {
        const area = document.getElementById('game-area');
        if (!area) return;
        area.querySelectorAll('.canvas-overlay').forEach((el) => el.remove());
        this.panel = document.createElement('div');
        this.panel.className = 'canvas-overlay archive-panel';
        this.panel.innerHTML = '<h3 class="archive-title">Archivo Galactico</h3><input id="archive-search" class="archive-search" type="search" placeholder="Buscar en el archivo"><div id="archive-filters" class="archive-filters"></div><div id="archive-grid" class="archive-grid"></div><button id="close-archive" class="action-btn cancel archive-back-button">Volver</button>';
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
        const filtered = this.assets.filter((asset) => {
            return (this.activeCategory === 'all' || asset.category === this.activeCategory) && (!needle || asset.name.toLowerCase().includes(needle));
        });
        root.innerHTML = '';
        if (!filtered.length) { root.innerHTML = '<div class="archive-empty">No se encontraron elementos.</div>'; return; }
        filtered.forEach((asset) => {
            const card = document.createElement('button');
            card.className = 'archive-card';
            const category = this.categories.find((item) => item.id === asset.category);
            const image = document.createElement('img');
            image.className = 'archive-card-image';
            image.src = asset.image;
            image.alt = '';
            image.loading = 'lazy';
            const text = document.createElement('span');
            text.className = 'archive-card-text';
            const title = document.createElement('span');
            title.className = 'archive-card-title';
            title.textContent = asset.name;
            const type = document.createElement('span');
            type.className = 'archive-card-category';
            type.textContent = category ? category.label : asset.category;
            text.append(title, type);
            card.append(image, text);
            card.addEventListener('click', () => this.showDetail(asset));
            root.appendChild(card);
        });
    }

    showDetail(asset) {
        const category = this.categories.find((item) => item.id === asset.category);
        this.panel.innerHTML = '';
        const image = document.createElement('img');
        image.className = 'archive-detail-image';
        image.src = asset.image;
        image.alt = asset.name;
        const title = document.createElement('h3');
        title.className = 'archive-detail-title';
        title.textContent = asset.name;
        const type = document.createElement('p');
        type.className = 'archive-detail-type';
        type.textContent = category ? category.label : asset.category;
        const description = document.createElement('p');
        description.className = 'archive-detail-description';
        description.textContent = asset.description;
        const back = document.createElement('button');
        back.className = 'action-btn archive-back-button';
        back.textContent = 'Volver';
        back.addEventListener('click', () => this.show());
        this.panel.append(image, title, type, description, back);
    }
}
window.Archive = new ArchiveClass();
