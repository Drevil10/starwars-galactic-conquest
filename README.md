# Star Wars: Galactic Conquest

Juego de exploraci�n espacial y gesti�n de base ambientado en el universo de Star Wars.

## 🎮 Jugar Ahora

**[https://drevil10.github.io/starwars-galactic-conquest](https://drevil10.github.io/starwars-galactic-conquest)**

## 🚀 Estructura del Proyecto

```
starwars-galactic-conquest/
├── index.html              # Punto de entrada HTML
├── css/styles.css         # Estilos principales
└── js/
    ├── core/              # N�cleo del juego
    │   ├── Constants.js   # Configuraci�n global
    │   ├── EventBus.js    # Sistema de eventos
    │   ├── GameState.js   # Estado del juego
    │   └── Game.js        # Orquestador principal
    ├── systems/           # Sistemas del juego
    │   ├── Input.js       # Gesti�n de inputs
    │   ├── Renderer.js    # Renderizado canvas
    │   ├── SaveSystem.js  # Guardado/carga
    │   └── ResourceManager.js  # Recursos
    ├── gameplay/          # Mec�nicas de juego
    │   ├── Characters.js  # Personajes (todos los bandos)
    │   ├── Ships.js       # Naves (todas las facciones)
    │   └── Base.js        # Sistema de base
    └── ui/                # Interfaz de usuario
        ├── Navigation.js  # Navegaci�n pesta�as
        ├── Screens.js     # Pantallas
        └── Components.js  # Componentes UI
```

## 🎯 Caracter�sticas

### Personajes Incluidos (20+)

**Rep�blica Gal�ctica:**
- Anakin Skywalker, Obi-Wan Kenobi, Yoda, Mace Windu

**Separatistas:**
- Conde Dooku, General Grievous, Asajj Ventress

**Imperio Gal�ctico:**
- Darth Vader, Emperador Palpatine, Gran Almirante Thrawn, Gran Moff Tarkin

**Alianza Rebelde:**
- Luke Skywalker, Princesa Leia, Han Solo, Chewbacca

**Primera Orden:**
- Kylo Ren, General Hux

**Resistencia:**
- Rey, Finn, Poe Dameron

### Naves Incluidas (25+)

- Star Destroyers (Venator, Imperial, Executor)
- X-Wings, Y-Wings, A-Wings
- TIE Fighters, TIE Interceptors
- Millennium Falcon, MC80 Star Cruiser
- Starkiller Base, y muchas m�s...

### Sistema de Base

- 10 tipos de edificios diferentes
- Producci�n autom�tica de recursos
- Sistema de grilla 6x5 para colocaci�n
- Mejoras de edificios

## 🛠️ Tecnolog�as

- HTML5 Canvas
- JavaScript Vanilla (sin frameworks)
- CSS3 con variables
- LocalStorage para guardado
- GitHub Pages para hosting

## 📱 Compatible con M�vil

- Totalmente responsive
- Soporte t�ctil
- Funciona en iPhone, iPad, Android
- Sin necesidad de instalaci�n

## 🎮 Controles

### Teclado
- **ESC** - Pausar/Continuar
- **Ctrl+S** - Guardar manualmente

### T�ctil/Rat�n
- Click/tap en botones
- Navegaci�n por pesta�as inferiores

## 🔧 Comandos de Consola

```javascript
// Guardar manualmente
Game.save()

// Cargar partida
Game.load()

// Ver estado actual
console.log(GameState.serialize())

// Reclutar personaje
Characters.recruit('luke')

// Construir nave
Ships.build('xwing')

// Construir edificio
Base.build('material_mine', 0, 0)
```

## 📝 Pr�ximas Iteraciones

### Fase 1 - UI Completa
- [ ] Pantallas de personajes con grid de tarjetas
- [ ] Pantalla de naves con filtros por facci�n
- [ ] Pantalla de exploraci�n con mapa estelar
- [ ] Pantalla de misiones

### Fase 2 - Mec�nicas
- [ ] Sistema de combate
- [ ] Misiones explorables
- [ ] �rbol de tecnolog�as
- [ ] Logros y estad�sticas

### Fase 3 - Contenido
- [ ] M�s personajes (Ahsoka, Mandalorian, etc.)
- [ ] M�s naves
- [ ] M�s edificios
- [ ] Eventos aleatorios

### Fase 4 - Optimizaci�n
- [ ] Sprites y assets visuales
- [ ] Efectos de sonido
- [ ] M�sica de fondo
- [ ] Optimizaci�n m�vil

## 📄 Licencia

Proyecto personal/fan. Star Wars es propiedad de Disney/Lucasfilm.

---

**Desarrollado con ❤️ para la comunidad de Star Wars**
