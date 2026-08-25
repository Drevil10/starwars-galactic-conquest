// Motor del mapa galáctico compatible con galaxyMap.
const MapSystem = {
  canvas: null,
  ctx: null,
  camera: { x: 0, y: 0, zoom: 1 },
  selectedPlanet: null,
  hoveredPlanet: null,
  pointers: new Map(),
  dragStart: null,
  hasDragged: false,
  interactionsBound: false,
  lastViewport: { width: 0, height: 0 },

  init(canvas) {
    const target = canvas || document.getElementById('game-canvas');
    if (!target) return;
    this.canvas = target;
    this.ctx = target.getContext('2d');
    if (!this.interactionsBound) this.setupInteractions();
  },

  getPlanets() {
    if (!window.galaxyMap || !Array.isArray(galaxyMap.systems)) return [];
    return galaxyMap.systems.flatMap(system => system.planets || []);
  },

  setupInteractions() {
    if (!this.canvas) return;
    this.interactionsBound = true;
    this.canvas.style.touchAction = 'none';
    this.canvas.addEventListener('pointerdown', event => this.handlePointerDown(event));
    this.canvas.addEventListener('pointermove', event => this.handlePointerMove(event));
    this.canvas.addEventListener('pointerup', event => this.handlePointerUp(event));
    this.canvas.addEventListener('pointercancel', event => this.handlePointerUp(event));
    this.canvas.addEventListener('wheel', event => this.handleWheel(event), { passive: false });
  },

  resizeToViewport(fit = true) {
    if (!this.canvas || !this.ctx) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    if (!width || !height) return;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.lastViewport = { width, height };
    if (fit) this.fitToContent();
    else this.render();
  },

  fitToContent() {
    const planets = this.getPlanets();
    const { width, height } = this.lastViewport;
    if (!planets.length || !width || !height) return;
    const xs = planets.map(planet => planet.position.x);
    const ys = planets.map(planet => planet.position.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const padding = 54;
    const worldWidth = Math.max(1, maxX - minX);
    const worldHeight = Math.max(1, maxY - minY);
    const zoom = Math.min((width - padding * 2) / worldWidth, (height - padding * 2) / worldHeight, 1);
    this.camera.zoom = Math.max(0.28, zoom);
    this.camera.x = width / 2 - ((minX + maxX) / 2) * this.camera.zoom;
    this.camera.y = height / 2 - ((minY + maxY) / 2) * this.camera.zoom;
    this.render();
  },

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.camera.x) / this.camera.zoom,
      y: (clientY - rect.top - this.camera.y) / this.camera.zoom
    };
  },

  findPlanetAtPosition(x, y) {
    return this.getPlanets().find(planet => Math.hypot(x - planet.position.x, y - planet.position.y) <= 22) || null;
  },

  handlePointerDown(event) {
    this.canvas.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.dragStart = { x: event.clientX, y: event.clientY };
    this.hasDragged = false;
  },

  handlePointerMove(event) {
    if (!this.pointers.has(event.pointerId)) return;
    const previous = this.pointers.get(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size === 1) {
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      if (Math.abs(dx) + Math.abs(dy) > 0) {
        this.camera.x += dx;
        this.camera.y += dy;
        this.hasDragged = this.hasDragged || Math.hypot(event.clientX - this.dragStart.x, event.clientY - this.dragStart.y) > 8;
        this.render();
      }
    } else if (this.pointers.size === 2) {
      const points = [...this.pointers.values()];
      const oldDistance = Math.hypot(previous.x - points[0].x, previous.y - points[0].y) || 1;
      const newDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) || 1;
      this.zoomAt((points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2, newDistance / oldDistance);
      this.hasDragged = true;
    }
  },

  handlePointerUp(event) {
    if (!this.pointers.has(event.pointerId)) return;
    if (!this.hasDragged && this.pointers.size === 1) {
      const point = this.screenToWorld(event.clientX, event.clientY);
      this.selectedPlanet = this.findPlanetAtPosition(point.x, point.y);
      this.render();
    }
    this.pointers.delete(event.pointerId);
    if (this.canvas.hasPointerCapture(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
  },

  handleWheel(event) {
    event.preventDefault();
    this.zoomAt(event.clientX, event.clientY, event.deltaY < 0 ? 1.12 : 0.88);
  },

  zoomAt(clientX, clientY, factor) {
    const before = this.screenToWorld(clientX, clientY);
    this.camera.zoom = Math.max(0.28, Math.min(3, this.camera.zoom * factor));
    const rect = this.canvas.getBoundingClientRect();
    this.camera.x = clientX - rect.left - before.x * this.camera.zoom;
    this.camera.y = clientY - rect.top - before.y * this.camera.zoom;
    this.render();
  },

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    this.drawRoutes();
    this.drawPlanets();
    ctx.restore();
    if (this.selectedPlanet) this.drawPlanetInfo(this.selectedPlanet);
  },

  drawRoutes() {
    const ctx = this.ctx;
    const drawnRoutes = new Set();
    for (const planet of this.getPlanets()) {
      for (const routeTarget of planet.routes || []) {
        const routeKey = [planet.id, routeTarget].sort().join('-');
        if (drawnRoutes.has(routeKey)) continue;
        drawnRoutes.add(routeKey);
        const target = this.findPlanetById(routeTarget);
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

  drawPlanets() {
    const ctx = this.ctx;
    for (const planet of this.getPlanets()) {
      const faction = galaxyMap.factions[planet.owner];
      ctx.beginPath();
      ctx.arc(planet.position.x, planet.position.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = faction ? faction.color : '#666666';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(planet.name, planet.position.x, planet.position.y - 20);
      if (this.hoveredPlanet === planet) {
        ctx.beginPath();
        ctx.arc(planet.position.x, planet.position.y, 20, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  },

  drawPlanetInfo(planet) {
    const ctx = this.ctx;
    const faction = galaxyMap.factions[planet.owner];
    const panelX = 16;
    const panelY = 16;
    const panelWidth = Math.min(250, this.canvas.width - 32);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx.fillRect(panelX, panelY, panelWidth, 180);
    ctx.strokeStyle = faction ? faction.color : '#666666';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelWidth, 180);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(planet.name, panelX + 10, panelY + 25);
    ctx.font = '12px Arial';
    ctx.fillText(`Tipo: ${planet.type}`, panelX + 10, panelY + 50);
    ctx.fillText(`Dueño: ${faction ? faction.name : 'Desconocido'}`, panelX + 10, panelY + 70);
    ctx.fillText('Recursos:', panelX + 10, panelY + 95);
    ctx.fillText(`Créditos: ${planet.resources.credits}`, panelX + 20, panelY + 115);
    ctx.fillText(`Minerales: ${planet.resources.minerals}`, panelX + 20, panelY + 135);
    ctx.fillText(`Energía: ${planet.resources.energy}`, panelX + 20, panelY + 155);
  },

  findPlanetById(id) {
    return this.getPlanets().find(planet => planet.id === id) || null;
  }
};

window.MapSystem = MapSystem;
