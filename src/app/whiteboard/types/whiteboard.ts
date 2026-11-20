export type ToolType =
  | 'select'
  | 'pen'
  | 'highlighter'
  | 'brush'
  | 'laser'
  | 'eraser'
  | 'shape'
  | 'text'
  | 'stickynote'
  | 'math'
  | 'manipulative'
  | 'pan';

export type ShapeType =
  | 'rectangle'
  | 'rounded-rect'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'right-triangle'
  | 'star'
  | 'polygon'
  | 'diamond'
  | 'line'
  | 'arrow'
  | 'double-arrow'
  | 'curved-arrow';

export type ManipulativeType =
  | 'ruler'
  | 'protractor'
  | 'number-line'
  | 'fraction-bar'
  | 'ten-frame'
  | 'sticker'
  | 'coordinate-grid'
  | 'venn-diagram';

export type BackgroundType =
  | 'blank'
  | 'grid-sm'
  | 'grid-lg'
  | 'dots'
  | 'lined'
  | 'isometric'
  | 'blackboard'
  | 'greenboard'
  | 'music'
  | 'custom';

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface BaseElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  isLocked?: boolean;
}

export interface StrokeElement extends BaseElement {
  type: 'stroke';
  tool: 'pen' | 'highlighter' | 'brush' | 'laser';
  points: Point[];
  strokeColor: string;
  strokeWidth: number;
  strokeStyle?: StrokeStyle;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  fillColor: string;
  isFilled: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

export interface StickyNoteElement extends BaseElement {
  type: 'stickynote';
  text: string;
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';
  fontSize: number;
}

export interface MathElement extends BaseElement {
  type: 'math';
  latex: string;
  renderedText: string;
  fontSize: number;
  color: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}

export interface ManipulativeElement extends BaseElement {
  type: 'manipulative';
  manipulativeType: ManipulativeType;
  data: Record<string, unknown>;
}

export type WhiteboardElement =
  | StrokeElement
  | ShapeElement
  | TextElement
  | StickyNoteElement
  | MathElement
  | ImageElement
  | ManipulativeElement;

export interface WhiteboardPage {
  id: string;
  name: string;
  background: BackgroundType;
  customBgColor?: string;
  backgroundImage?: string | null;
  elements: WhiteboardElement[];
}

export interface LaserPoint {
  x: number;
  y: number;
  time: number;
  color: string;
}

export interface ToolSettings {
  strokeColor: string;
  fillColor: string;
  isFilled: boolean;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  opacity: number;
  fontSize: number;
  fontFamily: string;
  shapeType: ShapeType;
  stickyColor: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';
  activeWidget: string | null;
}

export interface TransformHandle {
  type: 'nw' | 'ne' | 'se' | 'sw' | 'n' | 'e' | 's' | 'w' | 'rotate';
  x: number;
  y: number;
}

export interface WhiteboardBoard {
  id: string;
  title: string;
  boardType: BackgroundType;
  pages: WhiteboardPage[];
  createdAt: number;
  updatedAt: number;
}

export interface BoardPreset {
  id: string;
  name: string;
  description: string;
  background: BackgroundType;
  defaultStrokeColor: string;
  badge: string;
}
