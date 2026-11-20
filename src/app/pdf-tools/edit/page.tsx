'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Upload,
  Download,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { editPdf, AnnotationItem } from '@/lib/pdf/pdfTools';
import { renderPdfAllPagesToDataUrls } from '@/lib/pdf/pdfjsLoader';
import { PdfEditorToolbar, EditorToolMode } from './_components/PdfEditorToolbar';
import { PdfPageThumbnails, EditorPageEntry } from './_components/PdfPageThumbnails';
import { PdfEditorCanvas } from './_components/PdfEditorCanvas';
import { PdfPropertiesPanel, ToolStyleState } from './_components/PdfPropertiesPanel';
import { QuickSignModal } from './_components/QuickSignModal';

const DEFAULT_STYLE: ToolStyleState = {
  color: '#1d4ed8',
  fillColor: 'transparent',
  bgColor: 'transparent',
  fontSize: 16,
  fontFamily: 'Helvetica',
  bold: true,
  italic: false,
  strokeWidth: 3,
  opacity: 1,
  stampText: 'APPROVED'
};

export default function EditPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageEntries, setPageEntries] = useState<EditorPageEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [historyPast, setHistoryPast] = useState<AnnotationItem[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<AnnotationItem[][]>([]);

  const [activeTool, setActiveTool] = useState<EditorToolMode>('text');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [styleState, setStyleState] = useState<ToolStyleState>(DEFAULT_STYLE);
  const [zoom, setZoom] = useState(1);

  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [pagesModified, setPagesModified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const commitAnnotations = useCallback((next: AnnotationItem[]) => {
    setAnnotations((prev) => {
      setHistoryPast((past) => [...past.slice(-29), prev]);
      setHistoryFuture([]);
      return next;
    });
    setEditedUrl(null);
  }, []);

  const handleUndo = useCallback(() => {
    setHistoryPast((past) => {
      if (past.length === 0) return past;
      const previous = past[past.length - 1];
      setAnnotations((curr) => {
        setHistoryFuture((f) => [curr, ...f.slice(0, 29)]);
        return previous;
      });
      setEditedUrl(null);
      return past.slice(0, -1);
    });
  }, []);

  const handleRedo = useCallback(() => {
    setHistoryFuture((future) => {
      if (future.length === 0) return future;
      const [next, ...rest] = future;
      setAnnotations((curr) => {
        setHistoryPast((p) => [...p.slice(-29), curr]);
        return next;
      });
      setEditedUrl(null);
      return rest;
    });
  }, []);

  const handleDeleteById = useCallback(
    (id: string) => {
      commitAnnotations(annotations.filter((a) => a.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [annotations, commitAnnotations, selectedId]
  );

  const handleDuplicateSelected = useCallback(() => {
    if (!selectedId) return;
    const orig = annotations.find((a) => a.id === selectedId);
    if (!orig) return;
    const dupId = `ann-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const dup: AnnotationItem = {
      ...orig,
      id: dupId,
      xRatio: Math.min(0.92, orig.xRatio + 0.03),
      yRatio: Math.min(0.92, orig.yRatio + 0.03),
      ...(orig.x2Ratio !== undefined ? { x2Ratio: Math.min(0.96, orig.x2Ratio + 0.03) } : {}),
      ...(orig.y2Ratio !== undefined ? { y2Ratio: Math.min(0.96, orig.y2Ratio + 0.03) } : {}),
      ...(orig.points
        ? {
            points: orig.points.map((p) => ({
              x: Math.min(0.98, p.x + 0.03),
              y: Math.min(0.98, p.y + 0.03)
            }))
          }
        : {})
    };
    commitAnnotations([...annotations, dup]);
    setSelectedId(dupId);
  }, [annotations, commitAnnotations, selectedId]);

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+D, Delete, Escape)
  useEffect(() => {
    if (!file) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isTyping) return;

      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((meta && e.key.toLowerCase() === 'y') || (meta && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        handleRedo();
      } else if (meta && e.key.toLowerCase() === 'd' && selectedId) {
        e.preventDefault();
        handleDuplicateSelected();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        handleDeleteById(selectedId);
      } else if (e.key === 'Escape' || (!meta && e.key.toLowerCase() === 'v')) {
        setSelectedId(null);
        setActiveTool('select');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [file, selectedId, handleUndo, handleRedo, handleDuplicateSelected, handleDeleteById]);

  const loadPdfFile = async (selected: File) => {
    setFile(selected);
    setAnnotations([]);
    setHistoryPast([]);
    setHistoryFuture([]);
    setSelectedId(null);
    setEditedUrl(null);
    setCurrentPage(0);
    setPagesModified(false);
    setErrorMsg(null);
    setIsLoadingPages(true);
    try {
      const rendered = await renderPdfAllPagesToDataUrls(selected, { scale: 1.4, quality: 0.88 });
      setPageEntries(
        rendered.map((r, idx) => ({
          uid: `pg-${idx}-${Date.now()}`,
          plan: { sourceIndex: idx, rotation: 0 },
          preview: r
        }))
      );
    } catch {
      setPageEntries([]);
      setErrorMsg('Could not render PDF preview. Make sure it is a valid, unlocked PDF.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) loadPdfFile(selected);
    e.target.value = '';
  };

  const handleAddAnnotation = (ann: AnnotationItem) => {
    commitAnnotations([...annotations, ann]);
  };

  const handleUpdateAnnotation = (id: string, patch: Partial<AnnotationItem>, recordHistory = true) => {
    if (recordHistory) {
      commitAnnotations(annotations.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    } else {
      setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
      setEditedUrl(null);
    }
  };

  const handleInsertImageDataUrl = (dataUrl: string, defaultW = 0.28, defaultH = 0.14) => {
    const id = `ann-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const ann: AnnotationItem = {
      id,
      type: 'image',
      pageIndex: currentPage,
      xRatio: 0.36,
      yRatio: 0.4,
      wRatio: defaultW,
      hRatio: defaultH,
      imageDataUrl: dataUrl,
      opacity: 1
    };
    commitAnnotations([...annotations, ann]);
    setSelectedId(id);
    setActiveTool('select');
  };

  const handleInsertImageFile = (imgFile: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      if (!dataUrl) return;
      // Convert non-PNG/JPG (like WEBP) via canvas to PNG so pdf-lib always embeds cleanly
      if (dataUrl.startsWith('data:image/png') || dataUrl.startsWith('data:image/jpeg')) {
        handleInsertImageDataUrl(dataUrl, 0.28, 0.2);
      } else {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          c.getContext('2d')?.drawImage(img, 0, 0);
          handleInsertImageDataUrl(c.toDataURL('image/png'), 0.28, 0.2);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(imgFile);
  };

  // Page Operations
  const handleRotatePage = (idx: number) => {
    setPageEntries((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, plan: { ...p.plan, rotation: (p.plan.rotation + 90) % 360 } } : p
      )
    );
    setPagesModified(true);
    setEditedUrl(null);
  };

  const handleDuplicatePage = (idx: number) => {
    setPageEntries((prev) => {
      const target = prev[idx];
      if (!target) return prev;
      const copy: EditorPageEntry = {
        uid: `pg-dup-${Date.now()}`,
        plan: { ...target.plan },
        preview: target.preview
      };
      const next = [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
      return next;
    });
    // Shift annotations on pages after idx
    commitAnnotations(
      annotations.map((a) => (a.pageIndex > idx ? { ...a, pageIndex: a.pageIndex + 1 } : a))
    );
    setCurrentPage(idx + 1);
    setPagesModified(true);
  };

  const handleInsertBlankPage = (afterIndex: number) => {
    const blank: EditorPageEntry = {
      uid: `pg-blank-${Date.now()}`,
      plan: { sourceIndex: -1, rotation: 0, width: 595.28, height: 841.89 }
    };
    setPageEntries((prev) => [...prev.slice(0, afterIndex + 1), blank, ...prev.slice(afterIndex + 1)]);
    commitAnnotations(
      annotations.map((a) => (a.pageIndex > afterIndex ? { ...a, pageIndex: a.pageIndex + 1 } : a))
    );
    setCurrentPage(afterIndex + 1);
    setPagesModified(true);
  };

  const handleDeletePage = (idx: number) => {
    if (pageEntries.length <= 1) return;
    setPageEntries((prev) => prev.filter((_, i) => i !== idx));
    commitAnnotations(
      annotations
        .filter((a) => a.pageIndex !== idx)
        .map((a) => (a.pageIndex > idx ? { ...a, pageIndex: a.pageIndex - 1 } : a))
    );
    setCurrentPage((cur) => Math.max(0, Math.min(cur, pageEntries.length - 2)));
    setPagesModified(true);
  };

  const handleClearPage = () => {
    const remaining = annotations.filter((a) => a.pageIndex !== currentPage);
    if (remaining.length !== annotations.length) {
      commitAnnotations(remaining);
      setSelectedId(null);
    }
  };

  const handleExport = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const plan = pagesModified ? pageEntries.map((p) => p.plan) : undefined;
      const blob = await editPdf(file, annotations, plan);
      if (editedUrl) URL.revokeObjectURL(editedUrl);
      setEditedUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to export edited PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const annotationCountByPage = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const a of annotations) {
      counts[a.pageIndex] = (counts[a.pageIndex] || 0) + 1;
    }
    return counts;
  }, [annotations]);

  const pageAnnotations = useMemo(
    () => annotations.filter((a) => a.pageIndex === currentPage),
    [annotations, currentPage]
  );
  const selectedAnnotation = useMemo(
    () => annotations.find((a) => a.id === selectedId) || null,
    [annotations, selectedId]
  );

  const currentEntry = pageEntries[currentPage];
  const hasEdits = annotations.length > 0 || pagesModified;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 py-6 space-y-5">
        {/* Compact Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/pdf-tools"
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Back to PDF Tools"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>PDF Editor Studio</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  12+ Tools
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Add text, highlight, whiteout, draw, shapes, arrows, stamps, signatures, images & organize pages — 100% private in-browser.
              </p>
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-xl truncate max-w-[220px]">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPageEntries([]);
                  setAnnotations([]);
                  setEditedUrl(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-bold cursor-pointer"
              >
                Change PDF
              </button>
            </div>
          )}
        </div>

        {/* Upload Dropzone */}
        {!file ? (
          <div className="max-w-3xl mx-auto py-8 space-y-6">
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = e.dataTransfer.files?.[0];
                if (dropped && dropped.type === 'application/pdf') loadPdfFile(dropped);
              }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-blue-500/60 bg-[#0e1424]/70 hover:bg-blue-950/15 rounded-3xl p-12 sm:p-16 cursor-pointer transition-all text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <span className="text-lg font-black text-white block">Drop a PDF here or click to open</span>
                <span className="text-xs text-slate-400 block max-w-md mx-auto">
                  Type text, whiteout mistakes, highlight passages, draw freehand, add checkmarks/dates/stamps, insert images or signatures, and rotate/insert/delete pages.
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Client-Side • Zero Server Upload</span>
              </div>
              <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
            </label>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { title: 'Rich Text & Whiteout', desc: '3 fonts, bold/italic, cover & replace' },
                { title: 'Highlight & Draw', desc: 'Highlighter strips & freehand pen' },
                { title: 'Shapes & Stamps', desc: 'Boxes, circles, arrows, ✓/✗, stamps' },
                { title: 'Images & Pages', desc: 'Insert photos/signatures, rotate & add pages' }
              ].map((feat) => (
                <div key={feat.title} className="fmf-card p-3.5 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{feat.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Studio Toolbar */}
            <PdfEditorToolbar
              activeTool={activeTool}
              onSelectTool={(t) => {
                setActiveTool(t);
                if (t !== 'select') setSelectedId(null);
              }}
              onInsertImageFile={handleInsertImageFile}
              onOpenSignModal={() => setIsSignModalOpen(true)}
              canUndo={historyPast.length > 0}
              canRedo={historyFuture.length > 0}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClearPage={handleClearPage}
              zoom={zoom}
              onZoomChange={setZoom}
              isProcessing={isProcessing}
              hasEdits={hasEdits}
              onExport={handleExport}
            />

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Export Ready Banner */}
            {editedUrl && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-sm font-black text-white">Edited PDF Ready!</div>
                    <p className="text-xs text-slate-300">
                      {annotations.length} edit(s) across {pageEntries.length} page(s) burned cleanly into your PDF.
                    </p>
                  </div>
                </div>
                <a
                  href={editedUrl}
                  download={`edited-${file.name}`}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Edited PDF</span>
                </a>
              </div>
            )}

            {/* 3-Column Studio Workspace */}
            {isLoadingPages ? (
              <div className="h-[60vh] bg-[#0e1424] border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-300">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
                <span className="text-sm font-bold">Rendering PDF pages for visual editing...</span>
              </div>
            ) : currentEntry ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left: Page Thumbnails */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <PdfPageThumbnails
                    pages={pageEntries}
                    currentPage={currentPage}
                    annotationCountByPage={annotationCountByPage}
                    onSelectPage={(idx) => {
                      setCurrentPage(idx);
                      setSelectedId(null);
                    }}
                    onRotatePage={handleRotatePage}
                    onDuplicatePage={handleDuplicatePage}
                    onInsertBlankPage={handleInsertBlankPage}
                    onDeletePage={handleDeletePage}
                  />
                </div>

                {/* Center: Interactive Page Canvas */}
                <div className="lg:col-span-7 order-1 lg:order-2 space-y-2">
                  <PdfEditorCanvas
                    pageEntry={currentEntry}
                    pageIndex={currentPage}
                    zoom={zoom}
                    activeTool={activeTool}
                    styleDefaults={styleState}
                    annotations={annotations}
                    selectedId={selectedId}
                    onSelectId={setSelectedId}
                    onAddAnnotation={handleAddAnnotation}
                    onUpdateAnnotation={handleUpdateAnnotation}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-400">
                    <span>
                      Page <strong className="text-white">{currentPage + 1}</strong> of {pageEntries.length} •{' '}
                      <strong className="text-blue-300 capitalize">{activeTool}</strong> tool active
                    </span>
                    <span className="hidden sm:inline">
                      {activeTool === 'select'
                        ? 'Drag to move • Drag corner dot to resize • Double-click text to edit • Del to delete'
                        : 'Click or drag anywhere (even inside existing shapes/lines) to create • Press V or Esc for Select'}
                    </span>
                  </div>
                </div>

                {/* Right: Context Properties & Layers */}
                <div className="lg:col-span-3 order-3">
                  <PdfPropertiesPanel
                    activeTool={activeTool}
                    styleState={styleState}
                    onStyleChange={(patch) => setStyleState((prev) => ({ ...prev, ...patch }))}
                    selectedAnnotation={selectedAnnotation}
                    pageAnnotations={pageAnnotations}
                    onSelectId={setSelectedId}
                    onUpdateSelected={(patch) => {
                      if (selectedId) handleUpdateAnnotation(selectedId, patch, true);
                    }}
                    onDuplicateSelected={handleDuplicateSelected}
                    onDeleteById={handleDeleteById}
                  />
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400 bg-[#0e1424] rounded-2xl border border-white/10">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pages could be displayed.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      <QuickSignModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onInsertSignature={(dataUrl) => handleInsertImageDataUrl(dataUrl, 0.26, 0.1)}
      />
    </div>
  );
}
