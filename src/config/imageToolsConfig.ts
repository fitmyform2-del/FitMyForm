export interface ImageToolConfig {
  id: string;
  name: string;
  route: string;
  category: 'exam' | 'optimize' | 'create' | 'edit' | 'convert' | 'security' | 'pdf';
  description: string;
  shortDescription: string;
  badge?: string;
  iconName: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

export const IMAGE_TOOLS: ImageToolConfig[] = [
  {
    id: 'ssc-photo-resizer',
    name: 'SSC Photo Resizer',
    route: '/ssc-photo-resizer',
    category: 'exam',
    description: 'Format passport photo to 200×230 px and 20–50 KB JPG for SSC CGL, CHSL, MTS & GD exams.',
    shortDescription: '200×230 px • 20–50 KB JPG',
    badge: 'Popular',
    iconName: 'Camera',
    seoTitle: 'SSC Photo Resizer 200x230 px (20-50 KB) | FitMyForm',
    seoDescription: 'Official SSC photo resizer for CGL, CHSL, MTS, and GD forms.',
    keywords: ['ssc photo resizer', 'ssc cgl photo size', 'ssc photo 20-50 kb']
  },
  {
    id: 'signature-resizer',
    name: 'Signature Resizer',
    route: '/signature-resizer',
    category: 'exam',
    description: 'Resize signature to 140×60 px and strict 10–20 KB JPG with clean white background.',
    shortDescription: '140×60 px • 10–20 KB JPG',
    badge: 'Official',
    iconName: 'PenTool',
    seoTitle: 'Online Signature Resizer (140x60, 10-20 KB) | FitMyForm',
    seoDescription: 'Resize signature images to official dimensions and file size for online forms.',
    keywords: ['signature resizer 10-20 kb', '140x60 signature resizer']
  },
  {
    id: 'passport-photo-resizer',
    name: 'Passport Photo Resizer',
    route: '/photo-resizer',
    category: 'exam',
    description: 'Resize photos to 200×230 px or 350×450 px with target KB compression for all online forms.',
    shortDescription: 'Universal 20–50 KB passport photo maker',
    badge: 'Universal',
    iconName: 'FileCheck',
    seoTitle: 'Passport Photo Resizer for Online Forms | FitMyForm',
    seoDescription: 'Resize passport photos to exact dimensions and file size for competitive exams.',
    keywords: ['passport photo resizer', 'online photo converter jpg']
  },
  {
    id: 'compress-image',
    name: 'Compress IMAGE',
    route: '/image-compressor',
    category: 'optimize',
    description: 'Compress JPG, PNG, SVG, and WEBP images while saving space and maintaining maximum quality.',
    shortDescription: 'Reduce file size without quality loss',
    badge: 'Fast',
    iconName: 'Minimize2',
    seoTitle: 'Free Online Image Compressor - Reduce File Size in KB',
    seoDescription: 'Compress images online without losing quality. 100% client-side privacy.',
    keywords: ['compress image online', 'reduce image size in kb']
  },
  {
    id: 'resize-image',
    name: 'Resize IMAGE',
    route: '/photo-resizer',
    category: 'edit',
    description: 'Define dimensions by pixel size or percentage and resize JPG, PNG, SVG, and GIF images.',
    shortDescription: 'Change width and height in px or %',
    iconName: 'Maximize2',
    seoTitle: 'Online Image Resizer - Resize Photo Dimensions in Pixels',
    seoDescription: 'Resize JPG, PNG, SVG, and WEBP images by custom pixel dimensions.',
    keywords: ['resize image online', 'image resizer pixels']
  },
  {
    id: 'crop-image',
    name: 'Crop IMAGE',
    route: '/crop-image',
    category: 'edit',
    description: 'Crop JPG, PNG, or GIF images with ease; choose aspect ratios or crop custom pixel bounds visually.',
    shortDescription: 'Trim photo margins & aspect ratios',
    iconName: 'Crop',
    seoTitle: 'Free Online Image Cropper - Crop JPG, PNG, GIF visually',
    seoDescription: 'Crop images online for free with visual aspect ratio selector.',
    keywords: ['crop image online', 'crop photo free']
  },
  {
    id: 'convert-to-jpg',
    name: 'Convert to JPG',
    route: '/convert-to-jpg',
    category: 'convert',
    description: 'Turn PNG, GIF, TIF, PSD, SVG, WEBP, or HEIC images to high-quality JPG format in seconds.',
    shortDescription: 'Convert PNG, WEBP, HEIC to JPG',
    iconName: 'FileImage',
    seoTitle: 'Convert PNG, WEBP, HEIC to JPG Online Free',
    seoDescription: 'Convert any image format to high quality JPG instantly.',
    keywords: ['convert to jpg', 'png to jpg converter']
  },
  {
    id: 'convert-from-jpg',
    name: 'Convert from JPG',
    route: '/jpg-to-image',
    category: 'convert',
    description: 'Turn JPG images into transparent PNG, optimized WEBP, or animated GIF in seconds.',
    shortDescription: 'Convert JPG to PNG, WEBP, or GIF',
    iconName: 'Repeat',
    seoTitle: 'Convert JPG to PNG, WEBP & GIF Online Free',
    seoDescription: 'Convert JPG photos to transparent PNG, WEBP, or animated GIF.',
    keywords: ['jpg to png converter', 'convert jpg to webp']
  },
  {
    id: 'photo-editor',
    name: 'Photo Editor',
    route: '/photo-editor',
    category: 'create',
    description: 'Spice up pictures with filters, text overlay, crop, brightness, contrast, and stickers.',
    shortDescription: 'Filters, text overlay, crop & adjust',
    badge: 'Popular',
    iconName: 'Wand2',
    seoTitle: 'Free Online Photo Editor - Edit Photos with Filters & Text',
    seoDescription: 'Edit your photos online for free. Adjust brightness, filters, and text.',
    keywords: ['online photo editor free', 'photo filter maker']
  },
  {
    id: 'upscale-image',
    name: 'Upscale Image',
    route: '/upscale-image',
    category: 'optimize',
    description: 'Enlarge low resolution photos with bicubic interpolation. Increase image size 2x or 4x with clarity.',
    shortDescription: 'Enlarge image size 2x/4x with clarity',
    badge: 'New',
    iconName: 'Sparkles',
    seoTitle: 'Upscale Image Online Free - Enlarge Photos 2x 4x',
    seoDescription: 'Upscale images online for free with bicubic sharpening interpolation.',
    keywords: ['upscale image online', 'enlarge photo 4k']
  },
  {
    id: 'remove-background',
    name: 'Remove Background',
    route: '/remove-background',
    category: 'optimize',
    description: 'Quickly remove image backgrounds with high accuracy. Detect subjects and cut out transparent PNGs.',
    shortDescription: 'Make background transparent or solid',
    badge: 'New',
    iconName: 'Eraser',
    seoTitle: 'Free Background Remover - Remove Image Background Online',
    seoDescription: 'Remove background from image online for free.',
    keywords: ['remove background from image', 'transparent background maker']
  },
  {
    id: 'watermark-image',
    name: 'Watermark IMAGE',
    route: '/watermark-image',
    category: 'security',
    description: 'Stamp text or logo watermarks over your photos in seconds with custom opacity, rotation, and font.',
    shortDescription: 'Add text or logo watermark with opacity',
    iconName: 'Shield',
    seoTitle: 'Watermark Image Online Free - Add Text & Logo to Photos',
    seoDescription: 'Watermark photos online for free to protect copyright.',
    keywords: ['watermark image online', 'add watermark to photo']
  },
  {
    id: 'meme-generator',
    name: 'Meme Generator',
    route: '/meme-generator',
    category: 'create',
    description: 'Create funny memes online with ease. Caption classic meme templates or upload your own pictures.',
    shortDescription: 'Add top/bottom text to classic memes',
    badge: 'Fun',
    iconName: 'Smile',
    seoTitle: 'Free Online Meme Generator - Custom Meme Maker with Text',
    seoDescription: 'Create custom memes online for free.',
    keywords: ['meme generator free', 'make meme online']
  },
  {
    id: 'rotate-image',
    name: 'Rotate IMAGE',
    route: '/rotate-image',
    category: 'edit',
    description: 'Rotate images 90° clockwise, counter-clockwise, or flip horizontally and vertically in browser.',
    shortDescription: 'Rotate 90°, 180° or flip images',
    iconName: 'RotateCw',
    seoTitle: 'Rotate Image Online Free - Rotate JPG, PNG, GIF',
    seoDescription: 'Rotate images online for free with 100% privacy.',
    keywords: ['rotate image online', 'rotate photo 90 degrees']
  },
  {
    id: 'blur-face',
    name: 'Blur Face',
    route: '/blur-face',
    category: 'security',
    description: 'Easily blur out faces, license plates, and sensitive areas in photos to protect privacy.',
    shortDescription: 'Censor sensitive info & blur faces',
    badge: 'New',
    iconName: 'EyeOff',
    seoTitle: 'Blur Face in Photo Online Free - Censor Sensitive Image Data',
    seoDescription: 'Blur faces and private information in photos online.',
    keywords: ['blur face photo online', 'censor image free']
  },
  {
    id: 'pdf-compressor',
    name: 'Compress PDF',
    route: '/pdf-compressor',
    category: 'pdf',
    description: 'Reduce PDF document file size for online form uploads entirely in your browser without quality loss.',
    shortDescription: 'Reduce PDF size for certificates & IDs',
    badge: 'PDF',
    iconName: 'FileText',
    seoTitle: 'Compress PDF Online - Reduce PDF File Size in KB',
    seoDescription: 'Reduce PDF document file size for online form uploads in browser.',
    keywords: ['pdf compressor', 'reduce pdf size']
  },
  {
    id: 'sign-pdf',
    name: 'Fill & Sign PDF',
    route: '/pdf-tools/sign',
    category: 'pdf',
    description: 'Sign PDF documents online with valid electronic signature. Draw, upload or type your signature safely.',
    shortDescription: 'Draw, type or upload e-signature to PDF',
    badge: 'eSign',
    iconName: 'PenTool',
    seoTitle: 'Sign PDF Online Free - Add Signature to PDF Document',
    seoDescription: 'Fill and sign PDF documents online with 100% legal validity.',
    keywords: ['sign pdf online free', 'esign pdf document']
  }
];

export const TOOL_CATEGORIES = [
  { id: 'all', label: 'All Tools' },
  { id: 'exam', label: 'Online Exam Resizers' },
  { id: 'optimize', label: 'Compress & Resize' },
  { id: 'edit', label: 'Crop & Edit' },
  { id: 'convert', label: 'Convert' },
  { id: 'pdf', label: 'PDF & e-Sign' },
  { id: 'security', label: 'Security & Blur' }
];
