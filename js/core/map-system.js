// js/core/map-system.js
// Motor del mapa galáctico compatible con galaxyMap y con el canvas DPR de main.js.

const MapSystem = {
  canvas: null,
  ctx: null,
  camera: { x: 0, y: 0, zoom: 1 },
  selectedPlanet: null,
  pointers: new Map(),
  dragging: false,
  interactionsBound: false,
  viewport: { width: 0, height: 0, dpr: 1 },

  init(canvas) {
    const target = canvas || document.getElementById('game-canvas');

    if (!target) return;

    this.canvas = target;
    this.ctx = target.getContext('2d');

    if (!this.interactionsBound) this.bindInteractions();

    // Ajustar cámara inicial al cargar.
    setTimeout(() => this.fitToViewport(), 50);
  },

  planets() {
    return window.galaxyMap && Array.isArray(galaxyMap.systems)
      ? galaxyMap.systems.flatMap(system => system.planets || [])
      : [];
  },

  bindInteractions() {
    this.interactionsBound = true;
    this.canvas.style.touchAction = 'none';

    this.canvas.addEventListener('pointerdown', event => this.pointerDown(event));
    this.canvas.addEventListener('pointermove', event => this.pointerMove(event));
    this.canvas.addEventListener('pointerup', event => this.pointerUp(event));
    this.canvas.addEventListener('pointercancel', event => this.pointerUp(event));
    this.canvas.addEventListener('wheel', event => this.wheel(event), { passive: false });
  },

  updateViewport() {
    const rect = this.canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return false;

    this.viewport = {
      width: rect.width,
      height: rect.height,
      dpr: this.canvas.width / rect.width || window.devicePixelRatio || 1
    };

    return true;
  },

  fitToViewport() {
    if (!this.canvas || !this.ctx || !this.updateViewport()) return;

    const planets = this.planets();

    if (!planets.length) return;

    const xs = planets.map(planet => planet.position.x);
    const ys = planets.map(planet => planet.position.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const padding = 54;

    const zoom = Math.min(
      (this.viewport.width - padding * 2) / Math.max(1, maxX - minX),
      (this.viewport.height - padding * 2) / Math.max(1, maxY - minY),
      1
    );

    this.camera.zoom = Math.max(0.28, zoom);
    this.camera.x =
      this.viewport.width / 2 - ((minX + maxX) / 2) * this.camera.zoom;
    this.camera.y =
      this.viewport.height / 2 - ((minY + maxY) / 2) * this.camera.zoom;

    this.render();
  },

  clientPoint(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  },

  worldPoint(clientX, clientY) {
    const point = this.clientPoint(clientX, clientY);

    return {
      x: (point.x - this.camera.x) / this.camera.zoom,
      y: (point.y - this.camera.y) / this.camera.zoom
    };
  },

  pointerDown(event) {
    this.canvas.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, this.clientPoint(event.clientX, event.clientY));
    this.dragging = false;
  },

  pointerMove(event) {
    if (!this.pointers.has(event.pointerId)) return;

    const previous = this.pointers.get(event.pointerId);
    const current = this.clientPoint(event.clientX, event.clientY);

    this.pointers.set(event.pointerId, current);

    const points = [...this.pointers.values()];

    if (points.length === 1) {
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;

      if (dx || dy) {
        this.camera.x += dx;
        this.camera.y += dy;
        this.dragging = this.dragging || Math.hypot(dx, dy) > 2;
        this.render();
      }
    } else if (points.length === 2) {
      const other = points.find(point => point !== current);
      const oldDistance =
        Math.hypot(previous.x - other.x, previous.y - other.y) || 1;
      const newDistance =
        Math.hypot(current.x - other.x, current.y - other.y) || 1;

      this.zoomAt(
        { x: (current.x + other.x) / 2, y: (current.y + other.y) / 2 },
        newDistance / oldDistance
      );

      this.dragging = true;
    }
  },

  pointerUp(event) {
    if (!this.pointers.has(event.pointerId)) return;

    if (!this.dragging && this.pointers.size === 1) {
      const point = this.worldPoint(event.clientX, event.clientY);

      const clickedPlanet = this.planets().find(
        planet =>
          Math.hypot(
            point.x - planet.position.x,
            point.y - planet.position.y
          ) <= 22
      ) || null;

      // Si ya estaba seleccionado, abrir menú de captura.
      if (clickedPlanet && this.selectedPlanet?.id === clickedPlanet.id) {
        this.openCaptureMenu(clickedPlanet);
      } else {
        this.selectedPlanet = clickedPlanet;
        this.render();
      }
    }

    this.pointers.delete(event.pointerId);

    if (this.canvas.hasPointerCapture(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
    }
  },

  wheel(event) {
    event.preventDefault();
    this.zoomAt(
      this.clientPoint(event.clientX, event.clientY),
      event.deltaY < 0 ? 1.12 : 0.88
    );
  },

  zoomAt(point, factor) {
    const worldX = (point.x - this.camera.x) / this.camera.zoom;
    const worldY = (point.y - this.camera.y) / this.camera.zoom;

    this.camera.zoom = Math.max(0.28, Math.min(3, this.camera.zoom * factor));
    this.camera.x = point.x - worldX * this.camera.zoom;
    this.camera.y = point.y - worldY * this.camera.zoom;

    this.render();
  },

  openCaptureMenu(planet) {
    if (typeof GameState === 'undefined') return;

    const controlled = GameState.getState().controlledPlanets;
    const isControlled = controlled.includes(planet.id);

    const ownerName =
      galaxyMap.factions[planet.owner]?.name || 'Desconocido';

    const message = isControlled
      ? `${planet.name} ya está bajo tu control.\n\nDueño actual: ${ownerName}`
      : `¿Capturar ${planet.name}?\n\nDueño actual: ${ownerName}`;

    if (isControlled) {
      alert(message);
      return;
    }

    const confirmed = confirm(message);

    if (!confirmed) return;

    // Capturar planeta para el jugador (facción neutral por ahora).
    GameState.addControlledPlanet(planet.id);

    // Actualizar dueño del planeta en galaxyMap (opcional, para reflejar en el mapa).
    if (galaxyMap.factions.player) {
      planet.owner = 'player';
    }

    console.log(`Planeta capturado: ${planet.name} (${planet.id})`);

    this.render();
  },

  render() {
    if (!this.ctx || !this.canvas || !this.updateViewport()) return;

    const ctx = this.ctx;
    const { width, height, dpr } = this.viewport;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    this.drawRoutes(ctx);
    this.drawPlanets(ctx);

    ctx.restore();

    if (this.selectedPlanet) {
      this.drawPlanetInfo(ctx, this.selectedPlanet);
    }
  },

  drawRoutes(ctx) {
    const seen = new Set();
    const planets = this.planets();

    for (const planet of planets) {
      for (const targetId of planet.routes || []) {
        const key = [planet.id, targetId].sort().join('-');

        if (seen.has(key)) continue;

        seen.add(key);

        const target = planets.find(candidate => candidate.id === targetId);

        if (!target) continue;

        ctx.beginPath();
        ctx.moveTo(planet.position.x, planet.position.y);
        ctx.lineTo(target.position.x, target.position.y);
        ctx.strokeStyle = '#333355';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  },

  drawPlanets(ctx) {
    const controlled =
      typeof GameState !== 'undefined'
        ? GameState.getState().controlledPlanets
        : [];

    for (const planet of this.planets()) {
      const isControlled = controlled.includes(planet.id);
      const faction = galaxyMap.factions[planet.owner];

      ctx.beginPath();
      ctx.arc(planet.position.x, planet.position.y, 15, 0, Math.PI * 2);

      // Si está controlado por el jugador, usar color especial.
      if (isControlled) {
        ctx.fillStyle = '#4caf50'; // Verde para planetas del jugador.
      } else {
        ctx.fillStyle = faction ? faction.color : '#666666';
      }

      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(planet.name, planet.position.x, planet.position.y - 20);
    }
  },

  drawPlanetInfo(ctx, planet) {
    const controlled =
      typeof GameState !== 'undefined'
        ? GameState.getState().controlledPlanets
        : [];

    const isControlled = controlled.includes(planet.id);
    const faction = galaxyMap.factions[planet.owner];
    const panelWidth = Math.min(250, this.viewport.width - 32);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx.fillRect(16, 16, panelWidth, isControlled ? 160 : 180);
    ctx.strokeStyle = isControlled ? '#4caf50' : faction ? faction.color : '#666666';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, panelWidth, isControlled ? 160 : 180);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(planet.name, 26, 41);

    ctx.font = '12px Arial';
    ctx.fillText(`Tipo: ${planet.type}`, 26, 66);
    ctx.fillText(
      `Dueño: ${isControlled ? 'Tú' : faction ? faction.name : 'Desconocido'}`,
      26,
      86
    );

    ctx.fillText('Recursos:', 26, isControlled ? 111 : 111);
    ctx.fillText(`Créditos: ${planet.resources.credits}`, 36, isControlled ? 131 : 131);
    ctx.fillText(`Minerales: ${planet.resources.minerals}`, 36, isControlled ? 151 : 151);

    if (!isControlled) {
      ctx.fillText(`Energía: ${planet.resources.energy}`, 36, 171);
    }
  }
};

window.MapSystem = MapSystem;
