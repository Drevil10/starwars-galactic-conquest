const state = {
  energy: 100,
  credits: 50,
  minerals: 30,
  research: 10,
  archiveEntries: [],
  archiveLoaded: false,
  archiveLoading: null
};

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const energyRes = document.getElementById('energy-res');
const creditsRes = document.getElementById('credits-res');
const mineralsRes = document.getElementById('minerals-res');
const researchRes = document.getElementById('research-res');
const navBtns = document.querySelectorAll('.nav-btn');
const archiveScreen = document.getElementById('archive-screen');
const archiveList = document.getElementById('archive-list');
const archiveDetail = document.getElementById('archive-detail');
const archiveGrid = document.getElementById('archive-grid');
const archiveEmpty = document.getElementById('archive-empty');
const archiveSearch = document.getElementById('archive-search');
const archiveFilters = document.getElementById('archive-filters');
const detailImage = document.getElementById('detail-image');
const detailTitle = document.getElementById('detail-title');
const detailType = document.getElementById('detail-type');
const detailDescription = document.getElementById('detail-description');
const archiveBack = document.getElementById('archive-back');

function updateResources() {
  energyRes.textContent = state.energy;
  creditsRes.textContent = state.credits;
  mineralsRes.textContent = state.minerals;
  researchRes.textContent = state.research;
}

function showScreen(screen) {
  startScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  screen.classList.add('active');
}

function archiveType(path) {
  if (path.startsWith('assets/characters/')) return 'personaje';
  if (path.startsWith('assets/locations/')) return 'planeta';
  if (path.startsWith('assets/effects/')) return 'evento';
  return 'tecnologia';
}

function archiveTitle(path) {
  return path
    .split('/')
    .pop()
    .replace(/\.svg$/i, '')
    .split('-')
    .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    .join(' ');
}

