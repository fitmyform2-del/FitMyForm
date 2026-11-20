'use client';

import { WhiteboardPage, WhiteboardElement, ToolType } from '../types/whiteboard';
import { exportPageToImage, exportPagesToPdf, exportBoardToJson, importBoardFromJson, downloadBlob } from '../utils/exportUtils';
import { createId } from '../utils/canvasInteraction';

interface UseWhiteboardFileIOProps {
  boardTitle: string;
  setBoardTitle: (t: string) => void;
  currentPage: WhiteboardPage;
  pages: WhiteboardPage[];
  currentPageIndex: number;
  setCurrentPageIndex: (idx: number) => void;
  setPages: (pages: WhiteboardPage[]) => void;
  onAddElement: (el: WhiteboardElement) => void;
  setSelectedIds: (ids: string[]) => void;
  setActiveTool: (tool: ToolType) => void;
}

export function useWhiteboardFileIO({
  boardTitle,
  setBoardTitle,
  currentPage,
  pages,
  currentPageIndex,
  setCurrentPageIndex,
  setPages,
  onAddElement,
  setSelectedIds,
  setActiveTool
}: UseWhiteboardFileIOProps) {
  const handleExportPng = async () => {
    const blob = await exportPageToImage(currentPage, 'png');
    const slug = boardTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadBlob(blob, `${slug}_page_${currentPageIndex + 1}.png`);
  };

  const handleExportPdf = async () => {
    const blob = await exportPagesToPdf(pages, boardTitle);
    const slug = boardTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadBlob(blob, `${slug}.pdf`);
  };

  const handleExportJson = () => {
    exportBoardToJson(pages, boardTitle);
  };

  const handlePickImage = () => {
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const w = Math.min(img.naturalWidth, 500);
          const h = (w * img.naturalHeight) / img.naturalWidth;
          const newImg: WhiteboardElement = {
            id: createId('img'),
            type: 'image',
            src,
            x: 100,
            y: 100,
            width: w,
            height: h,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          };
          onAddElement(newImg);
          setSelectedIds([newImg.id]);
          setActiveTool('select');
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handlePickJson = () => {
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.wbc,.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const data = await importBoardFromJson(file);
        setBoardTitle(data.title);
        setPages(data.pages);
        setCurrentPageIndex(0);
      } catch (err) {
        console.error('Failed to import board file:', err);
      }
    };
    input.click();
  };

  return {
    handleExportPng,
    handleExportPdf,
    handleExportJson,
    handlePickImage,
    handlePickJson
  };
}
