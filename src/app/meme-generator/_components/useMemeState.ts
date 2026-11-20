'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { UploadedFile } from '@/types/document';
import { createPresetDataUrl, getTemplateById } from './memePresets';
import { renderCompositeMemeCanvas } from './memeEngine';
import { loadImg, triggerBlobDownload } from './memeLoadUtils';
import {
  MemeText,
  MemeSticker,
  MemeLayoutMode,
  MemeImageSettings,
  MemeExportSettings,
  MemeImageOverlay,
  TemplateSlot,
  INITIAL_TEXTS,
  INITIAL_IMAGE_SETTINGS
} from './memeTypes';

export function useMemeState() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [layout, setLayout] = useState<MemeLayoutMode>('classic');
  const [texts, setTexts] = useState<MemeText[]>(INITIAL_TEXTS);
  const [stickers, setStickers] = useState<MemeSticker[]>([]);
  const [overlayImages, setOverlayImages] = useState<MemeImageOverlay[]>([]);
  const [imageSettings, setImageSettings] = useState<MemeImageSettings>(INITIAL_IMAGE_SETTINGS);
  const [exportSettings, setExportSettings] = useState<MemeExportSettings>({ format: 'image/jpeg', quality: 0.95 });
  const [memeResultUrl, setMemeResultUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const currentBlobRef = useRef<Blob | null>(null);
  const prevUrlRef = useRef<string | null>(null);
  const viralIndexRef = useRef(0);

  const activeTemplate = activeTemplateId ? getTemplateById(activeTemplateId) : undefined;
  const slots: TemplateSlot[] = activeTemplate?.slots || [];

  const loadPreset = (presetId: string, name: string, top: string, bottom: string) => {
    const tmpl = getTemplateById(presetId);
    setActiveTemplateId(presetId);
    setOverlayImages([]);
    const dataUrl = createPresetDataUrl(presetId);
    setUploadedFile({
      id: `preset-${presetId}`,
      file: new File([], `${presetId}.jpg`, { type: 'image/jpeg' }),
      type: 'image/jpeg',
      previewUrl: dataUrl,
      name: `${name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      originalSizeKB: 40,
      isPdf: false
    });

    if (tmpl?.defaultTexts && tmpl.defaultTexts.length >= 2) {
      setTexts([
        { ...INITIAL_TEXTS[0], ...tmpl.defaultTexts[0], text: top },
        { ...INITIAL_TEXTS[1], ...tmpl.defaultTexts[1], text: bottom }
      ]);
    } else {
      setTexts((prev) => [
        { ...prev[0], text: top, xPercent: 50, yPercent: 12 },
        { ...prev[1], text: bottom, xPercent: 50, yPercent: 88 },
        ...prev.slice(2)
      ]);
    }
  };

  const updateMemeCanvas = useCallback(async () => {
    if (!uploadedFile) return;
    setIsRendering(true);
    try {
      const baseImg = await loadImg(uploadedFile.previewUrl);
      const loadedOverlays = await Promise.all(
        overlayImages.map(async (overlay) => ({ overlay, img: await loadImg(overlay.url) }))
      );
      const canvas = renderCompositeMemeCanvas(baseImg, layout, texts, stickers, imageSettings, loadedOverlays);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            currentBlobRef.current = blob;
            if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
            const nextUrl = URL.createObjectURL(blob);
            prevUrlRef.current = nextUrl;
            setMemeResultUrl(nextUrl);
          }
          setIsRendering(false);
        },
        exportSettings.format,
        exportSettings.quality
      );
    } catch {
      setIsRendering(false);
    }
  }, [uploadedFile, layout, texts, stickers, imageSettings, overlayImages, exportSettings.format, exportSettings.quality]);

  useEffect(() => {
    if (uploadedFile) {
      const timer = setTimeout(() => { void updateMemeCanvas(); }, 30);
      return () => clearTimeout(timer);
    }
  }, [uploadedFile, updateMemeCanvas]);

  const handleAddImageToSlot = (slot: TemplateSlot, file: File) => {
    const url = URL.createObjectURL(file);
    setOverlayImages((prev) => [
      ...prev.filter((i) => i.slotId !== slot.id),
      {
        id: String(Date.now()),
        url,
        name: file.name,
        slotId: slot.id,
        xPercent: slot.xPercent,
        yPercent: slot.yPercent,
        widthPercent: slot.widthPercent,
        heightPercent: slot.heightPercent,
        rotation: 0,
        opacity: 1,
        fit: 'cover'
      }
    ]);
  };

  const handleSwapSlots = () => {
    if (slots.length < 2) return;
    const s0 = slots[0];
    const s1 = slots[1];
    setOverlayImages((prev) =>
      prev.map((img) => {
        if (img.slotId === s0.id) {
          return { ...img, slotId: s1.id, xPercent: s1.xPercent, yPercent: s1.yPercent, widthPercent: s1.widthPercent, heightPercent: s1.heightPercent };
        }
        if (img.slotId === s1.id) {
          return { ...img, slotId: s0.id, xPercent: s0.xPercent, yPercent: s0.yPercent, widthPercent: s0.widthPercent, heightPercent: s0.heightPercent };
        }
        return img;
      })
    );
  };

  const handleCycleViralCaptions = () => {
    const list = activeTemplate?.viralCaptions || [];
    if (list.length === 0) return;
    const item = list[viralIndexRef.current % list.length];
    viralIndexRef.current += 1;
    setTexts((prev) => [{ ...prev[0], text: item.top }, { ...prev[1], text: item.bottom }, ...prev.slice(2)]);
  };

  const handleAddCustomImage = (file: File) => {
    setOverlayImages((prev) => [
      ...prev,
      { id: String(Date.now()), url: URL.createObjectURL(file), name: file.name, xPercent: 50, yPercent: 50, widthPercent: 30, heightPercent: 30, rotation: 0, opacity: 1, fit: 'contain' }
    ]);
  };

  const handleCopyClipboard = async () => {
    if (!uploadedFile) return;
    try {
      const baseImg = await loadImg(uploadedFile.previewUrl);
      const loadedOverlays = await Promise.all(
        overlayImages.map(async (overlay) => ({ overlay, img: await loadImg(overlay.url) }))
      );
      const canvas = renderCompositeMemeCanvas(baseImg, layout, texts, stickers, imageSettings, loadedOverlays);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        } catch {
          if (currentBlobRef.current) triggerBlobDownload(currentBlobRef.current, uploadedFile.name, exportSettings.format);
        }
      }, 'image/png');
    } catch {
      if (currentBlobRef.current) triggerBlobDownload(currentBlobRef.current, uploadedFile.name, exportSettings.format);
    }
  };

  return {
    uploadedFile,
    setUploadedFile,
    activeTemplate,
    layout,
    setLayout,
    texts,
    setTexts,
    stickers,
    setStickers,
    overlayImages,
    slots,
    imageSettings,
    setImageSettings,
    exportSettings,
    setExportSettings,
    memeResultUrl,
    isRendering,
    isCopied,
    loadPreset,
    handleAddImageToSlot,
    handleSwapSlots,
    handleCycleViralCaptions,
    handleAddCustomImage,
    handleUpdateImage: (id: string, upd: Partial<MemeImageOverlay>) => setOverlayImages((p) => p.map((i) => (i.id === id ? { ...i, ...upd } : i))),
    handleRemoveImage: (id: string) => setOverlayImages((p) => p.filter((i) => i.id !== id)),
    handleAddText: () => setTexts((p) => [...p, { id: String(Date.now()), text: 'EXTRA TEXT', fontFamily: 'Impact', fontSizeRatio: 0.07, color: '#FFFFFF', strokeColor: '#000000', strokeWidth: 3, align: 'center', isUppercase: true, xPercent: 50, yPercent: 50, rotation: 0, shadow: true }]),
    handleUpdateText: (id: string, upd: Partial<MemeText>) => setTexts((p) => p.map((t) => (t.id === id ? { ...t, ...upd } : t))),
    handleRemoveText: (id: string) => setTexts((p) => p.filter((t) => t.id !== id)),
    handleAddSticker: (emoji: string) => setStickers((p) => [...p, { id: String(Date.now()), emoji, xPercent: 50, yPercent: 50, sizePercent: 16, rotation: 0 }]),
    handleDownload: () => currentBlobRef.current && uploadedFile && triggerBlobDownload(currentBlobRef.current, uploadedFile.name, exportSettings.format),
    handleCopyClipboard,
    handleResetAll: () => {
      setTexts(INITIAL_TEXTS);
      setStickers([]);
      setOverlayImages([]);
      setImageSettings(INITIAL_IMAGE_SETTINGS);
      setLayout('classic');
    }
  };
}
