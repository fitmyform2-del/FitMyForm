export interface ImageToolConfig {
  id: string;
  name: string;
  route: string;
  category: 'optimize' | 'create' | 'edit' | 'convert' | 'security';
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
    id: 'compress-image',
    name: 'Compress IMAGE',
    route: '/image-compressor',
    category: 'optimize',
    description: 'Compress JPG, PNG, SVG, WEBP, and GIFs while saving space and maintaining quality.',
    shortDescription: 'Reduce file size without quality loss',
    badge: 'Popular',
    iconName: 'Minimize2',
    seoTitle: 'Free Online Image Compressor - Reduce JPG, PNG, WEBP File Size',
    seoDescription: 'Compress images online without losing quality. Reduce file size of JPG, PNG, WEBP, and SVG images with fast client-side privacy.',
    keywords: [
      'compress image online',
      'reduce image size in kb',
      'compress jpg free',
      'png compressor',
      'webp size reducer',
      'image compression tool'
    ]
  },
  {
    id: 'resize-image',
    name: 'Resize IMAGE',
    route: '/photo-resizer',
    category: 'edit',
    description: 'Define your dimensions by percent or pixel and resize your JPG, PNG, SVG, and GIF images.',
    shortDescription: 'Change width and height in px or %',
    iconName: 'Maximize2',
    seoTitle: 'Online Image Resizer - Resize Photo Dimensions in Pixels or Percent',
    seoDescription: 'Resize JPG, PNG, SVG, and WEBP images by custom pixel dimensions or percentages. Free client-side image resizer for web & forms.',
    keywords: [
      'resize image online',
      'image resizer pixels',
      'resize photo by percentage',
      'change image resolution',
      'photo size editor'
    ]
  },
  {
    id: 'crop-image',
    name: 'Crop IMAGE',
    route: '/crop-image',
    category: 'edit',
    description: 'Crop JPG, PNG, or GIFs with ease; choose pixels to define your rectangle or use our visual cropper.',
    shortDescription: 'Trim photo margins & aspect ratios',
    iconName: 'Crop',
    seoTitle: 'Free Online Image Cropper - Crop JPG, PNG, GIF with Visual Selector',
    seoDescription: 'Crop images online for free. Select square 1:1, 16:9, 4:3 aspect ratios or crop custom pixel dimensions visually in browser.',
    keywords: [
      'crop image online',
      'crop photo free',
      'visual image cropper',
      'crop png online',
      'aspect ratio cropper'
    ]
  },
  {
    id: 'convert-to-jpg',
    name: 'Convert to JPG',
    route: '/convert-to-jpg',
    category: 'convert',
    description: 'Turn PNG, GIF, TIF, PSD, SVG, WEBP, HEIC, or RAW format images to JPG in bulk with ease.',
    shortDescription: 'Convert PNG, WEBP, GIF, HEIC to JPG',
    iconName: 'FileImage',
    seoTitle: 'Convert PNG, WEBP, HEIC, GIF to JPG Online Free',
    seoDescription: 'Convert any image format to high quality JPG. Bulk convert PNG, WEBP, GIF, SVG, and HEIC files to JPG format instantly.',
    keywords: [
      'convert to jpg',
      'png to jpg converter',
      'webp to jpg online',
      'heic to jpg converter',
      'convert image to jpeg'
    ]
  },
  {
    id: 'convert-from-jpg',
    name: 'Convert from JPG',
    route: '/jpg-to-image',
    category: 'convert',
    description: 'Turn JPG images to PNG, WEBP, and GIF. Choose several JPGs to create an animated GIF in seconds!',
    shortDescription: 'Convert JPG to PNG, WEBP, or GIF',
    iconName: 'Repeat',
    seoTitle: 'Convert JPG to PNG, WEBP & GIF Online Free',
    seoDescription: 'Convert JPG photos to transparent PNG, optimized WEBP, or animated GIF format. Fast browser processing with zero upload delay.',
    keywords: [
      'jpg to png converter',
      'convert jpg to webp',
      'jpg to gif maker',
      'convert jpeg to png online'
    ]
  },
  {
    id: 'photo-editor',
    name: 'Photo Editor',
    route: '/photo-editor',
    category: 'create',
    description: 'Spice up your pictures with filters, text, crop, brightness, contrast, stickers, and simple editing tools.',
    shortDescription: 'Filters, text overlay, crop & adjust',
    badge: 'Popular',
    iconName: 'Wand2',
    seoTitle: 'Free Online Photo Editor - Edit Photos with Filters, Text & FX',
    seoDescription: 'Edit your photos online for free. Adjust brightness, contrast, hue, apply retro & vintage filters, add custom text and stickers.',
    keywords: [
      'online photo editor free',
      'photo filter maker',
      'add text to photo online',
      'edit pictures in browser',
      'free image editor'
    ]
  },
  {
    id: 'upscale-image',
    name: 'Upscale Image',
    route: '/upscale-image',
    category: 'optimize',
    description: 'Enlarge your images with high resolution. Easily increase the size of your JPG and PNG images 2x or 4x.',
    shortDescription: 'Enlarge image size 2x/4x with clarity',
    badge: 'New',
    iconName: 'Sparkles',
    seoTitle: 'Upscale Image Online Free - Enlarge Photos 2x 4x High Resolution',
    seoDescription: 'Upscale images online for free. Increase image resolution 2x or 4x with bicubic sharpening interpolation without losing clarity.',
    keywords: [
      'upscale image online',
      'enlarge photo 4k',
      'image upscaler free',
      'increase image resolution',
      'photo sharpener'
    ]
  },
  {
    id: 'remove-background',
    name: 'Remove Background',
    route: '/remove-background',
    category: 'optimize',
    description: 'Quickly remove image backgrounds with high accuracy. Instantly detect objects and cut out transparent PNGs.',
    shortDescription: 'Make background transparent or solid',
    badge: 'New',
    iconName: 'Eraser',
    seoTitle: 'Free Background Remover - Remove Image Background Online',
    seoDescription: 'Remove background from image online for free. Cut out subject and make background transparent PNG or solid color in browser.',
    keywords: [
      'remove background from image',
      'transparent background maker',
      'bg remover online',
      'image cutout tool free'
    ]
  },
  {
    id: 'watermark-image',
    name: 'Watermark IMAGE',
    route: '/watermark-image',
    category: 'security',
    description: 'Stamp an image or text over your photos in seconds. Choose typography, opacity, rotation, and tile positions.',
    shortDescription: 'Add text or logo watermark with opacity',
    iconName: 'Shield',
    seoTitle: 'Watermark Image Online Free - Add Text & Logo to Photos',
    seoDescription: 'Watermark photos online for free. Protect copyright by adding custom text, PNG logos, opacity, font styling, and tiled watermarks.',
    keywords: [
      'watermark image online',
      'add watermark to photo',
      'logo watermark maker',
      'protect photo copyright'
    ]
  },
  {
    id: 'meme-generator',
    name: 'Meme Generator',
    route: '/meme-generator',
    category: 'create',
    description: 'Create your memes online with ease. Caption meme images or upload your pictures to make custom memes.',
    shortDescription: 'Add top/bottom text to classic memes',
    badge: 'Fun',
    iconName: 'Smile',
    seoTitle: 'Free Online Meme Generator - Custom Meme Maker with Text',
    seoDescription: 'Create custom memes online for free. Choose popular classic meme templates or upload your own photo with custom Impact text.',
    keywords: [
      'meme generator free',
      'make meme online',
      'custom meme maker',
      'caption photo meme'
    ]
  },
  {
    id: 'rotate-image',
    name: 'Rotate IMAGE',
    route: '/rotate-image',
    category: 'edit',
    description: 'Rotate many images JPG, PNG, or GIF at the same time clockwise, counter-clockwise, or flip horizontally.',
    shortDescription: 'Rotate 90°, 180° or flip images',
    iconName: 'RotateCw',
    seoTitle: 'Rotate Image Online Free - Rotate JPG, PNG, GIF 90 Degrees',
    seoDescription: 'Rotate images online for free. Rotate JPG, PNG, and WEBP photos 90° clockwise, counter-clockwise, or flip horizontally & vertically.',
    keywords: [
      'rotate image online',
      'rotate photo 90 degrees',
      'flip image horizontal vertical',
      'batch image rotator'
    ]
  },
  {
    id: 'html-to-image',
    name: 'HTML to IMAGE',
    route: '/html-to-image',
    category: 'convert',
    description: 'Convert web HTML code snippets or custom layouts directly to PNG or JPG images with custom rendering.',
    shortDescription: 'Render HTML/CSS snippets to image',
    iconName: 'Code',
    seoTitle: 'HTML to Image Converter - Render HTML CSS Snippet to PNG JPG',
    seoDescription: 'Convert HTML code and CSS styling into high quality PNG or JPG images online. Ideal for code snippets, cards, and web graphics.',
    keywords: [
      'html to image converter',
      'render html to png',
      'html to jpg online',
      'code snippet image generator'
    ]
  },
  {
    id: 'blur-face',
    name: 'Blur Face / Region',
    route: '/blur-face',
    category: 'security',
    description: 'Easily blur out faces, license plates, text, and sensitive areas in photos with pixelation or gaussian blur.',
    shortDescription: 'Censor sensitive info & blur faces',
    badge: 'New',
    iconName: 'EyeOff',
    seoTitle: 'Blur Face in Photo Online Free - Censor Sensitive Image Data',
    seoDescription: 'Blur faces and private information in photos online. Draw blur boxes or pixelate sensitive text, license plates, and documents securely.',
    keywords: [
      'blur face photo online',
      'censor image free',
      'pixelate photo region',
      'blur sensitive info photo'
    ]
  }
];

export const TOOL_CATEGORIES = [
  { id: 'all', label: 'All Tools' },
  { id: 'optimize', label: 'Optimize' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit & Modify' },
  { id: 'convert', label: 'Convert' },
  { id: 'security', label: 'Security & Blur' }
];
