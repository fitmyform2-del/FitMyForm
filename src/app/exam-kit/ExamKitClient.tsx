'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import {
  Package,
  Search,
  Download,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { InteractiveCropper } from '@/components/editor/InteractiveCropper';
import { EXAM_PRESETS } from '@/config/presets';
import { ExamPreset, SingleDocSpec } from '@/types/presets';
import { DocumentRequirements, UploadedFile, ProcessingResult } from '@/types/document';
import { loadImage, renderToCanvas } from '@/lib/image/resizer';
import { compressCanvasToTargetSize } from '@/lib/compression/iterativeCompressor';
import { ExamKitSlotCard, KitSlotState } from './_components/ExamKitSlotCard';

const POPULAR_KIT_IDS = [
  'ibps-banking',
  'ssc-cgl',
  'upsc-civil-services',
  'nta-neet-jee',
  'rrb-railway',
  'gate-exam',
  'ctet'
];

function buildReqsFromSpec(spec: SingleDocSpec): DocumentRequirements {
  const firstFmt = spec.format[0] || 'JPG';
  const isSig = spec.documentType === 'signature';
  return {
    documentType: spec.documentType,
    width: spec.width || 200,
    height: spec.height || 230,
    minWidth: spec.minWidth,
    maxWidth: spec.maxWidth,
    minHeight: spec.minHeight,
    maxHeight: spec.maxHeight,
    format: firstFmt === 'JPEG' ? 'JPG' : firstFmt,
    minSizeKB: spec.minSizeKB,
    maxSizeKB: spec.maxSizeKB,
    dpi: spec.dpi || 200,
    bgColor: spec.bgColor || '#FFFFFF',
    cropMode: isSig ? 'fit' : spec.defaultCropMode || 'fill',
    signatureFilter: isSig
      ? { enabled: true, whitenBackground: true, inkBoost: true, threshold: 175 }
      : undefined
  };
}

function createInitialSlots(exam: ExamPreset): Record<string, KitSlotState> {
  const slots: Record<string, KitSlotState> = {};
  for (const [key, spec] of Object.entries(exam.documents)) {
    if (!spec) continue;
    slots[key] = {
      uploadedFile: null,
      requirements: buildReqsFromSpec(spec),
      cropRect: undefined,
      result: null,
      isProcessing: false,
      error: null
    };
  }
  return slots;
}

