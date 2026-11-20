'use client';

import { useEffect } from 'react';
import { ToolType } from '../types/whiteboard';

interface UseKeyboardShortcutsProps {
  setActiveTool: (tool: ToolType) => void;
  undo: () => void;
  redo: () => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onOpenShortcuts: () => void;
}

export function useKeyboardShortcuts({
  setActiveTool,
  undo,
  redo,
  deleteSelected,
  duplicateSelected,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onOpenShortcuts
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMeta = e.metaKey || e.ctrlKey;

      if (isMeta && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }

      if (isMeta && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      if (isMeta && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        onOpenShortcuts();
        return;
      }

      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        onZoomIn();
        return;
      }

      if (e.key === '-') {
        e.preventDefault();
        onZoomOut();
        return;
      }

      if (e.key === '0') {
        e.preventDefault();
        onZoomReset();
        return;
      }

      // Single-key tool switches
      switch (e.key.toLowerCase()) {
        case 'd':
        case 'p':
          setActiveTool('pen');
          break;
        case 'h':
          setActiveTool('highlighter');
          break;
        case 'l':
          setActiveTool('laser');
          break;
        case 'e':
          setActiveTool('eraser');
          break;
        case 's':
        case 'v':
          setActiveTool('select');
          break;
        case 't':
          setActiveTool('text');
          break;
        case 'n':
          setActiveTool('stickynote');
          break;
        case 'm':
          setActiveTool('math');
          break;
        case ' ':
          setActiveTool('pan');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setActiveTool,
    undo,
    redo,
    deleteSelected,
    duplicateSelected,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onOpenShortcuts
  ]);
}
