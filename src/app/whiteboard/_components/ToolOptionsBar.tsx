'use client';

import React from 'react';
import {
  ToolSettings,
  ToolType,
  StrokeStyle
} from '../types/whiteboard';
import {
  Bold,
  Italic,
  Sparkles
} from 'lucide-react';

interface ToolOptionsBarProps {
  activeTool: ToolType;
  settings: ToolSettings;
  updateSettings: (partial: Partial<ToolSettings>) => void;
  selectedTextBold?: boolean;
  selectedTextItalic?: boolean;
  onToggleBold?: () => void;
  onToggleItalic?: () => void;
}

const PRESET_COLORS = [
  '#000000',
  '#ffffff',
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899'  // Pink
];

const STROKE_WIDTHS = [2, 4, 8, 14, 24];
const FONT_SIZES = [14, 18, 24, 32, 44];

export function ToolOptionsBar({
  activeTool,
  settings,
  updateSettings,
  selectedTextBold,
  selectedTextItalic,
  onToggleBold,
  onToggleItalic
}: ToolOptionsBarProps) {
  // If pan or eraser is active, toolbar is minimal
  if (activeTool === 'pan') return null;

  return (
    <div className="h-10 bg-[#111726] border-b border-white/10 px-3 flex items-center justify-between gap-3 text-xs overflow-x-auto no-scrollbar shrink-0 select-none">
      <div className="flex items-center gap-3">
        {/* Colors Palette */}
        {activeTool !== 'eraser' && (
          <div className="flex items-center gap-1.5 shrink-0">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateSettings({ strokeColor: color })}
                style={{ backgroundColor: color }}
                className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                  settings.strokeColor === color
                    ? 'scale-125 border-blue-400 ring-2 ring-blue-500/50'
                    : 'border-white/20 hover:scale-110'
                }`}
                title={color}
              />
            ))}
            {/* Custom Color Input */}
            <label className="w-5 h-5 rounded-full overflow-hidden border border-white/30 cursor-pointer relative flex items-center justify-center">
              <input
                type="color"
                value={settings.strokeColor}
                onChange={(e) => updateSettings({ strokeColor: e.target.value })}
                className="opacity-0 absolute inset-0 cursor-pointer"
              />
              <Sparkles className="w-3 h-3 text-slate-300" />
            </label>
          </div>
        )}

        <div className="h-4 w-px bg-white/10 shrink-0" />

        {/* Stroke Width */}
        {(activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'shape') && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Size:</span>
            {STROKE_WIDTHS.map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ strokeWidth: size })}
                className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
                  settings.strokeWidth === size ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-slate-300'
                }`}
                title={`${size}px`}
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: Math.max(3, size / 2.5), height: Math.max(3, size / 2.5) }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Stroke Style (Solid / Dashed / Dotted) for Shapes */}
        {activeTool === 'shape' && (
          <>
            <div className="h-4 w-px bg-white/10 shrink-0" />
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Style:</span>
              {(['solid', 'dashed', 'dotted'] as StrokeStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => updateSettings({ strokeStyle: style })}
                  className={`px-2 py-0.5 rounded text-[11px] capitalize cursor-pointer ${
                    settings.strokeStyle === style ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-white/10 shrink-0" />

            {/* Shape Fill Toggle */}
            <div className="flex items-center gap-1.5 shrink-0">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px]">
                <input
                  type="checkbox"
                  checked={settings.isFilled}
                  onChange={(e) => updateSettings({ isFilled: e.target.checked })}
                  className="rounded bg-white/10 border-white/20 text-blue-600 focus:ring-0"
                />
                <span>Fill</span>
              </label>
              {settings.isFilled && (
                <label className="w-4 h-4 rounded overflow-hidden border border-white/30 cursor-pointer relative">
                  <input
                    type="color"
                    value={settings.fillColor}
                    onChange={(e) => updateSettings({ fillColor: e.target.value })}
                    className="opacity-0 absolute inset-0 cursor-pointer"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: settings.fillColor }} />
                </label>
              )}
            </div>
          </>
        )}

        {/* Text Formatting Controls */}
        {activeTool === 'text' && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">Font Size:</span>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
              className="bg-slate-800 text-white rounded px-2 py-0.5 border border-white/20 text-[11px] outline-none"
            >
              {FONT_SIZES.map((sz) => (
                <option key={sz} value={sz}>{sz}px</option>
              ))}
            </select>

            <button
              onClick={onToggleBold}
              className={`p-1 rounded hover:bg-white/10 ${selectedTextBold ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleItalic}
              className={`p-1 rounded hover:bg-white/10 ${selectedTextItalic ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Opacity slider */}
      {activeTool !== 'eraser' && (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400">Opacity:</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={settings.opacity}
            onChange={(e) => updateSettings({ opacity: parseFloat(e.target.value) })}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-[10px] font-mono text-slate-400 w-8">{Math.round(settings.opacity * 100)}%</span>
        </div>
      )}
    </div>
  );
}