const characterLore = {
  'anakin-clone-wars': 'Anakin Skywalker es un General Jedi heroico, audaz y carismatico durante las Guerras Clon. Lidera con exito la Legio 501 y entrena a su Padawan Ahsoka Tano, mostrando dedicacion e ingenio. La presion de la guerra, la corrupcion de la Republica y el miedo a perder a sus seres queridos desgastan su fe en la Orden. La expulsion tragica de Ahsoka acelera su distanciamiento y profundiza emociones oscuras, marcando su camino hacia Darth Vader.',
  'anakin-skywalker': 'Anakin Skywalker es un Jedi excepcional y piloto prodigioso, destinado a ser el Elegido. Su talento es inmenso, pero su miedo a la perdida y su apego lo hacen vulnerable. Durante las Guerras Clon se convierte en un heroe y lider, pero su caida al lado oscuro como Darth Vader cambia el destino de la galaxia.',
  'obi-wan-kenobi': 'Obi-Wan Kenobi es un Maestro Jedi legendario, mentor de Anakin y maestro de la forma defensiva. Combate en las Guerras Clon y sobrevive a la purga Jedi, vigilando a Luke en Tatooine. Su sabiduria y paciencia lo convierten en un pilar de la Resistencia y la Nueva Republica.',
  'ahsoka-tano': 'Ahsoka Tano es la Padawan de Anakin durante las Guerras Clon, valiente y leal. Tras ser expulsada injustamente de la Orden, abandona el Templo Jedi y sigue su propio camino. Su experiencia la convierte en una aliada clave contra el Imperio y en una figura que busca equilibrio fuera de dogmas.',
  'padme-amidala': 'Padme Amidala es Reina y Senadora de Naboo, valiente defensora de la paz y la democracia. Se casa en secreto con Anakin y lucha por detener la guerra sin caer en autoritarismo. Su muerte tragica marca el inicio del Imperio y deja un legado de esperanza.',
  'qui-gon-jinn': 'Qui-Gon Jinn es un Maestro Jedi independiente que descubre a Anakin en Tatooine y cree que es el Elegido. Su enfoque en el lado vivo de la Fuerza lo lleva a desafiar al Consejo. Muere en combate contra Darth Maul, pero su legado perdura en Obi-Wan y Anakin.',
  'yoda': 'Yoda es un Gran Maestro Jedi de siglos de experiencia, maestro de casi todos los Jedi de su epoca. Lidera la Orden durante las Guerras Clon y sobrevive a la purga, exiliandose para preservar el conocimiento Jedi. Su sabiduria guia a Luke y a las nuevas generaciones.',
  'mace-windu': 'Mace Windu es un Maestro Jedi poderoso, maestro del combate y miembro del Alto Consejo. Enfrenta a Palpatine y descubre su identidad Sith, pero es traicionado por Anakin. Su muerte marca el colapso de la Orden Jedi.',
  'count-dooku': 'Count Dooku es un antiguo Jedi, maestro de Yoda, que cae al lado oscuro como Darth Tyranus. Lidera la Confederacion de Sistemas Independientes y entrena a Ventress. Su ambicion y desilusion con la Republica lo convierten en una pieza clave del plan Sith.',
  'darth-maul': 'Darth Maul es un Sith Zabrak, aprendiz de Palpatine, entrenado para la venganza contra los Jedi. Sobrevive a su aparente muerte y se convierte en un senor del crimen y rival de Mandalore. Su obsesion con Obi-Wan y su legado lo mantienen como una amenaza persistente.',
  'general-grievous': 'General Grievous es un ciborg estratega separatista, comandante de la flota droides y cazador de Jedi. Su odio hacia los Jedi y su habilidad tactica lo hacen temible. Su derrota marca el fin de las Guerras Clon y el ascenso del Imperio.',
  'asajj-ventress': 'Asajj Ventress es una ex Padawan Jedi convertida en asesina Sith, entrenada por Dooku. Tras ser traicionada, se convierte en cazarrecompensas y busca su propio camino. Su compleja relacion con el lado oscuro y su redencion la hacen unica.',
  'clone-captain-rex': 'Clone Captain Rex es un soldado clon de la Legio 501, leal a la Republica y amigo de Anakin y Ahsoka. Su experiencia en combate y su humanidad lo distinguen. Tras la Orden 66, lucha contra el Imperio junto a los rebeldes.',
  'commander-cody': 'Commander Cody es un clon comandante de la Legio 212, leal a la Republica y a Obi-Wan. Su disciplina y liderazgo lo convierten en un pilar del ejercito clon. La Orden 66 lo enfrenta a sus antiguos aliados Jedi.',
  'jango-fett': 'Jango Fett es un cazarrecompensas legendario, modelo genetico del ejercito clon y padre de Boba. Su habilidad y reputacion lo convierten en una figura clave en la galaxia. Muere en Geonosis, pero su legado perdura en su hijo y en los clones.',
  'boba-fett': 'Boba Fett es un cazarrecompensas temible, hijo genetico de Jango y maestro de la tactica. Su reputacion lo convierte en una leyenda en la galaxia. Tras sobrevivir a la caida de Jabba, busca su propio camino como senor del crimen en Tatooine.',
  'boba-fett-book': 'Boba Fett, tras sobrevivir a la caida de Jabba, se establece como senor del crimen en Tatooine. Su reputacion y habilidad lo convierten en una figura de poder. Busca gobernar con respeto y fuerza, alejandose de su pasado como mercenario.',
  'cad-bane': 'Cad Bane es un cazarrecompensas Duros, temible y despiadado, especializado en cazar Jedi. Su habilidad y crueldad lo convierten en una amenaza durante las Guerras Clon. Su legado como mercenario perdura en la galaxia.',
  'boss-nass': 'Boss Nass es un lider Gungan de Otoh Gunga, orgulloso y tradicional. Su relacion con los humanos de Naboo es tensa, pero colabora contra la invasion. Su papel es clave en la batalla de Naboo.',
  'sebulba': 'Sebulba es un piloto Podracer Dug, agresivo y despiadado en las carreras de Tatooine. Su rivalidad con Anakin muestra su naturaleza competitiva. Es una figura conocida en el circuito de carreras.',
  'watto': 'Watto es un comerciante Toydariano de Tatooine, dueno de Anakin y Shmi. Su codicia y crueldad lo hacen temible. Su papel en la infancia de Anakin es clave para entender su origen.',
  'jabba': 'Jabba el Hutt es un senor del crimen en Tatooine, poderoso y temido. Controla el contrabando y el crimen organizado en la region. Su influencia se extiende por la galaxia, y su corte es un centro de poder.',
  'jabba-the-hutt': 'Jabba el Hutt es un senor del crimen en Tatooine, poderoso y temido. Controla el contrabando y el crimen organizado en la region. Su influencia se extiende por la galaxia, y su corte es un centro de poder.',
  'savage-oppress': 'Savage Opress es un Zabrak de Dathomir, hermano de Maul, convertido en guerrero Sith. Su fuerza y lealtad a Maul lo convierten en una amenaza. Su papel en las Guerras Clon es clave en la lucha por Mandalore.',
  'mother-talzin': 'Mother Talzin es la lider de las Nightsisters de Dathomir, poderosa en la magia oscura. Su relacion con Maul y su influencia en la galaxia la hacen una figura clave. Su poder magico es temido por Jedi y Sith.',
  'pre-vizsla': 'Pre Vizsla es el lider de Death Watch, un Mandaloriano que busca restaurar el pasado guerrero de su pueblo. Su alianza con Maul y su lucha por Mandalore lo convierten en una figura tragica. Su muerte marca el ascenso de Maul.',
  'bo-katan-kryze': 'Bo-Katan Kryze es una guerrera Mandaloriana, lider de Death Watch y luego de Mandalore. Su honor y habilidad la convierten en una figura clave. Su lucha por su pueblo la lleva a alianzas complejas.',
  'bo-katan-mandalorian': 'Bo-Katan Kryze es una guerrera Mandaloriana, lider de Death Watch y luego de Mandalore. Su honor y habilidad la convierten en una figura clave. Su lucha por su pueblo la lleva a alianzas complejas.',
  'kit-fisto': 'Kit Fisto es un Maestro Jedi Nautolan, maestro del combate y miembro del Consejo. Su habilidad y lealtad lo convierten en un pilar de la Orden. Muere en la purga Jedi.',
  'plo-koon': 'Plo Koon es un Maestro Jedi Kel Dor, miembro del Consejo y lider de clones. Su sabiduria y habilidad lo convierten en un pilar de la Orden. Muere en la purga Jedi.',
  'shaak-ti': 'Shaak Ti es una Maestra Jedi Togruta, miembro del Consejo y guardiana del Templo. Su habilidad y lealtad la convierten en un pilar de la Orden. Muere en la purga Jedi.',
  'luminara-unduli': 'Luminara Unduli es una Maestra Jedi, maestra de Barriss Offee. Su disciplina y habilidad la convierten en un pilar de la Orden. Muere en la purga Jedi.',
  'barriss-offee': 'Barriss Offee es una Jedi Padawan, aprendiz de Luminara. Su caida al lado oscuro y su traicion la convierten en una figura tragica. Su papel en las Guerras Clon es clave.'
};

