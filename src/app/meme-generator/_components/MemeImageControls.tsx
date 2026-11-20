'use client';

import React, { useRef } from 'react';
import { MemeImageOverlay, TemplateSlot } from './memeTypes';
import { Plus, Trash2, Upload, Image as ImageIcon, ArrowLeftRight } from 'lucide-react';

interface MemeImageControlsProps {
  slots: TemplateSlot[];
  overlayImages: MemeImageOverlay[];
  onAddImageToSlot: (slot: TemplateSlot, file: File) => void;
  onAddCustomImage: (file: File) => void;
  onUpdateImage: (id: string, updates: Partial<MemeImageOverlay>) => void;
  onRemoveImage: (id: string) => void;
  onSwapSlots?: () => void;
}

export function MemeImageControls({
  slots,
  overlayImages,
  onAddImageToSlot,
  onAddCustomImage,
  onUpdateImage,
  onRemoveImage,
  onSwapSlots
}: MemeImageControlsProps) {
  const customFileInputRef = useRef<HTMLInputElement>(null);
  const slotInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleCustomFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddCustomImage(file);
      e.target.value = '';
    }
  };

  const handleSlotFile = (slot: TemplateSlot, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImageToSlot(slot, file);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Template Image Positions */}
      {slots.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200">Template Image Positions</label>
            <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded font-semibold">
              {slots.length} Slots
            </span>
          </div>

          {slots.map((slot) => {
            const assigned = overlayImages.find((img) => img.slotId === slot.id);
            return (
              <div key={slot.id} className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2.5">
                <div className="min-w-0 flex items-center gap-2">
                  {assigned ? (
                    <img src={assigned.url} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center shrink-0 text-slate-400">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{slot.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{slot.description}</p>
                  </div>
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { slotInputRefs.current[slot.id] = el; }}
                    onChange={(e) => handleSlotFile(slot, e)}
                    className="hidden"
                  />
                  {assigned ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => slotInputRefs.current[slot.id]?.click()}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveImage(assigned.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => slotInputRefs.current[slot.id]?.click()}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Add Image</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {slots.length >= 2 && overlayImages.length >= 2 && onSwapSlots && (
            <button
              type="button"
              onClick={onSwapSlots}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Swap Image Slots</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Custom Image Upload */}
      <div>
        <input type="file" accept="image/*" ref={customFileInputRef} onChange={handleCustomFile} className="hidden" />
        <button
          type="button"
          onClick={() => customFileInputRef.current?.click()}
          className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/40 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          <span>Upload Custom Overlay Image</span>
        </button>
      </div>

      {/* Image Adjustments */}
      {overlayImages.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-white/10">
          <label className="text-xs font-bold text-slate-300 block">Manage Added Images ({overlayImages.length})</label>
          {overlayImages.map((img) => (
            <div key={img.id} className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={img.url} alt="" className="w-6 h-6 rounded object-cover border border-white/20 shrink-0" />
                  <span className="text-xs font-bold text-white truncate max-w-[150px]">{img.name}</span>
                  {img.slotId && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Slot</span>}
                </div>
                <button type="button" onClick={() => onRemoveImage(img.id)} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-slate-400 text-[11px]">
                <div className="flex items-center justify-between">
                  <span>Position X / Y</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={img.xPercent}
                      onChange={(e) => onUpdateImage(img.id, { xPercent: Number(e.target.value) })}
                      className="w-16 accent-blue-500"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={img.yPercent}
                      onChange={(e) => onUpdateImage(img.id, { yPercent: Number(e.target.value) })}
                      className="w-16 accent-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Size (W × H)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={img.widthPercent}
                      onChange={(e) => onUpdateImage(img.id, { widthPercent: Number(e.target.value) })}
                      className="w-16 accent-blue-500"
                    />
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={img.heightPercent}
                      onChange={(e) => onUpdateImage(img.id, { heightPercent: Number(e.target.value) })}
                      className="w-16 accent-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span>Fitting</span>
                  <div className="inline-flex rounded-lg bg-black/40 p-0.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => onUpdateImage(img.id, { fit: 'cover' })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${img.fit === 'cover' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                    >
                      Cover (Fill)
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateImage(img.id, { fit: 'contain' })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${img.fit === 'contain' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                    >
                      Contain (Fit)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
