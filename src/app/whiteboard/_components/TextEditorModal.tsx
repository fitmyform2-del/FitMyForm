'use client';

import React, { useState } from 'react';
import { X, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

interface TextOptions {
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
}

interface TextEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveText: (text: string, options: TextOptions) => void;
  initialText?: string;
  initialOptions?: Partial<TextOptions>;
  isEditing?: boolean;
}

const FONT_COLORS = [
  '#000000', '#ffffff', '#2563eb', '#16a34a', '#dc2626',
  '#d97706', '#9333ea', '#0891b2', '#e11d48'
];

const FONT_SIZES = [16, 20, 24, 32, 40, 48, 64];

export function TextEditorModal(props: TextEditorModalProps) {
  if (!props.isOpen) return null;
  return <TextEditorDialogContent key={props.initialText || 'new'} {...props} />;
}

function TextEditorDialogContent({
  onClose,
  onSaveText,
  initialText = '',
  initialOptions,
  isEditing = false
}: TextEditorModalProps) {
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState(initialOptions?.fontSize || 24);
  const [color, setColor] = useState(initialOptions?.color || '#ffffff');
  const [bold, setBold] = useState(initialOptions?.bold ?? false);
  const [italic, setItalic] = useState(initialOptions?.italic ?? false);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>(initialOptions?.align || 'left');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    onSaveText(text, { fontSize, color, bold, italic, align });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">{isEditing ? 'Edit Text Element' : 'Insert Text Box'}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formatting controls */}
        <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-800/60">
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
          >
            {FONT_SIZES.map((sz) => (
              <option key={sz} value={sz}>{sz}px</option>
            ))}
          </select>

          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setBold(!bold)}
              className={`p-1.5 rounded text-xs font-bold cursor-pointer ${bold ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setItalic(!italic)}
              className={`p-1.5 rounded text-xs italic cursor-pointer ${italic ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setAlign('left')}
              className={`p-1.5 rounded cursor-pointer ${align === 'left' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAlign('center')}
              className={`p-1.5 rounded cursor-pointer ${align === 'center' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAlign('right')}
              className={`p-1.5 rounded cursor-pointer ${align === 'right' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            {FONT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full border cursor-pointer ${color === c ? 'ring-2 ring-blue-400 border-white' : 'border-slate-600'}`}
              />
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <textarea
          autoFocus
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your notes, problem statements, headings..."
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans resize-y"
          style={{
            color,
            fontWeight: bold ? 'bold' : 'normal',
            fontStyle: italic ? 'italic' : 'normal',
            textAlign: align
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500">Tip: Press Cmd/Ctrl+Enter to save</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!text.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Place on Board'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
