'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WhiteboardPage, WhiteboardBoard, BackgroundType } from '../types/whiteboard';
import { createNewBoard } from '../utils/boardPresets';
import { createId } from '../utils/canvasInteraction';

const BOARDS_STORAGE_KEY = 'fitmyform_whiteboard_boards_v2';
const ACTIVE_BOARD_KEY = 'fitmyform_whiteboard_active_id';
const LEGACY_STORAGE_KEY = 'fitmyform_whiteboard_offline_state';

export function createDefaultPage(index = 1, background: BackgroundType = 'blank'): WhiteboardPage {
  return {
    id: createId('page'),
    name: `Page ${index}`,
    background,
    elements: []
  };
}

function loadBoardsFromStorage(): { loadedBoards: WhiteboardBoard[]; activeId: string } {
  try {
    const rawBoards = localStorage.getItem(BOARDS_STORAGE_KEY);
    let loadedBoards: WhiteboardBoard[] = [];
    if (rawBoards) {
      const parsed = JSON.parse(rawBoards);
      if (Array.isArray(parsed) && parsed.length > 0) loadedBoards = parsed;
    }
    if (loadedBoards.length === 0) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw);
        if (legacy && Array.isArray(legacy.pages) && legacy.pages.length > 0) {
          loadedBoards = [{
            id: createId('board'),
            title: legacy.title || 'My Whiteboard',
            boardType: legacy.pages[0]?.background || 'blank',
            pages: legacy.pages,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }];
        }
      }
    }
    if (loadedBoards.length === 0) {
      loadedBoards = [createNewBoard('plain-white', 'Plain Whiteboard')];
    }
    const savedActiveId = localStorage.getItem(ACTIVE_BOARD_KEY);
    const initialActive = loadedBoards.find((b) => b.id === savedActiveId) || loadedBoards[0];
    return { loadedBoards, activeId: initialActive.id };
  } catch {
    const fallback = createNewBoard('plain-white', 'Plain Whiteboard');
    return { loadedBoards: [fallback], activeId: fallback.id };
  }
}

export function useWhiteboardStorage() {
  const [boards, setBoards] = useState<WhiteboardBoard[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      const { loadedBoards, activeId } = loadBoardsFromStorage();
      setBoards(loadedBoards);
      setActiveBoardId(activeId);
      setIsInitialized(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0] || createNewBoard('plain-white');

  const persistBoards = useCallback((updatedBoards: WhiteboardBoard[], currentActiveId?: string) => {
    if (typeof window === 'undefined') return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(updatedBoards));
        if (currentActiveId) localStorage.setItem(ACTIVE_BOARD_KEY, currentActiveId);
      } catch (err) {
        console.warn('Failed to persist boards to localStorage:', err);
      }
    }, 600);
  }, []);

  const createBoard = useCallback((presetId = 'plain-white', customTitle?: string): WhiteboardBoard => {
    const newBoard = createNewBoard(presetId, customTitle);
    setBoards((prev) => {
      const updated = [newBoard, ...prev];
      persistBoards(updated, newBoard.id);
      return updated;
    });
    setActiveBoardId(newBoard.id);
    return newBoard;
  }, [persistBoards]);

  const switchBoard = useCallback((boardId: string) => {
    setActiveBoardId(boardId);
    if (typeof window !== 'undefined') localStorage.setItem(ACTIVE_BOARD_KEY, boardId);
  }, []);

  const duplicateBoard = useCallback((boardId: string): WhiteboardBoard | null => {
    const target = boards.find((b) => b.id === boardId);
    if (!target) return null;
    const dup: WhiteboardBoard = {
      ...JSON.parse(JSON.stringify(target)),
      id: createId('board'),
      title: `${target.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setBoards((prev) => {
      const updated = [dup, ...prev];
      persistBoards(updated, dup.id);
      return updated;
    });
    setActiveBoardId(dup.id);
    return dup;
  }, [boards, persistBoards]);

  const deleteBoard = useCallback((boardId: string) => {
    setBoards((prev) => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter((b) => b.id !== boardId);
      const nextActiveId = activeBoardId === boardId ? filtered[0].id : activeBoardId;
      if (activeBoardId === boardId) setActiveBoardId(nextActiveId);
      persistBoards(filtered, nextActiveId);
      return filtered;
    });
  }, [activeBoardId, persistBoards]);

  const renameBoard = useCallback((boardId: string, newTitle: string) => {
    setBoards((prev) => {
      const updated = prev.map((b) => (b.id === boardId ? { ...b, title: newTitle, updatedAt: Date.now() } : b));
      persistBoards(updated, activeBoardId);
      return updated;
    });
  }, [activeBoardId, persistBoards]);

  const saveActiveBoardDebounced = useCallback((title: string, pages: WhiteboardPage[], boardType?: BackgroundType) => {
    if (!isInitialized || !activeBoardId) return;
    setBoards((prev) => {
      const updated = prev.map((b) => (b.id === activeBoardId ? { ...b, title, pages, boardType: boardType || b.boardType, updatedAt: Date.now() } : b));
      persistBoards(updated, activeBoardId);
      return updated;
    });
  }, [isInitialized, activeBoardId, persistBoards]);

  return {
    boards,
    activeBoardId,
    activeBoard,
    isInitialized,
    createBoard,
    switchBoard,
    duplicateBoard,
    deleteBoard,
    renameBoard,
    saveActiveBoardDebounced
  };
}
