'use client';

import React from 'react';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { RequirementsForm } from '@/components/editor/RequirementsForm';
import { ImageComparisonPreview } from '@/components/preview/ImageComparisonPreview';
import { ValidationChecklist } from '@/components/validation/ValidationChecklist';
import { UploadedFile, DocumentRequirements, ProcessingResult } from '@/types/document';
import { Sparkles, ArrowRight, RefreshCw, SlidersHorizontal, AlertCircle, CheckCircle2 } from 'lucide-react';

interface HomeExamWorkspaceProps {
  uploadedFile: UploadedFile | null;
  requirements: DocumentRequirements;
  presetNotice: string | null;
  isProcessing: boolean;
  processingResult: ProcessingResult | null;
  errorMsg: string | null;
  onFileUpload: (file: UploadedFile) => void;
  onClearFile: () => void;
  onRequirementsChange: (reqs: DocumentRequirements) => void;
  onOpenManualCropper: () => void;
  onProcessDocument: () => void;
}

export function HomeExamWorkspace({
  uploadedFile,
  requirements,
  presetNotice,
  isProcessing,
  processingResult,
  errorMsg,
  onFileUpload,
  onClearFile,
  onRequirementsChange,
  onOpenManualCropper,
  onProcessDocument
}: HomeExamWorkspaceProps) {
  return (
    <section className="space-y-8 pt-8 border-t border-white/10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Exam Photo & Document Specification Workspace
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Format passport photos & signatures to exact KB limits and pixel dimensions for SSC, UPSC, IBPS, RRB, CTET forms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload & Specifications (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Upload Source Document */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs text-white font-bold shadow-sm">
                  1
                </span>
                <span>Upload Source Document File</span>
              </h2>
              {uploadedFile && (
                <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> File Selected
                </span>
              )}
            </div>
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={onFileUpload}
              onClearFile={onClearFile}
            />
          </div>

          {/* Step 2: Form Specifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs text-white font-bold shadow-sm">
                  2
                </span>
                <span>Form Specifications & Exam Requirements</span>
              </h2>
            </div>
            <RequirementsForm
              requirements={requirements}
              onChange={onRequirementsChange}
              onOpenManualCropper={onOpenManualCropper}
              presetNotice={presetNotice}
            />
          </div>

          {/* Process Action CTA Button */}
          <div className="mt-6 hidden md:block">
            <button
              onClick={onProcessDocument}
              disabled={!uploadedFile || isProcessing}
              className={`w-full py-4 min-h-[52px] rounded-xl font-semibold text-base flex items-center justify-center gap-3 transition-colors shadow-sm ${
                !uploadedFile
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : isProcessing
                  ? 'bg-indigo-700 text-white cursor-wait opacity-80'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Process & Format Document</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-rose-300 text-xs flex items-center gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right Column: Live Output & Verification (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-xs text-white font-bold shadow-sm">
              3
            </span>
            <span>Live Verification & Download</span>
          </h2>

          {processingResult && uploadedFile ? (
            <div className="space-y-6 animate-fade-in">
              <ImageComparisonPreview
                uploadedFile={uploadedFile}
                processingResult={processingResult}
                onOptimizeAgain={onProcessDocument}
              />
              <ValidationChecklist
                result={processingResult}
                requirements={requirements}
                onOptimizeAgain={onProcessDocument}
              />
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 border-dashed rounded-2xl p-10 text-center text-slate-300 space-y-4">
              <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
                <SlidersHorizontal className="w-7 h-7" />
              </div>
              <h4 className="font-semibold text-slate-100 text-base">Live Preview Will Appear Here</h4>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                Upload your document on the left, adjust specifications or pick an exam preset, and click <strong className="text-indigo-400">Process & Format Document</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
