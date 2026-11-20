function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fill();
}

export function createDrakeTemplate(): string {
  const c = document.createElement('canvas');
  c.width = 720;
  c.height = 720;
  const ctx = c.getContext('2d')!;

  // Top-Left Dislike Reaction
  const topGrad = ctx.createLinearGradient(0, 0, 360, 360);
  topGrad.addColorStop(0, '#f97316');
  topGrad.addColorStop(1, '#ea580c');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 360, 360);

  // Dislike Badge & Character
  ctx.fillStyle = '#dc2626';
  drawRoundedRect(ctx, 20, 20, 140, 36, 8);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 18px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('❌ NOPE / NAH', 90, 44);

  ctx.font = '110px sans-serif';
  ctx.fillText('🤦‍♂️🤚', 180, 220);

  // Bottom-Left Like Reaction
  const botGrad = ctx.createLinearGradient(0, 360, 360, 720);
  botGrad.addColorStop(0, '#22c55e');
  botGrad.addColorStop(1, '#16a34a');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, 360, 360, 360);

  // Like Badge & Character
  ctx.fillStyle = '#15803d';
  drawRoundedRect(ctx, 20, 380, 140, 36, 8);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 18px Impact, sans-serif';
  ctx.fillText('✅ YEP / LIKE', 90, 404);

  ctx.font = '110px sans-serif';
  ctx.fillText('😏👉', 180, 580);

  // Right column (Clean white slots for images or text)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(360, 0, 360, 720);

  // Grid Borders
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 720, 720);
  ctx.beginPath();
  ctx.moveTo(0, 360);
  ctx.lineTo(720, 360);
  ctx.moveTo(360, 0);
  ctx.lineTo(360, 720);
  ctx.stroke();

  return c.toDataURL('image/jpeg', 0.95);
}

export function createSideBySideTemplate(): string {
  const c = document.createElement('canvas');
  c.width = 720;
  c.height = 480;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 720, 480);

  // Center line
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 720, 480);
  ctx.beginPath();
  ctx.moveTo(360, 0);
  ctx.lineTo(360, 480);
  ctx.stroke();

  // Subtle labels on top
  ctx.fillStyle = '#0f172a';
  drawRoundedRect(ctx, 20, 16, 170, 32, 8);
  drawRoundedRect(ctx, 380, 16, 170, 32, 8);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 16px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('👈 EXPECTATION', 105, 38);
  ctx.fillText('REALITY 👉', 465, 38);

  return c.toDataURL('image/jpeg', 0.95);
}

export function createTopBottomTemplate(): string {
  const c = document.createElement('canvas');
  c.width = 720;
  c.height = 720;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 720, 720);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 720, 720);
  ctx.beginPath();
  ctx.moveTo(0, 360);
  ctx.lineTo(720, 360);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  drawRoundedRect(ctx, 20, 16, 180, 32, 8);
  drawRoundedRect(ctx, 20, 376, 180, 32, 8);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 16px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('▲ HOW IT STARTED', 110, 38);
  ctx.fillText('▼ HOW IT IS GOING', 110, 398);

  return c.toDataURL('image/jpeg', 0.95);
}

export function createFourGridTemplate(): string {
  const c = document.createElement('canvas');
  c.width = 720;
  c.height = 720;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 720, 720);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 720, 720);
  ctx.beginPath();
  ctx.moveTo(360, 0);
  ctx.lineTo(360, 720);
  ctx.moveTo(0, 360);
  ctx.lineTo(720, 360);
  ctx.stroke();

  return c.toDataURL('image/jpeg', 0.95);
}

export function createTwoButtonsTemplate(): string {
  const c = document.createElement('canvas');
  c.width = 720;
  c.height = 720;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 720, 460);

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.ellipse(220, 230, 110, 70, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(500, 230, 110, 70, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 460, 720, 260);
  ctx.font = '120px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('😰💦', 360, 580);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 720, 720);

  return c.toDataURL('image/jpeg', 0.95);
}

export function createBreakingNewsTemplate(): string {
  const c = document.createElement('canvas');
  c.width = 720;
  c.height = 540;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 720, 540);

  ctx.font = '120px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎙️🎬', 360, 220);

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 380, 720, 70);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px Impact, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('⚡ BREAKING NEWS', 30, 426);

  ctx.fillStyle = '#facc15';
  ctx.fillRect(30, 40, 110, 40);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('● LIVE', 85, 66);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 450, 720, 90);

  return c.toDataURL('image/jpeg', 0.95);
}
