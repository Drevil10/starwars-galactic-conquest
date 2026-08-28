drawPlanetBadge(ctx, x, y, size, planet, status) {
  const faction = this.getFaction(planet);

  const planetColor = this.getStatusColor(
    status,
    faction?.color || '#6f84a8'
  );

  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = Math.max(7, size * 0.27);

  this.drawIconFrame(ctx, x, y, size, '#2f80ed');

  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.35,
    centerY - radius * 0.35,
    radius * 0.1,
    centerX,
    centerY,
    radius * 1.25
  );

  gradient.addColorStop(0, '#d6edff');
  gradient.addColorStop(0.3, planetColor);
  gradient.addColorStop(1, '#102446');

  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, size, size);

  ctx.globalAlpha = 0.38;
  ctx.fillStyle = '#091326';

  ctx.beginPath();
  ctx.ellipse(
    centerX + radius * 0.42,
    centerY - radius * 0.1,
    radius * 0.7,
    radius * 1.2,
    -0.22,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(
    centerX - radius * 0.5,
    centerY + radius * 0.5,
    radius * 0.5,
    radius * 0.26,
    0.45,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();

  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

  ctx.strokeStyle = '#d4e8ff';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
},

drawFactionBadge(ctx, x, y, size, factionId) {
  const factionImage = this.getFactionImage(factionId);

  if (
    factionImage &&
    factionImage.complete &&
    factionImage.naturalWidth
  ) {
    ctx.save();

    ctx.drawImage(
      factionImage,
      x,
      y,
      size,
      size
    );

    ctx.restore();

    return;
  }

  ctx.save();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(
    x + size / 2,
    y + size / 2,
    size * 0.22,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  ctx.restore();
},
