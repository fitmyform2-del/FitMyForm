'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolType, ToolSettings, WhiteboardPage, WhiteboardElement, LaserPoint } from '../types/whiteboard';
import { getCanvasCoords, hitTestElement, hitTestResizeHandle, createId } from '../utils/canvasInteraction';

type DragMode = 'none' | 'move' | 'resize-se';

interface UseCanvasPointerEventsProps {
  page: WhiteboardPage;
  activeTool: ToolType;
  settings: ToolSettings;
  zoom: number;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onCommitElements: (newElements: WhiteboardElement[]) => void;
  onUpdateLiveElements: (newElements: WhiteboardElement[] | null) => void;
  onAddElement: (element: WhiteboardElement) => void;
  onStartEditText: (coords: { x: number; y: number }) => void;
  onEditExistingElement?: (element: WhiteboardElement) => void;
}

export function useCanvasPointerEvents({
  page, activeTool, settings, zoom, pan, setPan,
  selectedIds, setSelectedIds, onCommitElements,
  onUpdateLiveElements, onAddElement, onStartEditText, onEditExistingElement
}: UseCanvasPointerEventsProps) {
  const [draftElement, setDraftElement] = useState<WhiteboardElement | null>(null);
  const [laserPoints, setLaserPoints] = useState<LaserPoint[]>([]);

  const isPointerDownRef = useRef(false);
  const isSpaceHeldRef = useRef(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragModeRef = useRef<DragMode>('none');
  const activeDragIdsRef = useRef<string[]>([]);
  const dragStartCoordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartElementsRef = useRef<WhiteboardElement[]>([]);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === 'Space') isSpaceHeldRef.current = e.type === 'keydown'; };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    canvas.setPointerCapture(e.pointerId);
    isPointerDownRef.current = true;
    const coords = getCanvasCoords(e, canvas, zoom, pan);

    if (activeTool === 'pan' || e.button === 1 || isSpaceHeldRef.current) {
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      return;
    }

    if (activeTool === 'select') {
      if (selectedIds.length === 1) {
        const selEl = page.elements.find((el) => el.id === selectedIds[0]);
        if (selEl && hitTestResizeHandle(selEl, coords.x, coords.y)) {
          dragModeRef.current = 'resize-se';
          activeDragIdsRef.current = [selEl.id];
          dragStartCoordsRef.current = coords;
          dragStartElementsRef.current = [...page.elements];
          hasMovedRef.current = false;
          return;
        }
      }

      const clicked = [...page.elements].reverse().find((el) => hitTestElement(el, coords.x, coords.y));
      if (clicked) {
        const newSelected = selectedIds.includes(clicked.id) ? selectedIds : [clicked.id];
        setSelectedIds(newSelected);
        dragModeRef.current = 'move';
        activeDragIdsRef.current = newSelected;
        dragStartCoordsRef.current = coords;
        dragStartElementsRef.current = [...page.elements];
        hasMovedRef.current = false;
      } else {
        setSelectedIds([]);
        dragModeRef.current = 'none';
        activeDragIdsRef.current = [];
      }
      return;
    }

    if (activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'brush') {
      setDraftElement({
        id: createId('stroke'), type: 'stroke',
        tool: activeTool === 'highlighter' ? 'highlighter' : activeTool === 'brush' ? 'brush' : 'pen',
        x: coords.x, y: coords.y, width: 0, height: 0, strokeColor: settings.strokeColor,
        strokeWidth: activeTool === 'highlighter' ? 24 : settings.strokeWidth,
        opacity: activeTool === 'highlighter' ? 0.35 : settings.opacity, points: [coords]
      });
      return;
    }

    if (activeTool === 'laser') {
      setLaserPoints((prev) => [...prev, { x: coords.x, y: coords.y, time: Date.now(), color: '#ef4444' }]);
      return;
    }

    if (activeTool === 'eraser') {
      const target = [...page.elements].reverse().find((el) => hitTestElement(el, coords.x, coords.y));
      if (target) onCommitElements(page.elements.filter((el) => el.id !== target.id));
      return;
    }

    if (activeTool === 'shape') {
      setDraftElement({
        id: createId('shape'), type: 'shape', shapeType: settings.shapeType,
        x: coords.x, y: coords.y, width: 0, height: 0, strokeColor: settings.strokeColor,
        strokeWidth: settings.strokeWidth, strokeStyle: settings.strokeStyle,
        fillColor: settings.fillColor, isFilled: settings.isFilled, opacity: settings.opacity
      });
      return;
    }

    if (activeTool === 'text') {
      const clicked = [...page.elements].reverse().find((el) => hitTestElement(el, coords.x, coords.y));
      if (clicked && (clicked.type === 'text' || clicked.type === 'stickynote') && onEditExistingElement) {
        onEditExistingElement(clicked);
      } else {
        onStartEditText(coords);
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    if (!isPointerDownRef.current) return;
    const coords = getCanvasCoords(e, canvas, zoom, pan);

    if (activeTool === 'pan' || e.buttons === 4 || isSpaceHeldRef.current) {
      setPan({ x: e.clientX - panStartRef.current.x, y: e.clientY - panStartRef.current.y });
      return;
    }

    if (activeTool === 'select' && activeDragIdsRef.current.length > 0) {
      const dx = coords.x - dragStartCoordsRef.current.x;
      const dy = coords.y - dragStartCoordsRef.current.y;
      hasMovedRef.current = true;

      if (dragModeRef.current === 'resize-se') {
        const targetId = activeDragIdsRef.current[0];
        const updated = dragStartElementsRef.current.map((el) =>
          el.id === targetId ? { ...el, width: Math.max(30, el.width + dx), height: Math.max(20, el.height + dy) } : el
        );
        onUpdateLiveElements(updated);
        return;
      }

      if (dragModeRef.current === 'move') {
        const updated = dragStartElementsRef.current.map((el) =>
          activeDragIdsRef.current.includes(el.id) ? { ...el, x: el.x + dx, y: el.y + dy } : el
        );
        onUpdateLiveElements(updated);
        return;
      }
    }

    if ((activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'brush') && draftElement?.type === 'stroke') {
      setDraftElement({ ...draftElement, points: [...draftElement.points, coords] });
      return;
    }

    if (activeTool === 'laser') {
      setLaserPoints((prev) => [...prev, { x: coords.x, y: coords.y, time: Date.now(), color: '#ef4444' }]);
      return;
    }

    if (activeTool === 'shape' && draftElement?.type === 'shape') {
      setDraftElement({ ...draftElement, width: coords.x - draftElement.x, height: coords.y - draftElement.y });
    }
  };

  const onPointerUp = () => {
    isPointerDownRef.current = false;
    if (hasMovedRef.current && activeDragIdsRef.current.length > 0) {
      onCommitElements(page.elements);
    }
    dragModeRef.current = 'none';
    activeDragIdsRef.current = [];
    hasMovedRef.current = false;

    if (draftElement) {
      if (draftElement.type === 'shape') {
        if (Math.abs(draftElement.width) > 5 || Math.abs(draftElement.height) > 5) onAddElement(draftElement);
      } else if (draftElement.type === 'stroke' && draftElement.points.length > 0) {
        onAddElement(draftElement);
      }
      setDraftElement(null);
    }
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const coords = getCanvasCoords(e, canvas, zoom, pan);
    const clicked = [...page.elements].reverse().find((el) => hitTestElement(el, coords.x, coords.y));
    if (clicked && onEditExistingElement) onEditExistingElement(clicked);
  };

  return {
    draftElement,
    laserPoints,
    setLaserPoints,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDoubleClick
  };
}
