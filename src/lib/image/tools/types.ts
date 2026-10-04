export interface FilterOptions {
  brightness: number; // 0 to 200 (default 100)
  contrast: number; // 0 to 200 (default 100)
  saturate: number; // 0 to 200 (default 100)
  grayscale: number; // 0 to 100 (default 0)
  sepia: number; // 0 to 100 (default 0)
  invert: number; // 0 to 100 (default 0)
  blur: number; // 0 to 20 (default 0)
  hueRotate: number; // 0 to 360 (default 0)
}

export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  imageSrc?: string;
  opacity: number; // 0 to 1
  rotation: number; // degrees
  fontSize: number; // px
  fontColor: string;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile';
}

export interface BlurBox {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'pixelate' | 'gaussian' | 'censor';
  intensity: number;
}
