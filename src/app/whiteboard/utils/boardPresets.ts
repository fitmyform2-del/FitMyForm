import { BackgroundType, WhiteboardBoard, WhiteboardPage } from '../types/whiteboard';
import { createId } from './canvasInteraction';

export interface BoardPreset {
  id: string;
  name: string;
  description: string;
  background: BackgroundType;
  defaultStrokeColor: string;
  badge: string;
  themeColor: string;
}

export const BOARD_PRESETS: BoardPreset[] = [
  {
    id: 'plain-white',
    name: 'Plain Whiteboard',
    description: 'Clean pure white canvas, ideal for diagrams, mindmaps & quick sketches',
    background: 'blank',
    defaultStrokeColor: '#000000',
    badge: 'Whiteboard',
    themeColor: '#ffffff'
  },
  {
    id: 'blackboard',
    name: 'Classic Blackboard',
    description: 'Dark slate chalkboard with high-contrast chalk-style drawing',
    background: 'blackboard',
    defaultStrokeColor: '#ffffff',
    badge: 'Chalkboard',
    themeColor: '#1e293b'
  },
  {
    id: 'greenboard',
    name: 'Classroom Greenboard',
    description: 'Traditional school green chalkboard for lessons & exercises',
    background: 'greenboard',
    defaultStrokeColor: '#fef08a',
    badge: 'Green Chalk',
    themeColor: '#1b382b'
  },
  {
    id: 'math-grid',
    name: 'Math & Graph Board',
    description: 'Coordinate quad grid for mathematics, plotting, geometry & physics',
    background: 'grid-sm',
    defaultStrokeColor: '#1d4ed8',
    badge: 'Graph Grid',
    themeColor: '#3b82f6'
  },
  {
    id: 'lined-notebook',
    name: 'Ruled Notebook',
    description: 'Lined paper with red margin line for handwriting, essays & notes',
    background: 'lined',
    defaultStrokeColor: '#1e293b',
    badge: 'Notebook',
    themeColor: '#e2e8f0'
  },
  {
    id: 'dot-grid',
    name: 'Dot Grid Journal',
    description: 'Subtle dot matrix for UI wireframes, bullet journaling & diagrams',
    background: 'dots',
    defaultStrokeColor: '#7c3aed',
    badge: 'Dot Grid',
    themeColor: '#a855f7'
  },
  {
    id: 'isometric-3d',
    name: 'Isometric 3D Board',
    description: 'Equilateral triangle grid for 3D drawing, geometric shapes & CAD sketches',
    background: 'isometric',
    defaultStrokeColor: '#0284c7',
    badge: 'Isometric',
    themeColor: '#0ea5e9'
  },
  {
    id: 'music-staff',
    name: 'Music Staff Board',
    description: '5-line musical staves for notation, chords, scales & music theory',
    background: 'music',
    defaultStrokeColor: '#000000',
    badge: 'Manuscript',
    themeColor: '#fdfbf7'
  }
];

export function createNewBoard(presetId = 'plain-white', customTitle?: string): WhiteboardBoard {
  const preset = BOARD_PRESETS.find((p) => p.id === presetId) || BOARD_PRESETS[0];
  const title = customTitle || `${preset.name} ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

  const firstPage: WhiteboardPage = {
    id: createId('page'),
    name: 'Page 1',
    background: preset.background,
    elements: []
  };

  return {
    id: createId('board'),
    title,
    boardType: preset.background,
    pages: [firstPage],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
