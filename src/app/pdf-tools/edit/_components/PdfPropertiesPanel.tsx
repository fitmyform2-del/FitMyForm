'use client';

import React from 'react';
import { Bold, Italic, Copy, Trash2, Layers } from 'lucide-react';
import { AnnotationItem, PdfFontFamily } from '@/lib/pdf/pdfTools';
import { EditorToolMode } from './PdfEditorToolbar';

export interface ToolStyleState {
  color: string;
  fillColor: string;
  bgColor: string;
  fontSize: number;
  fontFamily: PdfFontFamily;
  bold: boolean;
  italic: boolean;
  strokeWidth: number;
  opacity: number;
  stampText: string;
}

interface PdfPropertiesPanelProps {
  activeTool: EditorToolMode;
  styleState: ToolStyleState;
  onStyleChange: (patch: Partial<ToolStyleState>) => void;
  selectedAnnotation: AnnotationItem | null;
  pageAnnotations: AnnotationItem[];
  onSelectId: (id: string | null) => void;
  onUpdateSelected: (patch: Partial<AnnotationItem>) => void;
  onDuplicateSelected: () => void;
  onDeleteById: (id: string) => void;
}

const COLOR_SWATCHES = ['#0f172a', '#1d4ed8', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#fde047', '#ffffff'];
const STAMP_PRESETS = ['APPROVED', 'VERIFIED', 'CONFIDENTIAL', 'PAID', 'DRAFT', 'COPY', 'URGENT'];
const FONT_FAMILIES: Array<{ id: PdfFontFamily; label: string }> = [
  { id: 'Helvetica', label: 'Sans' },
  { id: 'TimesRoman', label: 'Serif' },
  { id: 'Courier', label: 'Mono' }
];

export const PdfPropertiesPanel: React.FC<PdfPropertiesPanelProps> = ({
  activeTool,
  styleState,
  onStyleChange,
  selectedAnnotation,
  pageAnnotations,
  onSelectId,
  onUpdateSelected,
  onDuplicateSelected,
  onDeleteById
}) => {
  const effectiveType = selectedAnnotation ? selectedAnnotation.type : activeTool;
  const activeColor = selectedAnnotation?.color ?? styleState.color;
  const activeOpacity = selectedAnnotation?.opacity ?? styleState.opacity;
  const activeStroke = selectedAnnotation?.strokeWidth ?? styleState.strokeWidth;

  const setColor = (hex: string) => {
    onStyleChange({ color: hex });
    if (selectedAnnotation) onUpdateSelected({ color: hex });
  };

  const setOpacity = (val: number) => {
    onStyleChange({ opacity: val });
    if (selectedAnnotation) onUpdateSelected({ opacity: val });
  };

  const setStroke = (val: number) => {
    onStyleChange({ strokeWidth: val });
    if (selectedAnnotation) onUpdateSelected({ strokeWidth: val });
  };

  return (
    <aside className="bg-[#0e1424] border border-white/10 rounded-2xl p-4 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {selectedAnnotation ? 'Selected Element' : 'Active Tool Style'}
          </span>
          <h3 className="text-sm font-black text-white capitalize">{effectiveType}</h3>
        </div>
        {selectedAnnotation?.id && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onDuplicateSelected}
              title="Duplicate (Ctrl+D)"
              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] text-slate-200 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteById(selectedAnnotation.id!)}
              title="Delete (Del)"
              className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Text Controls */}
      {(effectiveType === 'text' || effectiveType === 'date') && (
        <div className="space-y-3">
          {selectedAnnotation?.type === 'text' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Text Content</label>
              <textarea
                rows={3}
                value={selectedAnnotation.text || ''}
                onChange={(e) => onUpdateSelected({ text: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-1">
            {FONT_FAMILIES.map((f) => {
              const active = (selectedAnnotation?.fontFamily ?? styleState.fontFamily) === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onStyleChange({ fontFamily: f.id });
                    if (selectedAnnotation) onUpdateSelected({ fontFamily: f.id });
                  }}
                  className={`py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer ${
                    active
                      ? 'bg-blue-600/25 border-blue-400 text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next = !(selectedAnnotation?.bold ?? styleState.bold);
                onStyleChange({ bold: next });
                if (selectedAnnotation) onUpdateSelected({ bold: next });
              }}
              className={`p-2 rounded-lg border cursor-pointer ${
                (selectedAnnotation?.bold ?? styleState.bold)
                  ? 'bg-blue-600/25 border-blue-400 text-white'
                  : 'bg-white/[0.04] border-white/10 text-slate-400'
              }`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !(selectedAnnotation?.italic ?? styleState.italic);
                onStyleChange({ italic: next });
                if (selectedAnnotation) onUpdateSelected({ italic: next });
              }}
              className={`p-2 rounded-lg border cursor-pointer ${
                (selectedAnnotation?.italic ?? styleState.italic)
                  ? 'bg-blue-600/25 border-blue-400 text-white'
                  : 'bg-white/[0.04] border-white/10 text-slate-400'
              }`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min="8"
                max="56"
                value={selectedAnnotation?.fontSize ?? styleState.fontSize}
                onChange={(e) => {
                  const s = Number(e.target.value);
                  onStyleChange({ fontSize: s });
                  if (selectedAnnotation) onUpdateSelected({ fontSize: s });
                }}
                className="flex-1 accent-blue-500"
              />
              <span className="font-mono text-blue-300 font-bold w-9 text-right">
                {selectedAnnotation?.fontSize ?? styleState.fontSize}px
              </span>
            </div>
          </div>

          {/* Text Background Fill (for overwriting PDF text) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Text Backdrop</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'None', val: 'transparent' },
                { label: 'White', val: '#ffffff' },
                { label: 'Cream', val: '#fef9c3' }
              ].map((bg) => {
                const active = (selectedAnnotation?.bgColor ?? styleState.bgColor) === bg.val;
                return (
                  <button
                    key={bg.val}
                    type="button"
                    onClick={() => {
                      onStyleChange({ bgColor: bg.val });
                      if (selectedAnnotation) onUpdateSelected({ bgColor: bg.val });
                    }}
                    className={`py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      active
                        ? 'bg-blue-600/25 border-blue-400 text-white'
                        : 'bg-white/[0.03] border-white/10 text-slate-400'
                    }`}
                  >
                    {bg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stamp Preset Picker */}
      {effectiveType === 'stamp' && (
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-slate-400 block">Stamp Label</label>
          <input
            type="text"
            value={selectedAnnotation?.text ?? styleState.stampText}
            onChange={(e) => {
              onStyleChange({ stampText: e.target.value });
              if (selectedAnnotation) onUpdateSelected({ text: e.target.value });
            }}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-bold uppercase text-xs focus:outline-none focus:border-blue-500"
          />
          <div className="flex flex-wrap gap-1">
            {STAMP_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  onStyleChange({ stampText: preset });
                  if (selectedAnnotation) onUpdateSelected({ text: preset });
                }}
                className="px-2 py-1 rounded-md bg-white/[0.05] hover:bg-blue-600/25 border border-white/10 text-[10px] font-bold text-slate-200 cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shape Fill Toggle */}
      {(effectiveType === 'rect' || effectiveType === 'circle') && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Shape Fill</span>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'No Fill', val: 'transparent' },
              { label: 'Tint', val: activeColor },
              { label: 'White', val: '#ffffff' }
            ].map((opt) => {
              const cur = selectedAnnotation?.fillColor ?? styleState.fillColor;
              const active = cur === opt.val;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    onStyleChange({ fillColor: opt.val });
                    if (selectedAnnotation) onUpdateSelected({ fillColor: opt.val });
                  }}
                  className={`flex-1 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                    active
                      ? 'bg-blue-600/25 border-blue-400 text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Swatches */}
      {effectiveType !== 'image' && effectiveType !== 'whiteout' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Color</span>
            <input
              type="color"
              value={activeColor}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-5 rounded cursor-pointer bg-transparent border-0"
              title="Custom color"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setColor(hex)}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
                  activeColor === hex ? 'border-blue-400 scale-110' : 'border-white/15'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stroke Width */}
      {(effectiveType === 'draw' ||
        effectiveType === 'rect' ||
        effectiveType === 'circle' ||
        effectiveType === 'line' ||
        effectiveType === 'arrow') && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
            <span>Stroke Thickness</span>
            <span className="font-mono text-blue-300">{activeStroke}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={activeStroke}
            onChange={(e) => setStroke(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      )}

      {/* Opacity */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
          <span>Opacity</span>
          <span className="font-mono text-blue-300">{Math.round(activeOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.15"
          max="1"
          step="0.05"
          value={activeOpacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Page Elements / Layers List */}
      <div className="pt-3 border-t border-white/[0.08] space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Page Elements ({pageAnnotations.length})
          </span>
        </div>

        {pageAnnotations.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic">
            Pick any tool above and click or drag on the PDF page.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {pageAnnotations.map((ann, idx) => {
              const isSel = ann.id === selectedAnnotation?.id;
              return (
                <div
                  key={ann.id || idx}
                  onClick={() => ann.id && onSelectId(ann.id)}
                  className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl border cursor-pointer transition-colors ${
                    isSel
                      ? 'bg-blue-600/20 border-blue-500/50 text-white'
                      : 'bg-black/30 border-white/[0.06] text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                      style={{ backgroundColor: ann.color || ann.fillColor || '#3b82f6' }}
                    />
                    <span className="text-[11px] font-semibold truncate capitalize">
                      {ann.type === 'text' || ann.type === 'stamp'
                        ? ann.text || ann.type
                        : `${ann.type} #${idx + 1}`}
                    </span>
                  </div>
                  {ann.id && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteById(ann.id!);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
