export const MEME_PRESETS = [
  { id: 'two-panel', name: 'Two-Tone Split' },
  { id: 'breaking-news', name: 'Breaking News' },
  { id: 'thinking', name: 'Big Brain Idea' },
  { id: 'classic-dark', name: 'Midnight Studio' }
];

export function createPresetDataUrl(type: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 700;
  const ctx = canvas.getContext('2d')!;

  if (type === 'two-panel') {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, 0, 700, 350);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 350, 700, 350);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 700, 700);
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.lineTo(700, 350);
    ctx.stroke();
  } else if (type === 'breaking-news') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 700, 700);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 520, 700, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Impact, sans-serif';
    ctx.fillText('⚡ BREAKING NEWS', 30, 575);
  } else if (type === 'thinking') {
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, 700, 700);
    ctx.font = '160px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💡', 350, 350);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 700, 700);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 700, 700);
  }

  return canvas.toDataURL('image/jpeg', 0.95);
}