async function fileToUploadedFile(file: File): Promise<UploadedFile> {
  const previewUrl = URL.createObjectURL(file);
  const img = await loadImage(previewUrl);
  return {
    id: `kit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    file,
    name: file.name,
    originalSizeKB: Number((file.size / 1024).toFixed(2)),
    type: file.type,
    width: img.width,
    height: img.height,
    aspectRatio: img.height ? Number((img.width / img.height).toFixed(4)) : 1,
    previewUrl,
    isPdf: false
  };
}

export default function ExamKitClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('exam') || 'ibps-banking';
  const initialExam = EXAM_PRESETS.find((e) => e.id === initialId) || EXAM_PRESETS[0];

  const [selectedExam, setSelectedExam] = useState<ExamPreset>(initialExam);
  const [searchQuery, setSearchQuery] = useState('');
  const [slots, setSlots] = useState<Record<string, KitSlotState>>(() => createInitialSlots(initialExam));
  const [croppingKey, setCroppingKey] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    const paramId = searchParams.get('exam');
    if (!paramId) return;
    const found = EXAM_PRESETS.find((e) => e.id === paramId);
    if (found && found.id !== selectedExam.id) {
      setSelectedExam(found);
      setSlots(createInitialSlots(found));
    }
  }, [searchParams, selectedExam.id]);

  const handleSelectExam = (exam: ExamPreset) => {
    setSelectedExam(exam);
    setSlots(createInitialSlots(exam));
    setSearchQuery('');
  };

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return EXAM_PRESETS.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.organization.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  const updateSlot = (docKey: string, patch: Partial<KitSlotState>) => {
    setSlots((prev) => ({
      ...prev,
      [docKey]: { ...prev[docKey], ...patch }
    }));
  };

  const handleSlotUpload = async (docKey: string, file: File) => {
    try {
      const uploaded = await fileToUploadedFile(file);
      updateSlot(docKey, {
        uploadedFile: uploaded,
        cropRect: undefined,
        result: null,
        error: null
      });
    } catch {
      updateSlot(docKey, { error: 'Could not read image file.' });
    }
  };

  const formatSlot = async (docKey: string): Promise<ProcessingResult | null> => {
    const slot = slots[docKey];
    if (!slot?.uploadedFile) return null;
    updateSlot(docKey, { isProcessing: true, error: null });
    try {
      const img = await loadImage(slot.uploadedFile.previewUrl);
      const canvas = renderToCanvas(img, slot.requirements, slot.cropRect);
      const baseName = `${selectedExam.id}-${docKey}`;
      const result = await compressCanvasToTargetSize(canvas, slot.requirements, baseName);
      updateSlot(docKey, { result, isProcessing: false });
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Formatting failed.';
      updateSlot(docKey, { isProcessing: false, error: msg });
      return null;
    }
  };

  const imageDocEntries = Object.entries(selectedExam.documents).filter(
    ([, spec]) => spec && !(spec.format.length === 1 && spec.format[0] === 'PDF')
  );
  const uploadedCount = imageDocEntries.filter(([k]) => Boolean(slots[k]?.uploadedFile)).length;
  const formattedCount = imageDocEntries.filter(([k]) => Boolean(slots[k]?.result)).length;

  const handleDownloadAllZip = async () => {
    if (uploadedCount === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const summaryLines: string[] = [
        `FitMyForm Exam Document Kit — ${selectedExam.name}`,
        `Organization: ${selectedExam.organization}`,
        `Generated: ${new Date().toLocaleString()}`,
        ''
      ];

      let added = 0;
      for (const [docKey, spec] of imageDocEntries) {
        if (!spec) continue;
        const slot = slots[docKey];
        if (!slot?.uploadedFile) continue;

        const res = slot.result || (await formatSlot(docKey));
        if (res) {
          const ext = res.format.toLowerCase();
          const cleanFileName = `${selectedExam.id}_${docKey}_${res.width}x${res.height}.${ext}`;
          zip.file(cleanFileName, res.blob);
          summaryLines.push(
            `- ${spec.title}: ${cleanFileName} (${res.fileSizeKB} KB, ${res.width}x${res.height} px)`
          );
          added++;
        }
      }

      if (added === 0) {
        setIsZipping(false);
        return;
      }

      zip.file('README-specs.txt', summaryLines.join('\n'));
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedExam.id}-exam-kit.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
      } catch {
        // ignore
      }
    } finally {
      setIsZipping(false);
    }
  };

  const activeCropSlot = croppingKey ? slots[croppingKey] : null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Batch Exam Document Kit</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Format Your Entire <span className="text-blue-400">Exam Form Kit</span> at Once
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Pick your exam, upload Photo, Signature, Thumb Impression, and Handwritten Declaration side by side, and export one verified ZIP bundle ready for portal upload.
          </p>
        </div>

        {/* Exam Selector Bar */}
        <div className="fmf-panel p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Exam</span>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{selectedExam.name}</span>
                <Link
                  href={`/exam/${selectedExam.id}`}
                  className="text-[11px] font-semibold text-blue-400 hover:underline inline-flex items-center gap-0.5"
                >
                  Specs page <ArrowRight className="w-3 h-3" />
                </Link>
              </h2>
              <p className="text-xs text-slate-400">{selectedExam.organization} — {selectedExam.description}</p>
            </div>

            {/* Search Any of 40 Exams */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Switch exam (${EXAM_PRESETS.length} available)...`}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {filteredExams.length > 0 && (
                <div className="absolute top-[calc(100%+0.4rem)] left-0 right-0 z-30 bg-[#0f1525] border border-white/15 rounded-xl shadow-2xl overflow-hidden">
                  {filteredExams.map((exam) => (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => handleSelectExam(exam)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-blue-600/20 border-b border-white/[0.06] last:border-b-0 transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-bold text-white">{exam.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{exam.organization}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Popular Exam Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
            {POPULAR_KIT_IDS.map((id) => {
              const exam = EXAM_PRESETS.find((e) => e.id === id);
              if (!exam) return null;
              const active = selectedExam.id === exam.id;
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => handleSelectExam(exam)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/25'
                      : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {exam.name.split('(')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Slot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(selectedExam.documents).map(([docKey, spec]) => {
            if (!spec || !slots[docKey]) return null;
            return (
              <ExamKitSlotCard
                key={`${selectedExam.id}-${docKey}`}
                examId={selectedExam.id}
                docKey={docKey}
                spec={spec}
                state={slots[docKey]}
                onUpload={(file) => handleSlotUpload(docKey, file)}
                onUpdateState={(patch) => updateSlot(docKey, patch)}
                onOpenCropper={() => setCroppingKey(docKey)}
                onFormatSingle={() => formatSlot(docKey)}
              />
            );
          })}
        </div>

        {/* Batch ZIP Export Bar */}
        <div className="fmf-panel-elevated p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-black text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {uploadedCount} of {imageDocEntries.length} image documents uploaded
                {formattedCount > 0 ? ` (${formattedCount} formatted)` : ''}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% browser-side ZIP packaging • Zero server uploads</span>
            </p>
          </div>

          <button
            type="button"
            disabled={uploadedCount === 0 || isZipping}
            onClick={handleDownloadAllZip}
            className="w-full sm:w-auto fmf-btn-primary px-6 py-3.5 text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isZipping ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Formatting & Zipping Kit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <Download className="w-4 h-4" />
                <span>Format & Download All as ZIP</span>
              </>
            )}
          </button>
        </div>
      </main>

      <Footer />

      {croppingKey && activeCropSlot?.uploadedFile && (
        <InteractiveCropper
          isOpen
          uploadedFile={activeCropSlot.uploadedFile}
          requirements={activeCropSlot.requirements}
          initialCrop={activeCropSlot.cropRect}
          onClose={() => setCroppingKey(null)}
          onApplyCrop={(rect) => {
            updateSlot(croppingKey, {
              cropRect: rect,
              result: null,
              requirements: { ...activeCropSlot.requirements, cropMode: 'manual' }
            });
          }}
        />
      )}
    </div>
  );
}
