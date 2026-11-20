'use client';

import React, { useState } from 'react';
import { MemeSticker, POPULAR_STICKERS } from './memeTypes';
import { Trash2 } from 'lucide-react';

interface MemeStickerControlsProps {
  stickers: MemeSticker[];
  onAddSticker: (emoji: string) => void;
  onUpdateSticker: (id: string, updates: Partial<MemeSticker>) => void;
  onRemoveSticker: (id: string) => void;
  onClearStickers: () => void;
}

export function MemeStickerControls({
  stickers,
  onAddSticker,
  onUpdateSticker,
  onRemoveSticker,
  onClearStickers
}: MemeStickerControlsProps) {
  const [selectedStickerId, setSelectedStickerId] = useState<string>(stickers[0]?.id || '');
  const activeSticker = stickers.find((s) => s.id === selectedStickerId) || stickers[0];

  return (
    <div className="space-y-4">
      {/* Emoji Picker Grid */}
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-1.5">
          Click an Emoji to Add Sticker
        </label>
        <div className="grid grid-cols-8 gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
          {POPULAR_STICKERS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onAddSticker(emoji)}
              className="h-9 flex items-center justify-center text-xl rounded-lg hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Active stickers list & controls */}
      {stickers.length > 0 && (
        <div className="space-y-3 p-3 rounded-xl bg-black/30 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Active Stickers ({stickers.length})
            </span>
            <button
              type="button"
              onClick={onClearStickers}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              Remove All
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {stickers.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStickerId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSticker?.id === s.id
                    ? 'bg-blue-600/30 border border-blue-500 scale-105 shadow-sm'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{s.emoji}</span>
              </button>
            ))}
          </div>

          {activeSticker && (
            <div className="space-y-2.5 pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Size</span>
                <input
                  type="range"
                  min="6"
                  max="35"
                  value={activeSticker.sizePercent}
                  onChange={(e) => onUpdateSticker(activeSticker.id, { sizePercent: Number(e.target.value) })}
                  className="w-36 accent-blue-500"
                />
                <span className="text-slate-300 w-8 text-right">{activeSticker.sizePercent}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Position X</span>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={activeSticker.xPercent}
                  onChange={(e) => onUpdateSticker(activeSticker.id, { xPercent: Number(e.target.value) })}
                  className="w-36 accent-blue-500"
                />
                <span className="text-slate-300 w-8 text-right">{activeSticker.xPercent}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Position Y</span>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={activeSticker.yPercent}
                  onChange={(e) => onUpdateSticker(activeSticker.id, { yPercent: Number(e.target.value) })}
                  className="w-36 accent-blue-500"
                />
                <span className="text-slate-300 w-8 text-right">{activeSticker.yPercent}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rotation</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={activeSticker.rotation}
                  onChange={(e) => onUpdateSticker(activeSticker.id, { rotation: Number(e.target.value) })}
                  className="w-36 accent-blue-500"
                />
                <span className="text-slate-300 w-8 text-right">{activeSticker.rotation}°</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemoveSticker(activeSticker.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete This Sticker</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
