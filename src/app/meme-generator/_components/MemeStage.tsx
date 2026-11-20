'use client';

import React, { useRef, useState } from 'react';
import { UploadedFile } from '@/types/document';
import { TemplateSlot, MemeImageOverlay, MemeText } from './memeTypes';
import { RotateCcw, Image as ImageIcon, Sparkles, Upload, Trash2, ArrowLeftRight, Move } from 'lucide-react';

interface MemeStageProps {
  uploadedFile: UploadedFile;
  memeResultUrl: string | null;
  slots: TemplateSlot[];
  overlayImages: MemeImageOverlay[];
  texts: MemeText[];
  isRendering: boolean;
  onAddImageToSlot: (slot: TemplateSlot, file: File) => void;
  onRemoveImage: (id: string) => void;
  onSwapSlots: () => void;
  onUpdateTextPosition: (id: string, xPercent: number, yPercent: number) => void;
  onChangeImage: () => void;
  onResetAll: () => void;
}

export function MemeStage({
  uploadedFile,
  memeResultUrl,
  slots,
  overlayImages,
  texts,
  isRendering,
  onAddImageToSlot,
  onRemoveImage,
  onSwapSlots,
  onUpdateTextPosition,
  onChangeImage,
  onResetAll
}: MemeStageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedSlotRef = useRef<TemplateSlot | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragHoverSlot, setDragHoverSlot] = useState<string | null>(null);
  const [draggingTextId, setDraggingTextId] = useState<string | null>(null);

  const handleSlotClick = (slot: TemplateSlot) => {
    selectedSlotRef.current = slot;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedSlotRef.current) {
      onAddImageToSlot(selectedSlotRef.current, file);
      e.target.value = '';
    }
  };

  const handleSlotDrop = (slot: TemplateSlot, e: React.DragEvent) => {
    e.preventDefault();
    setDragHoverSlot(null);
    const file = e.dataTransfer.files?.[0];
    if (file) onAddImageToSlot(slot, file);
  };

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingTextId(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingTextId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(5, Math.min(95, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    onUpdateTextPosition(draggingTextId, x, y);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingTextId) {
      setDraggingTextId(null);
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    }
  };

  return (
    <div className="fmf-panel p-5 space-y-4">
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" />

      {/* Stage Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Live Meme Stage
          </span>
          {isRendering && (
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full animate-pulse font-semibold">
              Updating...
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {slots.length >= 2 && overlayImages.length >= 2 && (
            <button
              type="button"
              onClick={onSwapSlots}
              className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Swap Images</span>
            </button>
          )}
          <button
            type="button"
            onClick={onResetAll}
            className="text-xs text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onChangeImage}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ImageIcon className="w-3 h-3" />
            <span>Change Base</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas Display with Interactive Drag Triggers */}
      <div
        className="p-4 sm:p-6 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center min-h-[380px] sm:min-h-[440px] overflow-hidden relative select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div ref={containerRef} className="relative inline-block max-h-[460px] max-w-full">
          <img
            src={memeResultUrl || uploadedFile.previewUrl}
            alt="Rendered Meme"
            className="max-h-[460px] w-auto max-w-full object-contain rounded-xl shadow-2xl block"
          />

          {/* Interactive slot dropzones */}
          {slots.map((slot) => {
            const assigned = overlayImages.find((img) => img.slotId === slot.id);
            const isHover = dragHoverSlot === slot.id;
            return (
              <div
                key={slot.id}
                style={{ left: `${slot.xPercent}%`, top: `${slot.yPercent}%`, width: `${slot.widthPercent}%`, height: `${slot.heightPercent}%` }}
                onDragOver={(e) => { e.preventDefault(); setDragHoverSlot(slot.id); }}
                onDragLeave={() => setDragHoverSlot(null)}
                onDrop={(e) => handleSlotDrop(slot, e)}
                className={`absolute p-1.5 flex items-center justify-center group transition-all ${
                  isHover ? 'ring-4 ring-blue-500 bg-blue-600/30 rounded-xl' : ''
                }`}
              >
                {!assigned ? (
                  <button
                    type="button"
                    onClick={() => handleSlotClick(slot)}
                    className="w-full h-full rounded-xl border-2 border-dashed border-blue-400/70 hover:border-blue-300 bg-blue-600/20 hover:bg-blue-600/40 backdrop-blur-[2px] text-white flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-all shadow-md"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black text-white text-center leading-tight drop-shadow-sm">+ Add Photo</span>
                    <span className="text-[9px] text-blue-200 text-center font-medium truncate max-w-full">Drop or Click</span>
                  </button>
                ) : (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-lg border border-white/20 shadow-xl">
                    <button type="button" onClick={() => handleSlotClick(slot)} className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold cursor-pointer">
                      Replace
                    </button>
                    <button type="button" onClick={() => onRemoveImage(assigned.id)} className="p-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Interactive Drag Handles for Text Captions */}
          {texts.map((t) => (
            <div
              key={t.id}
              style={{ left: `${t.xPercent}%`, top: `${t.yPercent}%` }}
              onPointerDown={(e) => handlePointerDown(t.id, e)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing border border-transparent hover:border-blue-400 hover:bg-blue-600/20 rounded-lg px-2 py-1 flex items-center gap-1 group z-10 transition-colors"
            >
              <Move className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100" />
              <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-black/80 text-white px-1 rounded shadow">
                Drag Caption
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Slot Buttons Bar */}
      {slots.length > 0 && (
        <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 items-center">
            {slots.map((slot) => {
              const assigned = overlayImages.find((img) => img.slotId === slot.id);
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleSlotClick(slot)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    assigned ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-blue-600/20 hover:bg-blue-600/35 border-blue-500/40 text-blue-200'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{assigned ? `✓ ${slot.name}` : `+ Add ${slot.name}`}</span>
                </button>
              );
            })}
          </div>
          {slots.length >= 2 && overlayImages.length >= 2 && (
            <button
              type="button"
              onClick={onSwapSlots}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Swap Image Slots</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
