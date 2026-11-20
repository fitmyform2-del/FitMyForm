'use client';

import React from 'react';
import { WhiteboardPage, WhiteboardElement, WhiteboardBoard, ShapeType, ManipulativeType, ToolSettings, ToolType } from '../types/whiteboard';
import { PageThumbnailsDrawer } from './PageThumbnailsDrawer';
import { ShapesPickerModal } from './ShapesPickerModal';
import { StickyNoteModal } from './StickyNoteModal';
import { MathEditorModal } from './MathEditorModal';
import { ManipulativesDrawer } from './ManipulativesDrawer';
import { ClassroomWidgetsDrawer } from './ClassroomWidgetsDrawer';
import { PdfImportModal } from './PdfImportModal';
import { CameraWhiteboardModal } from './CameraWhiteboardModal';
import { ShortcutsModal } from './ShortcutsModal';
import { TextEditorModal } from './TextEditorModal';
import { MultiBoardModal } from './MultiBoardModal';
import { createId } from '../utils/canvasInteraction';

export interface ModalsState {
  thumbnails: boolean; shapes: boolean; sticky: boolean; math: boolean;
  manipulatives: boolean; widgets: boolean; pdf: boolean; camera: boolean;
  shortcuts: boolean; text: boolean; boards: boolean;
}