function archiveDescription(title, type, path) {
  const fileName = path.split('/').pop().replace(/\.svg$/i, '');
  if (characterLore[fileName]) return characterLore[fileName];
  const descriptions = {
    personaje: `${title} es una figura registrada en los archivos galacticos. Su historia queda ligada a conflictos, alianzas y decisiones que marcaron su epoca. Consulta esta ficha para reconocer su lugar dentro de la galaxia.`,
    planeta: `${title} es una localizacion de importancia dentro de la galaxia. Sus condiciones, habitantes y recursos han influido en rutas, batallas y operaciones de distintas facciones. Esta ficha conserva una referencia visual de su presencia en el conflicto.`,
    evento: `${title} representa un suceso o efecto destacado en los registros galacticos. Su impacto modifica el curso de un enfrentamiento y deja consecuencias para quienes participan. El Archivo lo conserva como referencia tactica e historica.`,
    tecnologia: `${title} forma parte del equipo, arsenal o infraestructura utilizada en la galaxia. Su diseno responde a necesidades de combate, transporte, defensa o supervivencia. Esta ficha permite identificarlo rapidamente y situarlo dentro del inventario galactico.`
  };
  return descriptions[type] || `${title} es una entrada registrada en el Archivo galactico. Esta ficha recoge una referencia visual y contextual para su consulta durante la partida.`;
}

