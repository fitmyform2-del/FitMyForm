export function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function triggerBlobDownload(blob: Blob, baseName: string, format: string) {
  const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `meme-${baseName.replace(/\.[^/.]+$/, '')}.${ext}`;
  a.click();
  URL.revokeObjectURL(a.href);
}
