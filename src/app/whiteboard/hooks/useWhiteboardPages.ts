'use client';

import { useState, useCallback } from 'react';
import { WhiteboardPage, WhiteboardElement, BackgroundType } from '../types/whiteboard';
import { createDefaultPage } from './useWhiteboardStorage';
import { createId } from '../utils/canvasInteraction';

export function useWhiteboardPages(
  pages: WhiteboardPage[],
  pushState: (newPages: WhiteboardPage[]) => void
) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [liveElements, setLiveElements] = useState<WhiteboardElement[] | null>(null);

  const basePage = pages[currentPageIndex] || pages[0];
  const currentPage: WhiteboardPage = liveElements !== null
    ? { ...basePage, elements: liveElements }
    : basePage;

  // Update elements and save snapshot to undo/redo history
  const updateCurrentPageElements = useCallback((newElements: WhiteboardElement[]) => {
    setLiveElements(null);
    const nextPages = pages.map((p, idx) => (idx === currentPageIndex ? { ...p, elements: newElements } : p));
    pushState(nextPages);
  }, [pages, currentPageIndex, pushState]);

  // Live update during drag without creating undo history step
  const updateLiveElements = useCallback((newElements: WhiteboardElement[] | null) => {
    setLiveElements(newElements);
  }, []);

  const addElementToCurrentPage = useCallback((element: WhiteboardElement) => {
    const currentElements = basePage?.elements || [];
    updateCurrentPageElements([...currentElements, element]);
  }, [basePage, updateCurrentPageElements]);

  const addPage = () => {
    setLiveElements(null);
    const newPage = createDefaultPage(pages.length + 1);
    const nextPages = [...pages, newPage];
    pushState(nextPages);
    setCurrentPageIndex(nextPages.length - 1);
  };

  const duplicatePage = (idx: number) => {
    setLiveElements(null);
    const target = pages[idx];
    const duplicated: WhiteboardPage = {
      ...target,
      id: createId('page'),
      name: `${target.name} (Copy)`,
      elements: JSON.parse(JSON.stringify(target.elements))
    };
    const nextPages = [...pages.slice(0, idx + 1), duplicated, ...pages.slice(idx + 1)];
    pushState(nextPages);
    setCurrentPageIndex(idx + 1);
  };

  const deletePage = (idx: number) => {
    if (pages.length <= 1) return;
    setLiveElements(null);
    const nextPages = pages.filter((_, i) => i !== idx);
    pushState(nextPages);
    setCurrentPageIndex(Math.min(currentPageIndex, nextPages.length - 1));
  };

  const movePage = (from: number, to: number) => {
    if (to < 0 || to >= pages.length) return;
    setLiveElements(null);
    const nextPages = [...pages];
    const [moved] = nextPages.splice(from, 1);
    nextPages.splice(to, 0, moved);
    pushState(nextPages);
    setCurrentPageIndex(to);
  };

  const changeBackground = (bg: BackgroundType) => {
    const nextPages = pages.map((p, idx) => (idx === currentPageIndex ? { ...p, background: bg } : p));
    pushState(nextPages);
  };

  const setBackgroundImage = (dataUrl: string) => {
    const nextPages = pages.map((p, idx) => (idx === currentPageIndex ? { ...p, backgroundImage: dataUrl } : p));
    pushState(nextPages);
  };

  // Element Layering
  const bringToFront = (id: string) => {
    const el = currentPage.elements.find((e) => e.id === id);
    if (!el) return;
    const rest = currentPage.elements.filter((e) => e.id !== id);
    updateCurrentPageElements([...rest, el]);
  };

  const sendToBack = (id: string) => {
    const el = currentPage.elements.find((e) => e.id === id);
    if (!el) return;
    const rest = currentPage.elements.filter((e) => e.id !== id);
    updateCurrentPageElements([el, ...rest]);
  };

  const deleteElement = (id: string) => {
    updateCurrentPageElements(currentPage.elements.filter((e) => e.id !== id));
  };

  const duplicateElement = (id: string) => {
    const el = currentPage.elements.find((e) => e.id === id);
    if (!el) return null;
    const copy: WhiteboardElement = {
      ...JSON.parse(JSON.stringify(el)),
      id: createId(el.type),
      x: el.x + 24,
      y: el.y + 24
    };
    updateCurrentPageElements([...currentPage.elements, copy]);
    return copy;
  };

  const updateSingleElement = (id: string, updates: Partial<WhiteboardElement>) => {
    const next = currentPage.elements.map((el) => (el.id === id ? ({ ...el, ...updates } as WhiteboardElement) : el));
    updateCurrentPageElements(next);
  };

  return {
    currentPageIndex,
    setCurrentPageIndex,
    currentPage,
    updateCurrentPageElements,
    updateLiveElements,
    addElementToCurrentPage,
    addPage,
    duplicatePage,
    deletePage,
    movePage,
    changeBackground,
    setBackgroundImage,
    bringToFront,
    sendToBack,
    deleteElement,
    duplicateElement,
    updateSingleElement
  };
}
