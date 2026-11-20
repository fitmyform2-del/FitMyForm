'use client';

import { useState, useCallback } from 'react';
import { WhiteboardPage } from '../types/whiteboard';

export function useWhiteboardHistory(initialPages: WhiteboardPage[]) {
  const [history, setHistory] = useState<WhiteboardPage[][]>([initialPages]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pages = history[currentIndex] || initialPages;

  const pushState = useCallback((newPages: WhiteboardPage[]) => {
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, currentIndex + 1);
      const updated = [...upToCurrent, newPages];
      if (updated.length > 50) updated.shift();
      return updated;
    });
    setCurrentIndex((prev) => Math.min(prev + 1, 49));
  }, [currentIndex]);

  const setPages = useCallback((newPages: WhiteboardPage[]) => {
    setHistory([newPages]);
    setCurrentIndex(0);
  }, []);

  const undo = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex((prev) => Math.min(history.length - 1, prev + 1));
  }, [history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    pages,
    setPages,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  };
}
