import { MemeText, MemeLayoutMode } from './memeTypes';

export function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const test = `${current} ${words[i]}`;
    if (ctx.measureText(test).width < maxW) {
      current = test;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function renderTexts(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  texts: MemeText[],
  layout: MemeLayoutMode,
  headerH: number,
  marginY: number,
  baseH: number,
  bottomH: number
) {
  texts.forEach((item, index) => {
    if (!item.text.trim()) return;
    const isTopHeader = layout === 'modern-header' && index === 0;
    const isDemotivational = layout === 'demotivational';

    ctx.save();
    let fontSize = Math.max(16, Math.floor(canvas.height * item.fontSizeRatio));
    let fontName = item.fontFamily;
    let textColor = item.color;
    let strokeColor = item.strokeColor;
    const posX = (canvas.width * item.xPercent) / 100;
    let posY = (canvas.height * item.yPercent) / 100;

    if (isTopHeader) {
      textColor = '#0f172a';
      strokeColor = 'transparent';
      fontName = 'Montserrat';
      fontSize = Math.min(32, Math.floor(headerH * 0.45));
      posY = headerH / 2;
    } else if (isDemotivational) {
      strokeColor = 'transparent';
      if (index === 0) {
        textColor = '#f8fafc';
        fontName = 'Georgia';
        fontSize = Math.max(24, Math.floor(bottomH * 0.35));
        posY = marginY + baseH + bottomH * 0.35;
      } else {
        textColor = '#94a3b8';
        fontName = 'Georgia';
        fontSize = Math.max(16, Math.floor(bottomH * 0.22));
        posY = marginY + baseH + bottomH * 0.72;
      }
    }

    ctx.font = `900 ${fontSize}px "${fontName}", sans-serif`;
    ctx.textAlign = item.align;
    ctx.textBaseline = 'middle';

    const rawStr = item.isUppercase ? item.text.toUpperCase() : item.text;
    const maxW = canvas.width * 0.9;
    const lines = wrapLines(ctx, rawStr, maxW);
    const lineHeight = fontSize * 1.18;
    const startY = posY - ((lines.length - 1) * lineHeight) / 2;

    ctx.translate(posX, posY);
    if (item.rotation) ctx.rotate((item.rotation * Math.PI) / 180);
    ctx.translate(-posX, -posY);

    lines.forEach((line, i) => {
      const lineY = startY + i * lineHeight;
      if (item.shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
      }
      if (strokeColor && strokeColor !== 'transparent' && item.strokeWidth > 0) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = item.strokeWidth;
        ctx.strokeText(line, posX, lineY);
      }
      ctx.fillStyle = textColor;
      ctx.fillText(line, posX, lineY);
    });

    ctx.restore();
  });
}
