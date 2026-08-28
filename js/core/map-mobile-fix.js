// js/core/map-mobile-fix.js
// Organización, inicialización y capa visual segura del mapa.

(function () {
  const visualState = {
    installed: false
  };

  function applyGalacticLayout() {
    if (
      typeof galaxyMap === 'undefined' ||
      !Array.isArray(galaxyMap.systems)
    ) {
      return;
    }

    const layout = {
      coruscant: {
        x: 500,
        y: 360,
        routes: ['corellia', 'alderaan', 'naboo']
      },
      corellia: {
        x: 350,
        y: 470,
        routes: ['coruscant', 'alderaan', 'tatooine']
      },
      alderaan: {
        x: 620,
        y: 480,
        routes: ['coruscant', 'corellia', 'naboo', 'kamino']
      },
      naboo: {
        x: 510,
        y: 630,
        routes: ['coruscant', 'alderaan', 'tatooine', 'kashyyyk']
      },
      kamino: {
        x: 760,
        y: 610,
        routes: ['alderaan', 'naboo', 'geonosis', 'mandalore']
      },
      tatooine: {
        x: 260,
        y: 780,
        routes: ['corellia', 'naboo', 'geonosis']
      },
      geonosis: {
        x: 450,
        y: 850,
        routes: ['tatooine', 'kamino', 'utapau']
      },
      utapau: {
        x: 620,
        y: 930,
        routes: ['geonosis', 'mustafar', 'kashyyyk']
      },
      mustafar: {
        x: 790,
        y: 900,
        routes: ['utapau', 'kashyyyk', 'ryloth']
      },
      kashyyyk: {
        x: 700,
        y: 760,
        routes: ['naboo', 'utapau', 'mustafar', 'ryloth']
      },
      ryloth: {
        x: 880,
        y: 770,
        routes: ['mustafar', 'kashyyyk', 'lothal', 'jakku']
      },
      lothal: {
        x: 1010,
        y: 650,
        routes: ['ryloth', 'mandalore', 'endor']
      },
      mandalore: {
        x: 920,
        y: 480,
        routes: ['kamino', 'lothal', 'hoth']
      },
      hoth: {
        x: 1110,
        y: 410,
        routes: ['mandalore', 'endor']
      },
      endor: {
        x: 1130,
        y: 650,
        routes: ['hoth', 'lothal', 'jakku']
      },
      jakku: {
        x: 1050,
        y: 870,
        routes: ['ryloth', 'endor']
      }
    };

    galaxyMap.systems.forEach(system => {
      (system.planets || []).forEach(planet => {
        const config = layout[planet.id];

        if (!config) {
          return;
        }

        planet.position = {
          x: config.x,
          y: config.y
        };

        planet.routes = config.routes;
      });
    });

    window.galaxyMap = galaxyMap;
  }

  function routeStyle(source, target) {
    if (
      source.routeStatus &&
      source.routeStatus[target.id] === 'blocked'
    ) {
      return {
        color: '#d95656',
        dash: [8, 6],
        width: 2.5
      };
    }

    if (
      source.owner !== target.owner &&
      source.owner !== 'neutral' &&
      target.owner !== 'neutral'
    ) {
      return {
        color: '#d8a33e',
        dash: [],
        width: 2.4
      };
    }

    return {
      color: '#3b466f',
      dash: [],
      width: 2
    };
  }

  function drawBackdrop(ctx) {
    const stars = [
      [180, 220, 1],
      [275, 325, 1.4],
      [395, 250, 0.8],
      [610, 270, 1.2],
      [780, 330, 0.9],
      [940, 260, 1.5],
      [210, 570, 0.8],
      [330, 650, 1.1],
      [460, 720, 0.7],
      [590, 540, 1.4],
      [740, 690, 1],
      [880, 580, 1.3],
      [1040, 760, 0.9],
      [220, 930, 1.2],
      [480, 990, 0.8],
      [680, 1030, 1.3],
      [920, 960, 0.9],
      [1140, 900, 1.1]
    ];

    ctx.save();

    ctx.fillStyle = '#b8d7ff';

    stars.forEach(([x, y, radius]) => {
      ctx.globalAlpha = 0.22 + radius * 0.1;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 0.32;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';

    ctx.fillStyle = '#6d81b9';
    ctx.fillText('NÚCLEO', 490, 265);

    ctx.fillStyle = '#557da2';
    ctx.fillText('BORDE MEDIO', 640, 710);

    ctx.fillStyle = '#8a6c8e';
    ctx.fillText('BORDE EXTERIOR', 540, 1015);

    ctx.fillStyle = '#85705c';
    ctx.fillText('FRONTERA', 1010, 345);

    ctx.restore();
  }

  function installVisualLayer() {
    if (
      visualState.installed ||
      typeof MapSystem === 'undefined'
    ) {
      return;
    }

    visualState.installed = true;

    const originalPlanets =
      MapSystem.drawPlanets.bind(MapSystem);

    MapSystem.drawRoutes = function (ctx) {
      drawBackdrop(ctx);

      const planets = this.planets();
      const seen = new Set();

      for (const planet of planets) {
        for (const targetId of planet.routes || []) {
          const key = [planet.id, targetId]
            .sort()
            .join('-');

          if (seen.has(key)) {
            continue;
          }

          seen.add(key);

          const target = planets.find(candidate => {
            return candidate.id === targetId;
          });

          if (!target) {
            continue;
          }

          const style = routeStyle(planet, target);

          ctx.beginPath();

          ctx.moveTo(
            planet.position.x,
            planet.position.y
          );

          ctx.lineTo(
            target.position.x,
            target.position.y
          );

          ctx.strokeStyle = style.color;
          ctx.lineWidth = style.width;
          ctx.setLineDash(style.dash);
          ctx.stroke();
        }
      }

      ctx.setLineDash([]);
    };

    MapSystem.drawPlanets = function (ctx) {
      originalPlanets(ctx);

      if (!this.selectedPlanet) {
        return;
      }

      const planet = this.selectedPlanet;

      ctx.save();

      ctx.beginPath();

      ctx.arc(
        planet.position.x,
        planet.position.y,
        23,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle = '#f4c34d';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#f4c34d';
      ctx.shadowBlur = 12;
      ctx.stroke();

      ctx.restore();
    };
  }

  function showMap() {
    const canvas = document.getElementById('game-canvas');

    if (
      !canvas ||
      typeof MapSystem === 'undefined'
    ) {
      return;
    }

    applyGalacticLayout();
    installVisualLayer();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) {
          return;
        }

        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);

        MapSystem.init(canvas);
        MapSystem.fitToViewport();
      });
    });
  }

  window.addEventListener('load', () => {
    const startButton = document.getElementById('start-btn');

    if (startButton) {
      startButton.addEventListener(
        'click',
        showMap
      );
    }

    document
      .querySelectorAll('[data-tab="map"]')
      .forEach(button => {
        button.addEventListener(
          'click',
          showMap
        );
      });

    window.addEventListener('resize', showMap);

    window.addEventListener(
      'orientationchange',
      () => {
        setTimeout(showMap, 180);
      }
    );
  });
})();
