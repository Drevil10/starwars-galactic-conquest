// js/core/map-system.js
// Motor del mapa galáctico con territorios, capitales y panel de Mando.

const MapSystem = {
  canvas: null,
  ctx: null,

  camera: {
    x: 0,
    y: 0,
    zoom: 1
  },

  selectedPlanet: null,
  pointers: new Map(),
  dragging: false,
  interactionsBound: false,

  viewport: {
    width: 0,
    height: 0,
    dpr: 1
  },

  factionEmblems: {
    empire: 'assets/effects/imperial-symbol.svg',
    rebels: 'assets/effects/rebel-symbol.svg',
    separatists: 'assets/effects/separatist-symbol.svg',
    mandalorians: 'assets/effects/mandalorian-symbol.svg'
  },

  emblemImages: {},

  init(canvas) {
    const target = canvas || document.getElementById('game-canvas');

    if (!target) {
      return;
    }

    this.canvas = target;
    this.ctx = target.getContext('2d');

    if (!this.interactionsBound) {
      this.bindInteractions();
    }

    setTimeout(() => {
      this.fitToViewport();
    }, 50);
  },

  planets() {
    if (
      !window.galaxyMap ||
      !Array.isArray(window.galaxyMap.systems)
    ) {
      return [];
    }

    return window.galaxyMap.systems.flatMap(
      system => system.planets || []
    );
  },

  getPlanetById(planetId) {
    return this.planets().find(
      planet => planet.id === planetId
    ) || null;
  },

  getTerritoryStatus(planet) {
    if (
      window.TerritorySystem &&
      typeof TerritorySystem.getPlanetStatus === 'function'
    ) {
      return TerritorySystem.getPlanetStatus(planet.id);
    }

    const controlled =
      typeof GameState !== 'undefined'
        ? GameState.getState().controlledPlanets
        : [];

    return controlled.includes(planet.id)
      ? 'player'
      : 'neutral';
  },

  getPlayerCapital() {
    if (
      window.TerritorySystem &&
      typeof TerritorySystem.getPlayerCapital === 'function'
    ) {
      return TerritorySystem.getPlayerCapital();
    }

    return null;
  },

  getFaction(planet) {
    if (
      !window.galaxyMap ||
      !window.galaxyMap.factions
    ) {
      return null;
    }

    return galaxyMap.factions[planet.owner] || null;
  },

  getFactionName(planet) {
    if (
      window.TerritorySystem &&
      typeof TerritorySystem.getFactionName === 'function'
    ) {
      return TerritorySystem.getFactionName(planet.owner);
    }

    return this.getFaction(planet)?.name || 'Neutral';
  },

  getOwnerLabel(planet, status) {
    if (status === 'player') {
      return 'Tú';
    }

    const factionName = this.getFactionName(planet);

    if (status === 'enemy') {
      return factionName || 'Enemigo';
    }

    return factionName === 'Neutral'
      ? 'Neutral'
      : factionName || 'Neutral';
  },

  getStatusLabel(status) {
    if (status === 'player') {
      return 'TU TERRITORIO';
    }

    if (status === 'enemy') {
      return 'SISTEMA ENEMIGO';
    }

    return 'SISTEMA NEUTRAL';
  },

  getStatusColor(status, fallbackColor = '#666666') {
    if (status === 'player') {
      return '#4caf50';
    }

    if (status === 'enemy') {
      return '#f44336';
    }

    return fallbackColor;
  },

  getPlanetResources(planet) {
    if (
      window.TerritorySystem &&
      typeof TerritorySystem.getPlanetResources === 'function'
    ) {
      return (
        TerritorySystem.getPlanetResources(planet.id) ||
        planet.resources ||
        {}
      );
    }

    return planet.resources || {};
  },

  getPlanetRoutes(planet) {
    if (
      window.TerritorySystem &&
      typeof TerritorySystem.getPlanetRoutes === 'function'
    ) {
      return TerritorySystem.getPlanetRoutes(planet.id) || [];
    }

    return planet.routes || [];
  },

  getPlanetType(planet) {
    if (
      window.TerritorySystem &&
      typeof TerritorySystem.getPlanetType === 'function'
    ) {
      return TerritorySystem.getPlanetType(planet.id) || planet.type;
    }

    return planet.type || 'desconocido';
  },

  formatPlanetName(planetId) {
    const planet = this.getPlanetById(planetId);

    if (planet) {
      return planet.name;
    }

    return planetId
      .split('-')
      .map(part => {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(' ');
  },

  formatPlanetType(type) {
    const labels = {
      capital: 'Capital',
      industrial: 'Industrial',
      agricultural: 'Agrícola',
      desert: 'Desierto',
      ocean: 'Oceánico',
      barren: 'Yermo',
      volcanic: 'Volcánico',
      forest: 'Boscoso',
      ice: 'Helado',
      gas: 'Gigante gaseoso',
      tropical: 'Tropical',
      holy: 'Santuario',
      jungle: 'Selva',
      salt: 'Salino',
      storm: 'Tormentoso',
      mining: 'Minero'
    };

    return labels[type] || this.formatPlanetName(type);
  },

  getPhaseInfo() {
    const state =
      typeof GameState !== 'undefined'
        ? GameState.getState()
        : {};

    const phaseId = state.turnPhase || 'command';

    const phaseLabels = {
      command: 'Mando',
      construction: 'Construir',
      research: 'Investigar',
      military: 'Militar'
    };

    return {
      id: phaseId,
      label: phaseLabels[phaseId] || 'Mando',
      commandPoints: Number.isFinite(state.commandPoints)
        ? state.commandPoints
        : 3
    };
  },

  getFactionEmblemKey(planet, status) {
    if (status === 'player') {
      const selectedFaction =
        typeof GameState !== 'undefined'
          ? GameState.getState().selectedFaction
          : null;

      const aliases = {
        imperial: 'empire',
        rebel: 'rebels',
        separatist: 'separatists',
        mandalorian: 'mandalorians'
      };

      return aliases[selectedFaction] || planet.owner;
    }

    return planet.owner;
  },

  getEmblemImage(factionId) {
    const path = this.factionEmblems[factionId];

    if (!path) {
      return null;
    }

    if (this.emblemImages[factionId]) {
      return this.emblemImages[factionId];
    }

    const image = new Image();

    image.onload = () => {
      this.render();
    };

    image.onerror = () => {
      delete this.emblemImages[factionId];
    };

    image.src = path;

    this.emblemImages[factionId] = image;

    return image;
  },

  drawFactionEmblem(
    ctx,
    planet,
    status,
    panelX,
    panelY,
    panelWidth
  ) {
    const factionId = this.getFactionEmblemKey(
      planet,
      status
    );

    if (!this.factionEmblems[factionId]) {
      return;
    }

    const image = this.getEmblemImage(factionId);

    if (
      !image ||
      !image.complete ||
      !image.naturalWidth
    ) {
      return;
    }

    // El emblema queda totalmente a la derecha.
    const emblemSize = 32;
    const rightMargin = 14;

    const emblemX =
      panelX +
      panelWidth -
      emblemSize -
      rightMargin;

    const emblemY = panelY + 14;

    ctx.save();

    ctx.globalAlpha = 0.96;

    ctx.fillStyle = 'rgba(7, 17, 40, 0.94)';

    ctx.fillRect(
      emblemX - 4,
      emblemY - 4,
      emblemSize + 8,
      emblemSize + 8
    );

    ctx.strokeStyle = '#2f80ed';
    ctx.lineWidth = 2;

    ctx.strokeRect(
      emblemX - 4,
      emblemY - 4,
      emblemSize + 8,
      emblemSize + 8
    );

    ctx.drawImage(
      image,
      emblemX,
      emblemY,
      emblemSize,
      emblemSize
    );

    ctx.restore();
  },

  fitText(ctx, text, maxWidth) {
    const value = String(text);

    if (ctx.measureText(value).width <= maxWidth) {
      return value;
    }

    const suffix = '…';
    let result = value;

    while (
      result.length > 0 &&
      ctx.measureText(`${result}${suffix}`).width > maxWidth
    ) {
      result = result.slice(0, -1);
    }

    return `${result}${suffix}`;
  },

  bindInteractions() {
    this.interactionsBound = true;
    this.canvas.style.touchAction = 'none';

    this.canvas.addEventListener(
      'pointerdown',
      event => this.pointerDown(event)
    );

    this.canvas.addEventListener(
      'pointermove',
      event => this.pointerMove(event)
    );

    this.canvas.addEventListener(
      'pointerup',
      event => this.pointerUp(event)
    );

    this.canvas.addEventListener(
      'pointercancel',
      event => this.pointerUp(event)
    );

    this.canvas.addEventListener(
      'wheel',
      event => this.wheel(event),
      { passive: false }
    );
  },

  updateViewport() {
    const rect = this.canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return false;
    }

    this.viewport = {
      width: rect.width,
      height: rect.height,
      dpr:
        this.canvas.width / rect.width ||
        window.devicePixelRatio ||
        1
    };

    return true;
  },

  fitToViewport() {
    if (
      !this.canvas ||
      !this.ctx ||
      !this.updateViewport()
    ) {
      return;
    }

    const planets = this.planets();

    if (!planets.length) {
      return;
    }

    const xs = planets.map(planet => planet.position.x);
    const ys = planets.map(planet => planet.position.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const padding = 54;

    const zoom = Math.min(
      (this.viewport.width - padding * 2) /
        Math.max(1, maxX - minX),
      (this.viewport.height - padding * 2) /
        Math.max(1, maxY - minY),
      1
    );

    this.camera.zoom = Math.max(0.28, zoom);

    this.camera.x =
      this.viewport.width / 2 -
      ((minX + maxX) / 2) * this.camera.zoom;

    this.camera.y =
      this.viewport.height / 2 -
      ((minY + maxY) / 2) * this.camera.zoom;

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

    this.pointers.set(
      event.pointerId,
      this.clientPoint(event.clientX, event.clientY)
    );

    this.dragging = false;
  },

  pointerMove(event) {
    if (!this.pointers.has(event.pointerId)) {
      return;
    }

    const previous = this.pointers.get(event.pointerId);

    const current = this.clientPoint(
      event.clientX,
      event.clientY
    );

    this.pointers.set(event.pointerId, current);

    const points = [...this.pointers.values()];

    if (points.length === 1) {
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;

      if (dx || dy) {
        this.camera.x += dx;
        this.camera.y += dy;

        this.dragging =
          this.dragging ||
          Math.hypot(dx, dy) > 2;

        this.render();
      }

      return;
    }

    if (points.length === 2) {
      const other = points.find(point => point !== current);

      const oldDistance =
        Math.hypot(
          previous.x - other.x,
          previous.y - other.y
        ) || 1;

      const newDistance =
        Math.hypot(
          current.x - other.x,
          current.y - other.y
        ) || 1;

      this.zoomAt(
        {
          x: (current.x + other.x) / 2,
          y: (current.y + other.y) / 2
        },
        newDistance / oldDistance
      );

      this.dragging = true;
    }
  },

  pointerUp(event) {
    if (!this.pointers.has(event.pointerId)) {
      return;
    }

    if (!this.dragging && this.pointers.size === 1) {
      const point = this.worldPoint(
        event.clientX,
        event.clientY
      );

      const clickedPlanet =
        this.planets().find(planet => {
          return (
            Math.hypot(
              point.x - planet.position.x,
              point.y - planet.position.y
            ) <= 22
          );
        }) || null;

      this.selectedPlanet = clickedPlanet;

      this.render();
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
    const worldX =
      (point.x - this.camera.x) / this.camera.zoom;

    const worldY =
      (point.y - this.camera.y) / this.camera.zoom;

    this.camera.zoom = Math.max(
      0.28,
      Math.min(3, this.camera.zoom * factor)
    );

    this.camera.x =
      point.x - worldX * this.camera.zoom;

    this.camera.y =
      point.y - worldY * this.camera.zoom;

    this.render();
  },

  render() {
    if (
      !this.ctx ||
      !this.canvas ||
      !this.updateViewport()
    ) {
      return;
    }

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

    for (const planet of this.planets()) {
      for (const targetId of planet.routes || []) {
        const key = [planet.id, targetId]
          .sort()
          .join('-');

        if (seen.has(key)) {
          continue;
        }

        seen.add(key);

        const target = this.getPlanetById(targetId);

        if (!target) {
          continue;
        }

        ctx.beginPath();

        ctx.moveTo(
          planet.position.x,
          planet.position.y
        );

        ctx.lineTo(
          target.position.x,
          target.position.y
        );

        ctx.strokeStyle = '#333355';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  },

  drawPlanets(ctx) {
    const playerCapital = this.getPlayerCapital();

    for (const planet of this.planets()) {
      const status = this.getTerritoryStatus(planet);
      const faction = this.getFaction(planet);

      const color = this.getStatusColor(
        status,
        faction?.color || '#666666'
      );

      ctx.beginPath();

      ctx.arc(
        planet.position.x,
        planet.position.y,
        15,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = color;
      ctx.fill();

      if (planet.id === playerCapital) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 4;
      } else if (
        this.selectedPlanet &&
        this.selectedPlanet.id === planet.id
      ) {
        ctx.strokeStyle = '#55d9ff';
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
      }

      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';

      ctx.fillText(
        planet.name,
        planet.position.x,
        planet.position.y - 20
      );
    }
  },

  drawPlanetInfo(ctx, planet) {
    const status = this.getTerritoryStatus(planet);
    const faction = this.getFaction(planet);

    const resources = this.getPlanetResources(planet);

    const routes = this.getPlanetRoutes(planet)
      .map(routeId => this.formatPlanetName(routeId))
      .join(' · ');

    const planetType = this.formatPlanetType(
      this.getPlanetType(planet)
    );

    const phase = this.getPhaseInfo();

    const isCapital =
      planet.id === this.getPlayerCapital();

    const panelWidth = Math.min(
      294,
      this.viewport.width - 24
    );

    const panelX = 12;
    const panelY = 12;

    const panelHeight =
      phase.id === 'command'
        ? 286
        : 254;

    const borderColor = this.getStatusColor(
      status,
      faction?.color || '#666666'
    );

    const emblemSize = 32;

    const titleMaxWidth =
      panelWidth -
      emblemSize -
      50;

    ctx.fillStyle = 'rgba(3, 7, 25, 0.94)';

    ctx.fillRect(
      panelX,
      panelY,
      panelWidth,
      panelHeight
    );

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;

    ctx.strokeRect(
      panelX,
      panelY,
      panelWidth,
      panelHeight
    );

    this.drawFactionEmblem(
      ctx,
      planet,
      status,
      panelX,
      panelY,
      panelWidth
    );

    ctx.textAlign = 'left';

    ctx.font = 'bold 17px Arial';
    ctx.fillStyle = '#ffffff';

    ctx.fillText(
      this.fitText(
        ctx,
        planet.name.toUpperCase(),
        titleMaxWidth
      ),
      panelX + 14,
      panelY + 27
    );

    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = borderColor;

    const statusText = isCapital
      ? `★ CAPITAL · ${this.getStatusLabel(status)}`
      : this.getStatusLabel(status);

    ctx.fillText(
      this.fitText(
        ctx,
        statusText,
        titleMaxWidth
      ),
      panelX + 14,
      panelY + 47
    );

    ctx.fillStyle = '#dce5ff';
    ctx.font = '12px Arial';

    ctx.fillText(
      `Dueño: ${this.getOwnerLabel(planet, status)}`,
      panelX + 14,
      panelY + 71
    );

    ctx.fillText(
      `Tipo: ${planetType}`,
      panelX + 14,
      panelY + 91
    );

    ctx.fillStyle = '#9fb2df';
    ctx.font = 'bold 11px Arial';

    ctx.fillText(
      'PRODUCCIÓN POR TURNO',
      panelX + 14,
      panelY + 116
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';

    ctx.fillText(
      `Créditos: ${resources.credits || 0}`,
      panelX + 14,
      panelY + 138
    );

    ctx.fillText(
      `Minerales: ${resources.minerals || 0}`,
      panelX + 146,
      panelY + 138
    );

    ctx.fillText(
      `Energía: ${resources.energy || 0}`,
      panelX + 14,
      panelY + 159
    );

    ctx.fillText(
      `Investigación: ${resources.research || 0}`,
      panelX + 146,
      panelY + 159
    );

    ctx.fillStyle = '#9fb2df';
    ctx.font = 'bold 11px Arial';

    ctx.fillText(
      'RUTAS CONECTADAS',
      panelX + 14,
      panelY + 184
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';

    this.drawWrappedText(
      ctx,
      routes || 'Ninguna',
      panelX + 14,
      panelY + 204,
      panelWidth - 28,
      16,
      2
    );

    ctx.fillStyle = '#9fb2df';
    ctx.font = 'bold 11px Arial';

    ctx.fillText(
      `FASE: ${phase.label.toUpperCase()} · PM: ${phase.commandPoints}`,
      panelX + 14,
      panelY + 244
    );

    if (phase.id === 'command') {
      ctx.fillStyle = '#7485b8';
      ctx.font = '11px Arial';

      const actionText =
        status === 'player'
          ? 'Mando: refuerzos y flotas próximamente.'
          : 'Conquista disponible en la fase militar.';

      ctx.fillText(
        actionText,
        panelX + 14,
        panelY + 267
      );
    }
  },

  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = String(text).split(' ');

    let line = '';
    let lineCount = 0;

    for (const word of words) {
      const testLine = line
        ? `${line} ${word}`
        : word;

      const width = ctx.measureText(testLine).width;

      if (
        width > maxWidth &&
        line &&
        lineCount < maxLines - 1
      ) {
        ctx.fillText(
          line,
          x,
          y + lineCount * lineHeight
        );

        line = word;
        lineCount += 1;
      } else {
        line = testLine;
      }
    }

    if (line && lineCount < maxLines) {
      ctx.fillText(
        line,
        x,
        y + lineCount * lineHeight
      );
    }
  }
};

window.MapSystem = MapSystem;
