'use client';

import React from 'react';
import { PenTool, User, Calendar, CheckSquare, Trash2, ShieldCheck } from 'lucide-react';
import { SignField } from '@/lib/pdf/pdfTools';

interface SignFieldPaletteProps {
  activeSignatureUrl: string | null;
  fields: SignField[];
  appendAuditTrail: boolean;
  onOpenModal: () => void;
  onAddField: (type: SignField['type'], defaultValue?: string) => void;
  onRemoveField: (id: string) => void;
  onUpdateField: (id: string, key: keyof SignField, val: any) => void;
  onAuditTrailChange: (val: boolean) => void;
}

export function SignFieldPalette({
  activeSignatureUrl,
  fields,
  appendAuditTrail,
  onOpenModal,
  onAddField,
  onRemoveField,
  onUpdateField,
  onAuditTrailChange
}: SignFieldPaletteProps) {
  return (
    <div className="space-y-6">
      {/* Signature Creator & Field Palette */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">My Saved Signature</span>
          <button
            onClick={onOpenModal}
            className="px-3.5 py-2 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            {activeSignatureUrl ? 'Change Signature' : 'Create Signature'}
          </button>
        </div>

        {activeSignatureUrl ? (
          <div className="bg-white p-3 rounded-2xl flex items-center justify-center h-20 border border-white/20">
            <img src={activeSignatureUrl} alt="Signature Preview" className="max-h-full object-contain" />
          </div>
        ) : (
          <div className="p-4 border-2 border-dashed border-white/10 rounded-2xl text-center text-xs text-slate-500">
            Click &quot;Create Signature&quot; to draw, type calligraphy name, or upload signature PNG image.
          </div>
        )}

        {/* Add Field Buttons Toolbar */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-300 block">Add e-Sign Fields to PDF:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onAddField('signature', activeSignatureUrl || undefined)}
              className="p-2.5 min-h-[44px] rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5 text-indigo-400" /> Signature
            </button>
            <button
              onClick={() => onAddField('name', 'John Doe')}
              className="p-2.5 min-h-[44px] rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
            </button>
            <button
              onClick={() => onAddField('date', new Date().toISOString().split('T')[0])}
              className="p-2.5 min-h-[44px] rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Date Signed
            </button>
            <button
              onClick={() => onAddField('checkbox')}
              className="p-2.5 min-h-[44px] rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> Checkbox
            </button>
          </div>
        </div>
      </div>

      {/* Added Fields Manager List */}
      {fields.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 font-mono">Placed Fields ({fields.length})</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {fields.map((f, idx) => (
              <div key={f.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white capitalize">{f.type}</span>
                  <span className="text-slate-400 font-mono text-[10px]">Page {f.pageIndex + 1}</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={f.value || ''}
                    onChange={(e) => onUpdateField(f.id, 'value', e.target.value)}
                    placeholder="Value..."
                    className="px-2.5 py-1 min-h-[36px] rounded-lg bg-black/40 border border-white/10 text-white font-bold text-xs w-32 focus:outline-none"
                  />
                  <button
                    onClick={() => onRemoveField(f.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Trail Option */}
      <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-white">Append e-Sign Audit Trail Certificate</h5>
            <p className="text-[11px] text-slate-400">Adds UTC timestamp, document hash, and legal verification seal.</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={appendAuditTrail}
          onChange={(e) => onAuditTrailChange(e.target.checked)}
          className="w-5 h-5 accent-emerald-500 cursor-pointer min-h-[24px]"
        />
      </div>
    </div>
  );
}
