'use client';

import React, { useState } from 'react';
import { X, Plus, Copy, Trash2, LayoutGrid, Check, Clock } from 'lucide-react';
import { WhiteboardBoard } from '../types/whiteboard';
import { BOARD_PRESETS, BoardPreset } from '../utils/boardPresets';

interface MultiBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boards: WhiteboardBoard[];
  activeBoardId: string;
  onSelectBoard: (boardId: string) => void;
  onCreateBoard: (presetId: string, title?: string) => void;
  onDuplicateBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
}

export function MultiBoardModal({
  isOpen,
  onClose,
  boards,
  activeBoardId,
  onSelectBoard,
  onCreateBoard,
  onDuplicateBoard,
  onDeleteBoard
}: MultiBoardModalProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'boards'>('templates');

  if (!isOpen) return null;

  const handleCreate = (preset: BoardPreset) => {
    onCreateBoard(preset.id);
    onClose();
  };

  const handleSelect = (boardId: string) => {
    onSelectBoard(boardId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Multi-Board Workspace</h2>
              <p className="text-xs text-slate-400">Choose a board template or switch between your saved boards</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 sm:px-5 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'templates' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            New Board Templates
          </button>
          <button
            onClick={() => setActiveTab('boards')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'boards' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Saved Boards</span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full font-mono">{boards.length}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar flex-1">
          {activeTab === 'templates' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BOARD_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleCreate(preset)}
                  className="group relative bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/60 rounded-xl p-3.5 transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg hover:shadow-blue-600/10"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-md border border-white/20 shrink-0"
                        style={{ backgroundColor: preset.themeColor }}
                      />
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {preset.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-700/60 text-slate-300 rounded-full shrink-0">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{preset.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <span className="text-[11px] text-blue-400 font-medium group-hover:underline flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Start this board
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {boards.map((board) => {
                const isActive = board.id === activeBoardId;
                const presetInfo = BOARD_PRESETS.find((p) => p.background === board.boardType) || BOARD_PRESETS[0];
                return (
                  <div
                    key={board.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isActive ? 'bg-blue-950/30 border-blue-500/50' : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg border border-white/20 shrink-0 flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: presetInfo.themeColor }}
                      >
                        {isActive && <Check className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white truncate">{board.title}</h4>
                          {isActive && (
                            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{board.pages?.length || 1} {board.pages?.length === 1 ? 'page' : 'pages'}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(board.updatedAt || board.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => handleSelect(board.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                        >
                          Open
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 text-xs text-blue-400 font-medium">Opened</span>
                      )}
                      <button
                        type="button"
                        onClick={() => onDuplicateBoard(board.id)}
                        title="Duplicate Board"
                        className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {boards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete board "${board.title}"?`)) {
                              onDeleteBoard(board.id);
                            }
                          }}
                          title="Delete Board"
                          className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
