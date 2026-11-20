'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { applyFiltersCanvas, FilterOptions } from '@/lib/image/editorTools';
import { Wand2 } from 'lucide-react';
import { PhotoEditorControls } from './_components/PhotoEditorControls';

export default function PhotoEditorClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
    hueRotate: 0
  });
  const [editedUrl, setEditedUrl] = useState<string | null>(null);

  // Pick up handoff image when user clicks "Open in Photo Editor" from another tool
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('fitmyform_handoff_image');
      if (!raw) return;
      sessionStorage.removeItem('fitmyform_handoff_image');
      const parsed = JSON.parse(raw) as {
        dataUrl: string;
        name: string;
        type: string;
        sizeKB: number;
        width: number;
        height: number;
      };
      fetch(parsed.dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], parsed.name || 'edited.jpg', { type: parsed.type || 'image/jpeg' });
          const objectUrl = URL.createObjectURL(blob);
          setUploadedFile({
            id: `handoff-${Date.now()}`,
            file,
            name: file.name,
            originalSizeKB: parsed.sizeKB || Number((blob.size / 1024).toFixed(2)),
            type: file.type,
            width: parsed.width,
            height: parsed.height,
            aspectRatio: parsed.height ? Number((parsed.width / parsed.height).toFixed(4)) : 1,
            previewUrl: objectUrl,
            isPdf: false
          });
        })
        .catch(() => {});
    } catch {
      // ignore storage errors
    }
  }, []);

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'grayscale':
        setFilters((prev) => ({ ...prev, grayscale: 100, sepia: 0, saturate: 100 }));
        break;
      case 'sepia':
        setFilters((prev) => ({ ...prev, sepia: 100, grayscale: 0, saturate: 120 }));
        break;
      case 'vintage':
        setFilters((prev) => ({ ...prev, sepia: 40, contrast: 120, brightness: 105, saturate: 85 }));
        break;
      case 'vivid':
        setFilters((prev) => ({ ...prev, saturate: 160, contrast: 115, brightness: 105 }));
        break;
      case 'reset':
        setFilters({
          brightness: 100,
          contrast: 100,
          saturate: 100,
          grayscale: 0,
          sepia: 0,
          invert: 0,
          blur: 0,
          hueRotate: 0
        });
        break;
    }
  };

  useEffect(() => {
    let active = true;
    if (uploadedFile) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = applyFiltersCanvas(img, filters);
        canvas.toBlob((blob) => {
          if (blob && active) {
            setEditedUrl((prevUrl) => {
              if (prevUrl) URL.revokeObjectURL(prevUrl);
              return URL.createObjectURL(blob);
            });
          }
        }, uploadedFile.file.type || 'image/jpeg', 0.95);
      };
      img.src = uploadedFile.previewUrl;
    }
    return () => { active = false; };
  }, [uploadedFile, filters]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300 text-xs font-bold uppercase tracking-wider">
            <Wand2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Creative Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Photo <span className="text-pink-400">Editor</span> Online
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Enhance pictures with instant presets, brightness, contrast, saturation, and filters with 100% browser privacy.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={(f) => { setUploadedFile(f); setEditedUrl(null); }}
              onClearFile={() => setUploadedFile(null)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Live Editor Stage (7 cols) */}
            <div className="lg:col-span-7 fmf-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
                <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold py-1 cursor-pointer">
                  Change Photo
                </button>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center min-h-[340px] overflow-hidden">
                <img
                  src={editedUrl || uploadedFile.previewUrl}
                  alt="Editor Live"
                  className="max-h-[400px] w-auto object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Editor Sidebar Controls (5 cols) */}
            <div className="lg:col-span-5">
              <PhotoEditorControls
                filters={filters}
                editedUrl={editedUrl}
                uploadedFileName={uploadedFile.name}
                onApplyPreset={applyPreset}
                onFilterChange={setFilters}
              />
            </div>
          </div>
        )}

        <SeoContentSection
          title="Free Online Photo Editor with Filters & Effects"
          description="Adjust contrast, saturation, and brightness of photos or apply artistic vintage and vivid filters directly in your browser."
          faqs={[
            {
              question: 'Are my photos sent to a server when editing?',
              answer: 'No. All photo filters execute on your device using HTML5 Canvas filters.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
