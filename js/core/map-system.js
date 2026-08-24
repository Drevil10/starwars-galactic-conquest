const MapSystem = {
  canvas: null,
  ctx: null,
  camera: { x: 0, y: 0, zoom: 1 },
  planets: [],
  routes: [],
  selectedPlanet: null,
  dpr: 1,
  cssWidth: 0,
  cssHeight: 0,
  initialized: false,

  init() {
    this.canvas = document.getElementById('game-canvas');
    if (!this.canvas || this.initialized) return;
    this.ctx = this.canvas.getContext('2d');
    this.planets = (window.MAP_DATA && MAP_DATA.planets) || window.planets || [];
    this.routes = (window.MAP_DATA && MAP_DATA.routes) || window.routes || [];
    this.initialized = true;
    this.bindEvents();
    this.fitToViewport();
  },

  bindEvents() {
    window.addEventListener('resize', () => this.fitToViewport());
    this.canvas.addEventListener('click', event => this.handleClick(event));
  },

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.cssWidth = Math.max(1, rect.width);
    this.cssHeight = Math.max(1, rect.height);
    this.dpr = window.devicePixelRatio || 1;
    const width = Math.round(this.cssWidth * this.dpr);
    const height = Math.round(this.cssHeight * this.dpr);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  },

  getBounds() {
    if (!this.planets.length) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
    const xs = this.planets.map(planet => planet.x);
    const ys = this.planets.map(planet => planet.y);
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys)
    };
  },

  fitToViewport() {
    if (!this.initialized) this.init();
    if (!this.canvas || !this.ctx) return;
    this.resizeCanvas();
    if (!this.cssWidth || !this.cssHeight || !this.planets.length) return;

    const bounds = this.getBounds();
    const labelSpace = 54;
    const planetRadius = 24;
    const padding = 34;
    const mapWidth = Math.max(1, bounds.maxX - bounds.minX + (planetRadius + padding) * 2);
    const mapHeight = Math.max(1, bounds.maxY - bounds.minY + (planetRadius + labelSpace + padding) * 2);
    const zoom = Math.min(this.cssWidth / mapWidth, this.cssHeight / mapHeight, 1.15);
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    this.camera = {
      zoom,
      x: this.cssWidth / 2 - centerX * zoom,
      y: this.cssHeight / 2 - centerY * zoom
    };
    this.render();
  },

  project(x, y) {
    return {
      x: x * this.camera.zoom + this.camera.x,
      y: y * this.camera.zoom + this.camera.y
    };
  },

  render() {
    if (!this.ctx || !this.cssWidth || !this.cssHeight) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(124, 134, 212, 0.56)';
    ctx.lineWidth = 2;
    this.routes.forEach(route => {
      const from = this.planets.find(planet => planet.id === route.from || planet.name === route.from);
      const to = this.planets.find(planet => planet.id === route.to || planet.name === route.to);
      if (!from || !to) return;
      const a = this.project(from.x, from.y);
      const b = this.project(to.x, to.y);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    this.planets.forEach(planet => {
      const point = this.project(planet.x, planet.y);
      const radius = Math.max(14, Math.min(23, 24 * this.camera.zoom));
      const owned = planet.owner === 'empire' || planet.faction === 'empire' || planet.control === 'empire';
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = owned ? '#147ed1' : '#757575';
      ctx.fill();
      ctx.strokeStyle = '#eef5ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#f4f6ff';
      ctx.font = '16px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(planet.name, point.x, point.y - radius - 7);
    });
    ctx.restore();
  },

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hitRadius = 30;
    this.selectedPlanet = this.planets.find(planet => {
      const point = this.project(planet.x, planet.y);
      return Math.hypot(point.x - x, point.y - y) <= hitRadius;
    }) || null;
    this.render();
  }
};

window.MapSystem = MapSystem;
window.addEventListener('load', () => MapSystem.init());
