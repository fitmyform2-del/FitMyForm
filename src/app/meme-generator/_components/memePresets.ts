import { MemeTemplate } from './memeTypes';
import { MEME_TEMPLATES } from './templateData';

export { MEME_TEMPLATES };
export const MEME_PRESETS = MEME_TEMPLATES;

export function createPresetDataUrl(type: string): string {
  const found = MEME_TEMPLATES.find((t) => t.id === type);
  return found ? found.createDataUrl() : MEME_TEMPLATES[0].createDataUrl();
}

export function getTemplateById(type: string): MemeTemplate | undefined {
  return MEME_TEMPLATES.find((t) => t.id === type);
}
