'use client';

import React, { useState, useEffect } from 'react';
import { ToolType, ToolSettings, WhiteboardElement } from './types/whiteboard';
import { useWhiteboardHistory } from './hooks/useWhiteboardHistory';
import { useWhiteboardStorage, createDefaultPage } from './hooks/useWhiteboardStorage';
import { useAudioEffects } from './hooks/useAudioEffects';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useWhiteboardPages } from './hooks/useWhiteboardPages';
import { useWhiteboardFileIO } from './hooks/useWhiteboardFileIO';
import { createId } from './utils/canvasInteraction';

import { WhiteboardHeader } from './_components/WhiteboardHeader';
import { WhiteboardToolbar } from './_components/WhiteboardToolbar';
import { ToolOptionsBar } from './_components/ToolOptionsBar';
import { WhiteboardCanvas } from './_components/WhiteboardCanvas';
import { WidgetsOverlay } from './_components/WidgetsOverlay';
import { WhiteboardModalsOverlay, ModalsState } from './_components/WhiteboardModalsOverlay';

export default function WhiteboardClient() {
  const storage = useWhiteboardStorage();
  const history = useWhiteboardHistory([createDefaultPage(1, 'blank')]);
  const audioEffects = useAudioEffects();
  const pagesHook = useWhiteboardPages(history.pages, history.pushState);

  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingElement, setEditingElement] = useState<WhiteboardElement | null>(null);

  const [modals, setModals] = useState<ModalsState>({
    thumbnails: false, shapes: false, sticky: false, math: false,
    manipulatives: false, widgets: false, pdf: false, camera: false,
    shortcuts: false, text: false, boards: false
  });
  const setModal = (k: keyof ModalsState, v: boolean) => setModals((m) => ({ ...m, [k]: v }));

  const [activeWidgets, setActiveWidgets] = useState({
    timer: false, dice: false, spinner: false, calculator: false, piano: false, soundboard: false
  });

  const [settings, setSettings] = useState<ToolSettings>({
    strokeColor: '#000000', fillColor: '#3b82f6', isFilled: false, strokeWidth: 4,
    strokeStyle: 'solid', opacity: 1, fontSize: 22, fontFamily: 'sans-serif',
    shapeType: 'rectangle', stickyColor: 'yellow', activeWidget: null
  });

  const fileIO = useWhiteboardFileIO({
    boardTitle: storage.activeBoard.title,
    setBoardTitle: (t) => storage.renameBoard(storage.activeBoardId, t),
    currentPage: pagesHook.currentPage, pages: history.pages,
    currentPageIndex: pagesHook.currentPageIndex, setCurrentPageIndex: pagesHook.setCurrentPageIndex,
    setPages: history.setPages, onAddElement: pagesHook.addElementToCurrentPage,
    setSelectedIds, setActiveTool
  });

  // Load board pages on mount or when active board switches
  useEffect(() => {
    if (storage.isInitialized && storage.activeBoard) {
      history.setPages(storage.activeBoard.pages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage.isInitialized, storage.activeBoardId]);

  // Debounced auto-save of active board
  const { isInitialized, saveActiveBoardDebounced, activeBoard } = storage;
  const activeTitle = activeBoard?.title;
  const currentBg = pagesHook.currentPage?.background;

  useEffect(() => {
    if (isInitialized) {
      saveActiveBoardDebounced(activeTitle, history.pages, currentBg);
    }
  }, [isInitialized, saveActiveBoardDebounced, activeTitle, history.pages, currentBg]);

  useKeyboardShortcuts({
    setActiveTool, undo: history.undo, redo: history.redo,
    deleteSelected: () => pagesHook.updateCurrentPageElements(pagesHook.currentPage.elements.filter((e) => !selectedIds.includes(e.id))),
    duplicateSelected: () => {
      const sel = pagesHook.currentPage.elements.filter((e) => selectedIds.includes(e.id));
      const copies = sel.map((e) => ({ ...JSON.parse(JSON.stringify(e)), id: createId('copy'), x: e.x + 20, y: e.y + 20 }));
      pagesHook.updateCurrentPageElements([...pagesHook.currentPage.elements, ...copies]);
    },
    onZoomIn: () => setZoom((z) => Math.min(3, z + 0.15)),
    onZoomOut: () => setZoom((z) => Math.max(0.3, z - 0.15)),
    onZoomReset: () => { setZoom(1); setPan({ x: 0, y: 0 }); },
    onOpenShortcuts: () => setModal('shortcuts', true)
  });

  const handleSelectBoard = (id: string) => {
    storage.switchBoard(id);
    const target = storage.boards.find((b) => b.id === id);
    if (target) {
      history.setPages(target.pages);
      pagesHook.setCurrentPageIndex(0);
    }
  };

  const handleCreateBoard = (presetId: string, title?: string) => {
    const newBoard = storage.createBoard(presetId, title);
    history.setPages(newBoard.pages);
    pagesHook.setCurrentPageIndex(0);
  };

  const handleDuplicateBoard = (id: string) => {
    const dup = storage.duplicateBoard(id);
    if (dup) {
      history.setPages(dup.pages);
      pagesHook.setCurrentPageIndex(0);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 select-none">
      <WhiteboardHeader
        boardTitle={storage.activeBoard.title}
        setBoardTitle={(t) => storage.renameBoard(storage.activeBoardId, t)}
        currentPageIndex={pagesHook.currentPageIndex} totalPages={history.pages.length}
        onPrevPage={() => pagesHook.setCurrentPageIndex((p) => Math.max(0, p - 1))}
        onNextPage={() => pagesHook.setCurrentPageIndex((p) => Math.min(history.pages.length - 1, p + 1))}
        onAddPage={pagesHook.addPage} onToggleThumbnails={() => setModal('thumbnails', !modals.thumbnails)}
        zoom={zoom} onZoomIn={() => setZoom((z) => Math.min(3, z + 0.15))}
        onZoomOut={() => setZoom((z) => Math.max(0.3, z - 0.15))}
        onZoomReset={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
        canUndo={history.canUndo} canRedo={history.canRedo} onUndo={history.undo} onRedo={history.redo}
        currentBackground={pagesHook.currentPage?.background || 'blank'}
        onChangeBackground={pagesHook.changeBackground}
        onExportPng={fileIO.handleExportPng} onExportPdf={fileIO.handleExportPdf}
        onExportJson={fileIO.handleExportJson} onImportJson={fileIO.handlePickJson}
        onClearPage={() => window.confirm('Clear all drawings and items on this page?') && pagesHook.updateCurrentPageElements([])}
        onOpenShortcuts={() => setModal('shortcuts', true)}
        onOpenMultiBoard={() => setModal('boards', true)}
        totalBoardsCount={storage.boards.length}
      />

      <ToolOptionsBar activeTool={activeTool} settings={settings} updateSettings={(p) => setSettings((s) => ({ ...s, ...p }))} />

      <div className="flex-1 flex overflow-hidden relative">
        <WhiteboardToolbar
          activeTool={activeTool} setActiveTool={setActiveTool}
          onOpenShapesModal={() => setModal('shapes', true)} onOpenStickyModal={() => setModal('sticky', true)}
          onOpenMathModal={() => setModal('math', true)} onOpenManipulatives={() => setModal('manipulatives', true)}
          onOpenWidgets={() => setModal('widgets', true)} onUploadImageClick={fileIO.handlePickImage}
          onOpenPdfModal={() => setModal('pdf', true)} onOpenCameraModal={() => setModal('camera', true)}
          onOpenTextModal={() => { setEditingElement(null); setModal('text', true); }}
        />

        <main className="flex-1 h-full relative overflow-hidden bg-[#0d1322]">
          <WhiteboardCanvas
            page={pagesHook.currentPage} activeTool={activeTool} settings={settings}
            zoom={zoom} pan={pan} setPan={setPan} selectedIds={selectedIds} setSelectedIds={setSelectedIds}
            onCommitElements={pagesHook.updateCurrentPageElements} onUpdateLiveElements={pagesHook.updateLiveElements}
            onAddElement={pagesHook.addElementToCurrentPage}
            onEditElement={(el) => { setEditingElement(el); setModal('text', true); }}
            onBringToFront={pagesHook.bringToFront} onSendToBack={pagesHook.sendToBack}
            onDuplicateElement={pagesHook.duplicateElement} onDeleteElement={pagesHook.deleteElement}
          />

          <WidgetsOverlay
            activeWidgets={activeWidgets} onCloseWidget={(k) => setActiveWidgets((w) => ({ ...w, [k]: false }))}
            audioEffects={audioEffects}
          />
        </main>
      </div>

      <WhiteboardModalsOverlay
        modals={modals} setModal={setModal} pages={history.pages}
        currentPageIndex={pagesHook.currentPageIndex}
        onSelectPage={(i) => { pagesHook.setCurrentPageIndex(i); setModal('thumbnails', false); }}
        onAddPage={pagesHook.addPage} onDuplicatePage={pagesHook.duplicatePage}
        onDeletePage={pagesHook.deletePage} onMovePage={pagesHook.movePage}
        settings={settings} setSettings={setSettings} setActiveTool={setActiveTool}
        activeWidgets={activeWidgets} onToggleWidget={(k) => setActiveWidgets((w) => ({ ...w, [k]: !w[k] }))}
        onAddElement={pagesHook.addElementToCurrentPage} onSetBackgroundImage={pagesHook.setBackgroundImage}
        onSelectElement={(id) => setSelectedIds([id])} editingElement={editingElement}
        onClearEditingElement={() => setEditingElement(null)}
        onUpdateSingleElement={pagesHook.updateSingleElement}
        boardsList={storage.boards} activeBoardId={storage.activeBoardId}
        onSelectBoard={handleSelectBoard} onCreateBoard={handleCreateBoard}
        onDuplicateBoard={handleDuplicateBoard} onDeleteBoard={storage.deleteBoard}
      />
    </div>
  );
}