async function loadArchiveEntries() {
  if (state.archiveLoaded) return;
  if (state.archiveLoading) return state.archiveLoading;

  state.archiveLoading = fetch('https://api.github.com/repos/Drevil10/starwars-galactic-conquest/git/trees/main?recursive=1')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el Archivo');
      return response.json();
    })
    .then(data => {
      state.archiveEntries = (data.tree || [])
        .filter(item => item.type === 'blob' && item.path.startsWith('assets/') && item.path.endsWith('.svg'))
        .map(item => {
          const title = archiveTitle(item.path);
          const type = archiveType(item.path);
          return {
            id: item.path,
            type,
            title,
            description: archiveDescription(title, type, item.path),
            image: item.path
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));
      state.archiveLoaded = true;
    })
    .catch(() => {
      state.archiveEntries = [];
      state.archiveLoaded = true;
    })
    .finally(() => {
      state.archiveLoading = null;
    });

  return state.archiveLoading;
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.tab === 'archive') openArchive();
    else closeArchive();
  });
});

async function openArchive() {
  archiveScreen.style.display = 'block';
  archiveList.style.display = 'block';
  archiveDetail.style.display = 'none';

  if (!state.archiveLoaded) {
    archiveGrid.innerHTML = '<div class="archive-empty">Cargando Archivo...</div>';
    archiveEmpty.style.display = 'none';
    await loadArchiveEntries();
  }
  renderArchiveGrid();
}

function closeArchive() {
  archiveScreen.style.display = 'none';
}

function renderArchiveGrid() {
  const query = (archiveSearch.value || '').toLowerCase().trim();
  const activeButton = archiveFilters.querySelector('.archive-filter.active');
  const activeFilter = activeButton ? activeButton.dataset.type : 'all';
  const entries = state.archiveEntries.filter(entry => {
    const matchesType = activeFilter === 'all' || entry.type === activeFilter;
    const matchesQuery = !query || entry.title.toLowerCase().includes(query) || entry.description.toLowerCase().includes(query);
    return matchesType && matchesQuery;
  });

  archiveGrid.innerHTML = '';
  archiveEmpty.style.display = entries.length ? 'none' : 'block';
  entries.forEach(entry => {
    const card = document.createElement('button');
    card.className = 'archive-card';
    card.innerHTML = `
      <img class="archive-card-image" src="${entry.image}" alt="" />
      <div class="archive-card-text">
        <span class="archive-card-title">${entry.title}</span>
        <span class="archive-card-category">${entry.type}</span>
      </div>
    `;
    card.addEventListener('click', () => openArchiveDetail(entry));
    archiveGrid.appendChild(card);
  });
}

function openArchiveDetail(entry) {
  archiveList.style.display = 'none';
  archiveDetail.style.display = 'block';
  detailImage.src = entry.image;
  detailImage.alt = entry.title;
  detailTitle.textContent = entry.title;
  detailType.textContent = entry.type;
  detailDescription.textContent = entry.description;
}

archiveBack.addEventListener('click', () => {
  archiveList.style.display = 'block';
  archiveDetail.style.display = 'none';
});

archiveSearch.addEventListener('input', renderArchiveGrid);
archiveFilters.addEventListener('click', event => {
  const button = event.target.closest('.archive-filter');
  if (!button) return;
  archiveFilters.querySelectorAll('.archive-filter').forEach(filter => filter.classList.remove('active'));
  button.classList.add('active');
  renderArchiveGrid();
});

startBtn.addEventListener('click', () => {
  showScreen(gameScreen);
  updateResources();
});

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
