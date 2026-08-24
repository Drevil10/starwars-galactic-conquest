// Sistema de renderizado del mapa galá¡¡ctico
// Dibuja planetas, rutas y muestra información de facciones

const MapSystem = {
  canvas: null,
  ctx: null,
  camera: { x: 0, y: 0, zoom: 1 },
  selectedPlanet: null,
  hoveredPlanet: null,

  // Inicializar el sistema de mapa
  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setupInteractions();
  },

  // Configurar interacciones (clic, hover, zoom)
  setupInteractions() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('wheel', (e) => this.handleZoom(e));
  },

  // Manejar movimiento del rató¡¡¡n (hover)
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - this.camera.x) / this.camera.zoom;
    const mouseY = (e.clientY - rect.top - this.camera.y) / this.camera.zoom;

    this.hoveredPlanet = this.findPlanetAtPosition(mouseX, mouseY);
  },

  // Manejar clic (selecció¡¡¡n)
  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - this.camera.x) / this.camera.zoom;
    const mouseY = (e.clientY - rect.top - this.camera.y) / this.camera.zoom;

    this.selectedPlanet = this.findPlanetAtPosition(mouseX, mouseY);
    
    if (this.selectedPlanet) {
      console.log('Planeta seleccionado:', this.selectedPlanet.name);
      // Aquí se podrí¡¡a abrir un panel de información
    }
  },

  // Manejar zoom
  handleZoom(e) {
    e.preventDefault();
    const zoomSpeed = 0.1;
    
    if (e.deltaY < 0) {
      this.camera.zoom = Math.min(this.camera.zoom + zoomSpeed, 3);
    } else {
      this.camera.zoom = Math.max(this.camera.zoom - zoomSpeed, 0.5);
    }
  },

  // Encontrar planeta en una posició¡¡¡n
  findPlanetAtPosition(x, y) {
    const planetRadius = 15;
    
    for (const system of galaxyMap.systems) {
      for (const planet of system.planets) {
        const dx = x - planet.position.x;
        const dy = y - planet.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= planetRadius) {
          return planet;
        }
      }
    }
    return null;
  },

  // Renderizar el mapa completo
  render() {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Limpiar canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // Dibujar rutas primero (para que estén detrás de los planetas)
    this.drawRoutes();

    // Dibujar planetas
    this.drawPlanets();

    // Dibujar información del planeta seleccionado
    if (this.selectedPlanet) {
      this.drawPlanetInfo(this.selectedPlanet);
    }

    ctx.restore();
  },

  // Dibujar rutas entre planetas
  drawRoutes() {
    const ctx = this.ctx;
    const drawnRoutes = new Set();

    for (const system of galaxyMap.systems) {
      for (const planet of system.planets) {
        for (const routeTarget of planet.routes) {
          // Evitar dibujar la misma ruta dos veces
          const routeKey = [planet.id, routeTarget].sort().join('-');
          if (drawnRoutes.has(routeKey)) continue;
          drawnRoutes.add(routeKey);

          // Buscar el planeta objetivo
          const targetPlanet = this.findPlanetById(routeTarget);
          if (!targetPlanet) continue;

          // Dibujar lí­nea de ruta
          ctx.beginPath();
          ctx.moveTo(planet.position.x, planet.position.y);
          ctx.lineTo(targetPlanet.position.x, targetPlanet.position.y);
          ctx.strokeStyle = '#333355';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
  },

  // Dibujar planetas
  drawPlanets() {
    const ctx = this.ctx;
    const planetRadius = 15;

    for (const system of galaxyMap.systems) {
      for (const planet of system.planets) {
        const faction = galaxyMap.factions[planet.owner];
        const color = faction ? faction.color : '#666666';

        // Dibujar planeta
        ctx.beginPath();
        ctx.arc(planet.position.x, planet.position.y, planetRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dibujar nombre del planeta
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, planet.position.x, planet.position.y - 20);

        // Resaltar si está hover
        if (this.hoveredPlanet === planet) {
          ctx.beginPath();
          ctx.arc(planet.position.x, planet.position.y, planetRadius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffff00';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }
    }
  },

  // Dibujar información del planeta seleccionado
  drawPlanetInfo(planet) {
    const ctx = this.ctx;
    const faction = galaxyMap.factions[planet.owner];

    // Panel de información
    const panelX = 20;
    const panelY = 20;
    const panelWidth = 250;
    const panelHeight = 180;

    // Fondo del panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeStyle = faction ? faction.color : '#666666';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // Título
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(planet.name, panelX + 10, panelY + 25);

    // Tipo
    ctx.font = '12px Arial';
    ctx.fillText(`Tipo: ${planet.type}`, panelX + 10, panelY + 50);

    // Dueñ¡¡¡o
    ctx.fillText(`Dueñ¡¡¡o: ${faction ? faction.name : 'Desconocido'}`, panelX + 10, panelY + 70);

    // Recursos
    ctx.fillText('Recursos:', panelX + 10, panelY + 95);
    ctx.fillText(`  Créditos: ${planet.resources.credits}`, panelX + 20, panelY + 115);
    ctx.fillText(`  Minerales: ${planet.resources.minerals}`, panelX + 20, panelY + 135);
    ctx.fillText(`  Energía: ${planet.resources.energy}`, panelX + 20, panelY + 155);
  },

  // Buscar planeta por ID
  findPlanetById(id) {
    for (const system of galaxyMap.systems) {
      for (const planet of system.planets) {
        if (planet.id === id) {
          return planet;
        }
      }
    }
    return null;
  }
};
