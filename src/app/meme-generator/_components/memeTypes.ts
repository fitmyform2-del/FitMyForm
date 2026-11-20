export type MemeLayoutMode = 'classic' | 'modern-header' | 'demotivational' | 'bottom-bar';

export type MemeFilter = 'none' | 'deepfry' | 'grayscale' | 'sepia' | 'invert' | 'high-contrast' | 'vintage';

export interface MemeText {
  id: string;
  text: string;
  fontFamily: string;
  fontSizeRatio: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  align: 'left' | 'center' | 'right';
  isUppercase: boolean;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  rotation: number; // -45 to 45 deg
  shadow: boolean;
}

export interface MemeSticker {
  id: string;
  emoji: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  sizePercent: number; // 6 to 30
  rotation: number; // -180 to 180 deg
}

export interface MemeImageSettings {
  filter: MemeFilter;
  brightness: number; // 50 to 150
  contrast: number; // 50 to 180
  saturation: number; // 0 to 250
  rotation: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
  watermarkText: string;
  showWatermark: boolean;
}

export interface MemeExportSettings {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number; // 0.7 to 1.0
}

export interface TemplateSlot {
  id: string;
  name: string;
  description: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}

export interface MemeImageOverlay {
  id: string;
  url: string;
  name: string;
  slotId?: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  rotation: number;
  opacity: number;
  fit: 'cover' | 'contain';
}

export interface MemeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'popular' | 'two-panel' | 'news' | 'classic';
  slots?: TemplateSlot[];
  defaultTexts?: Partial<MemeText>[];
  defaultTopText: string;
  defaultBottomText: string;
  viralCaptions?: { top: string; bottom: string }[];
  suggestedCaptions?: { top: string; bottom: string }[];
  createDataUrl: () => string;
}

export interface TextStylePreset {
  id: string;
  name: string;
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  shadow: boolean;
  isUppercase: boolean;
}

export const TEXT_STYLE_PRESETS: TextStylePreset[] = [
  { id: 'classic', name: 'Classic Impact', fontFamily: 'Impact', color: '#FFFFFF', strokeColor: '#000000', strokeWidth: 4, shadow: true, isUppercase: true },
  { id: 'subtitle', name: 'Yellow Subtitle', fontFamily: 'Arial Black', color: '#FACC15', strokeColor: '#000000', strokeWidth: 3, shadow: true, isUppercase: false },
  { id: 'clean', name: 'Modern Clean', fontFamily: 'Montserrat', color: '#0F172A', strokeColor: 'transparent', strokeWidth: 0, shadow: false, isUppercase: false },
  { id: 'cyber', name: 'Cyber Neon', fontFamily: 'Impact', color: '#4ADE80', strokeColor: '#000000', strokeWidth: 3, shadow: true, isUppercase: true },
  { id: 'alert', name: 'Breaking Red', fontFamily: 'Impact', color: '#EF4444', strokeColor: '#FFFFFF', strokeWidth: 3, shadow: true, isUppercase: true }
];

export const MEME_FONTS = [
  { id: 'Impact', name: 'Impact (Classic)' },
  { id: 'Arial Black', name: 'Arial Black (Bold)' },
  { id: 'Montserrat', name: 'Montserrat (Modern)' },
  { id: 'Comic Sans MS', name: 'Comic Sans (Doge)' },
  { id: 'Anton', name: 'Anton (Tall)' },
  { id: 'Courier New', name: 'Courier (Code/Type)' },
  { id: 'Georgia', name: 'Georgia (Serif)' },
];

export const POPULAR_STICKERS = [
  '😂', '🔥', '💀', '🤡', '🕶️', '🧢', '💯', '🧠',
  '❓', '🚨', '🍿', '🐸', '🗿', '🤦', '💥', '💩',
  '💰', '👑', '👀', '✨', '⚡', '💣', '🎉', '🏆'
];

export const FUNNY_RANDOM_CAPTIONS: { top: string; bottom: string }[] = [
  { top: 'WHEN CODE WORKS ON FIRST TRY', bottom: 'BUT YOU FORGOT TO SAVE THE FILE' },
  { top: 'ME EXPLAINING A BUG TO MANAGER', bottom: 'IT WORKS PERFECTLY ON MY LAPTOP' },
  { top: 'NOBODY:', bottom: 'MY BRAIN AT 3 AM THINKING ABOUT 2014' },
  { top: 'I HAVE READ AND AGREE TO', bottom: 'THE TERMS AND CONDITIONS (BIGGEST LIE)' },
  { top: 'PROMISES TO GO TO SLEEP EARLY', bottom: 'WATCHES DEEP SEA DOCUMENTARY UNTIL 4 AM' },
  { top: 'ONE CLICK RESIZE COMPLETE', bottom: 'APPLICATION FORM ACCEPTED INSTANTLY' },
  { top: 'I RECEIVE: 5 MINUTES OF ATTENTION', bottom: 'YOU RECEIVE: LIFELONG FRIENDSHIP' },
  { top: 'WAIT, IT WAS ALL JAVASCRIPT?', bottom: 'ALWAYS HAS BEEN 🔫' }
];

export const INITIAL_TEXTS: MemeText[] = [
  {
    id: '1',
    text: 'WHEN YOU FINALLY RESIZE',
    fontFamily: 'Impact',
    fontSizeRatio: 0.08,
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 4,
    align: 'center',
    isUppercase: true,
    xPercent: 50,
    yPercent: 12,
    rotation: 0,
    shadow: true
  },
  {
    id: '2',
    text: 'YOUR EXAM PHOTO IN 1 CLICK',
    fontFamily: 'Impact',
    fontSizeRatio: 0.08,
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 4,
    align: 'center',
    isUppercase: true,
    xPercent: 50,
    yPercent: 88,
    rotation: 0,
    shadow: true
  }
];

export const INITIAL_IMAGE_SETTINGS: MemeImageSettings = {
  filter: 'none',
  brightness: 100,
  contrast: 100,
  saturation: 100,
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
  watermarkText: 'FitMyForm Meme Studio',
  showWatermark: false
};