interface WhiteboardModalsOverlayProps {
  modals: ModalsState;
  setModal: (key: keyof ModalsState, val: boolean) => void;
  pages: WhiteboardPage[];
  currentPageIndex: number;
  onSelectPage: (i: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (i: number) => void;
  onDeletePage: (i: number) => void;
  onMovePage: (from: number, to: number) => void;
  settings: ToolSettings;
  setSettings: React.Dispatch<React.SetStateAction<ToolSettings>>;
  setActiveTool: (tool: ToolType) => void;
  activeWidgets: { timer: boolean; dice: boolean; spinner: boolean; calculator: boolean; piano: boolean; soundboard: boolean };
  onToggleWidget: (key: 'timer' | 'dice' | 'spinner' | 'calculator' | 'piano' | 'soundboard') => void;
  onAddElement: (el: WhiteboardElement) => void;
  onSetBackgroundImage: (dataUrl: string) => void;
  onSelectElement: (id: string) => void;
  editingElement: WhiteboardElement | null;
  onClearEditingElement: () => void;
  onUpdateSingleElement: (id: string, updates: Partial<WhiteboardElement>) => void;
  boardsList: WhiteboardBoard[];
  activeBoardId: string;
  onSelectBoard: (id: string) => void;
  onCreateBoard: (presetId: string, title?: string) => void;
  onDuplicateBoard: (id: string) => void;
  onDeleteBoard: (id: string) => void;
}

export function WhiteboardModalsOverlay({
  modals, setModal, pages, currentPageIndex, onSelectPage, onAddPage,
  onDuplicatePage, onDeletePage, onMovePage, settings, setSettings,
  setActiveTool, activeWidgets, onToggleWidget, onAddElement,
  onSetBackgroundImage, onSelectElement, editingElement,
  onClearEditingElement, onUpdateSingleElement,
  boardsList, activeBoardId, onSelectBoard, onCreateBoard,
  onDuplicateBoard, onDeleteBoard
}: WhiteboardModalsOverlayProps) {
  const insertAndSelect = (el: WhiteboardElement) => {
    onAddElement(el);
    onSelectElement(el.id);
    setActiveTool('select');
  };

  const handleSaveText = (text: string, opts: { fontSize: number; color: string; bold: boolean; italic: boolean; align: 'left' | 'center' | 'right' }) => {
    if (editingElement) {
      if (editingElement.type === 'text') {
        onUpdateSingleElement(editingElement.id, {
          text, fontSize: opts.fontSize, color: opts.color, bold: opts.bold, italic: opts.italic, align: opts.align,
          width: Math.max(140, text.length * (opts.fontSize * 0.65)), height: Math.max(40, opts.fontSize * 1.6)
        });
      } else if (editingElement.type === 'stickynote') {
        onUpdateSingleElement(editingElement.id, { text });
      }
    } else {
      insertAndSelect({
        id: createId('text'), type: 'text', x: 220, y: 220,
        width: Math.max(140, text.length * (opts.fontSize * 0.65)), height: Math.max(40, opts.fontSize * 1.6),
        text, fontSize: opts.fontSize, fontFamily: settings.fontFamily, color: opts.color,
        bold: opts.bold, italic: opts.italic, align: opts.align
      });
    }
  };

  return (
    <>
      <MultiBoardModal
        isOpen={modals.boards}
        onClose={() => setModal('boards', false)}
        boards={boardsList}
        activeBoardId={activeBoardId}
        onSelectBoard={onSelectBoard}
        onCreateBoard={onCreateBoard}
        onDuplicateBoard={onDuplicateBoard}
        onDeleteBoard={onDeleteBoard}
      />
      <PageThumbnailsDrawer
        isOpen={modals.thumbnails} onClose={() => setModal('thumbnails', false)}
        pages={pages} currentPageIndex={currentPageIndex} onSelectPage={onSelectPage}
        onAddPage={onAddPage} onDuplicatePage={onDuplicatePage} onDeletePage={onDeletePage} onMovePage={onMovePage}
      />
      <ShapesPickerModal
        isOpen={modals.shapes} onClose={() => setModal('shapes', false)} selectedShape={settings.shapeType}
        onSelectShape={(s: ShapeType) => { setSettings((st) => ({ ...st, shapeType: s })); setActiveTool('shape'); }}
      />
      <StickyNoteModal
        isOpen={modals.sticky} onClose={() => setModal('sticky', false)}
        onAddStickyNote={(text, color) => insertAndSelect({
          id: createId('sticky'), type: 'stickynote', x: 200, y: 200, width: 180, height: 160, text, color, fontSize: 16
        })}
      />
      <TextEditorModal
        isOpen={modals.text} onClose={() => { setModal('text', false); onClearEditingElement(); }}
        isEditing={!!editingElement}
        initialText={editingElement && 'text' in editingElement ? editingElement.text : ''}
        initialOptions={editingElement && editingElement.type === 'text' ? {
          fontSize: editingElement.fontSize, color: editingElement.color, bold: editingElement.bold, italic: editingElement.italic, align: editingElement.align
        } : { fontSize: settings.fontSize, color: settings.strokeColor }}
        onSaveText={handleSaveText}
      />
      <MathEditorModal
        isOpen={modals.math} onClose={() => setModal('math', false)}
        onInsertMath={(formula) => insertAndSelect({
          id: createId('math'), type: 'math', latex: formula, renderedText: formula,
          x: 220, y: 220, width: Math.max(160, formula.length * 16), height: 56, fontSize: 22, color: '#f8fafc'
        })}
      />
      <ManipulativesDrawer
        isOpen={modals.manipulatives} onClose={() => setModal('manipulatives', false)}
        onAddManipulative={(type: ManipulativeType, data, w, h) => insertAndSelect({
          id: createId('manipulative'), type: 'manipulative', manipulativeType: type, x: 240, y: 240, width: w, height: h, data
        })}
      />
      <ClassroomWidgetsDrawer
        isOpen={modals.widgets} onClose={() => setModal('widgets', false)}
        activeWidgets={activeWidgets} onToggleWidget={onToggleWidget}
      />
      <PdfImportModal
        isOpen={modals.pdf} onClose={() => setModal('pdf', false)}
        onInsertPage={(dataUrl, asBg) => {
          if (asBg) onSetBackgroundImage(dataUrl);
          else insertAndSelect({
            id: createId('doc'), type: 'image', src: dataUrl, x: 100, y: 100,
            width: 500, height: 650, naturalWidth: 800, naturalHeight: 1040
          });
        }}
      />
      <CameraWhiteboardModal
        isOpen={modals.camera} onClose={() => setModal('camera', false)}
        onCapture={(dataUrl) => insertAndSelect({
          id: createId('camera'), type: 'image', src: dataUrl, x: 150, y: 150,
          width: 480, height: 270, naturalWidth: 1280, naturalHeight: 720
        })}
      />
      <ShortcutsModal isOpen={modals.shortcuts} onClose={() => setModal('shortcuts', false)} />
    </>
  );
}
