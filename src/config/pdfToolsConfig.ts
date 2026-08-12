export interface PdfToolMeta {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  route: string;
  iconName: string;
  category: 'merge-split' | 'compress-edit' | 'convert' | 'security-sign';
  badge?: string;
  popular?: boolean;
}

export const PDF_TOOLS: PdfToolMeta[] = [
  {
    id: 'merge',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDFs into a single document in your desired page order.',
    longDescription: 'Merge multiple PDF documents into one seamlessly. Drag and drop to reorder files before combining.',
    route: '/pdf-tools/merge',
    iconName: 'GitMerge',
    category: 'merge-split',
    badge: 'Popular',
    popular: true
  },
  {
    id: 'split',
    name: 'Split PDF',
    shortDescription: 'Separate one PDF into multiple files or extract selected page ranges.',
    longDescription: 'Split a PDF document into individual pages or extract custom page ranges (e.g., 1-5, 8-10) with exact precision.',
    route: '/pdf-tools/split',
    iconName: 'Scissors',
    category: 'merge-split',
    popular: true
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    shortDescription: 'Reduce PDF file size while maintaining optimal document quality.',
    longDescription: 'Intelligently compress PDF documents to meet strict file size limits for online job applications, university forms, and portals.',
    route: '/pdf-tools/compress',
    iconName: 'Minimize2',
    category: 'compress-edit',
    badge: 'Popular',
    popular: true
  },
  {
    id: 'organize',
    name: 'Organize PDF',
    shortDescription: 'Reorder, delete, or rotate pages in your PDF document visually.',
    longDescription: 'Sort, delete unwanted pages, rotate orientation, and re-arrange pages of your PDF with an interactive visual page grid.',
    route: '/pdf-tools/organize',
    iconName: 'LayoutGrid',
    category: 'merge-split'
  },
  {
    id: 'rotate',
    name: 'Rotate PDF',
    shortDescription: 'Rotate PDF pages clockwise or counter-clockwise as needed.',
    longDescription: 'Rotate specific pages or all pages in your PDF document by 90°, 180°, or 270° in seconds.',
    route: '/pdf-tools/rotate',
    iconName: 'RotateCw',
    category: 'merge-split'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    shortDescription: 'Convert JPG, PNG, WEBP images into a formatted PDF document.',
    longDescription: 'Transform photos and scanned document images into clean PDF files. Custom layout, page size (A4, Letter), orientation, and margins.',
    route: '/pdf-tools/jpg-to-pdf',
    iconName: 'FileImage',
    category: 'convert',
    popular: true
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    shortDescription: 'Extract embedded images or convert PDF pages into high-resolution JPG files.',
    longDescription: 'Convert every page of a PDF file into high-quality JPG images or extract all images embedded inside the PDF.',
    route: '/pdf-tools/pdf-to-jpg',
    iconName: 'Image',
    category: 'convert',
    popular: true
  },
  {
    id: 'sign',
    name: 'Sign PDF',
    shortDescription: 'Draw, type, or upload your signature and stamp it onto PDF pages.',
    longDescription: 'Fill & sign PDFs securely in your browser. Draw your signature, type with handwritten styles, or upload signature photos.',
    route: '/pdf-tools/sign',
    iconName: 'PenTool',
    category: 'security-sign',
    badge: 'New',
    popular: true
  },
  {
    id: 'watermark',
    name: 'Watermark PDF',
    shortDescription: 'Add text or logo image watermarks over your PDF pages.',
    longDescription: 'Protect your identity and copyright by stamping text or logo watermarks with custom positioning, opacity, font size, and rotation.',
    route: '/pdf-tools/watermark',
    iconName: 'Stamp',
    category: 'compress-edit'
  },
  {
    id: 'page-numbers',
    name: 'Page Numbers',
    shortDescription: 'Add page numbers to your PDF with custom position and styling.',
    longDescription: 'Insert page numbering into your PDF document headers or footers with customizable formats, positioning, margins, and font styles.',
    route: '/pdf-tools/page-numbers',
    iconName: 'Hash',
    category: 'compress-edit'
  },
  {
    id: 'protect',
    name: 'Protect PDF',
    shortDescription: 'Encrypt your PDF files with user and owner passwords.',
    longDescription: 'Secure confidential PDF documents by setting encryption and password protection to prevent unauthorized opening or editing.',
    route: '/pdf-tools/protect',
    iconName: 'Lock',
    category: 'security-sign'
  },
  {
    id: 'unlock',
    name: 'Unlock PDF',
    shortDescription: 'Remove password protection and security restrictions from your PDF.',
    longDescription: 'Unlock encrypted PDF files by entering the password to produce a standard, password-free PDF document.',
    route: '/pdf-tools/unlock',
    iconName: 'Unlock',
    category: 'security-sign'
  },
  {
    id: 'edit',
    name: 'Edit PDF',
    shortDescription: 'Add text annotations, shapes, drawings, and images directly onto PDF pages.',
    longDescription: 'Annotate and edit PDF pages directly inside your browser. Place text boxes, draw freehand lines, add rectangles, arrows, and shapes.',
    route: '/pdf-tools/edit',
    iconName: 'FileText',
    category: 'compress-edit'
  },
  {
    id: 'redact',
    name: 'Redact PDF',
    shortDescription: 'Permanently black out sensitive numbers, signatures, and private text.',
    longDescription: 'Sanitize confidential information from PDF documents by drawing permanent, irreversible black redaction boxes over sensitive areas.',
    route: '/pdf-tools/redact',
    iconName: 'EyeOff',
    category: 'security-sign',
    badge: 'Privacy'
  },
  {
    id: 'compare',
    name: 'Compare PDF',
    shortDescription: 'Compare two PDF documents side-by-side to highlight visual changes.',
    longDescription: 'Visually compare two revisions of a PDF document side-by-side to easily catch deleted, modified, or added content.',
    route: '/pdf-tools/compare',
    iconName: 'Columns',
    category: 'compress-edit'
  },
  {
    id: 'scan',
    name: 'Scan to PDF',
    shortDescription: 'Capture documents from your camera/webcam and convert directly to PDF.',
    longDescription: 'Use your phone or laptop camera to scan physical documents, apply high-contrast scan filters, and generate a clean PDF.',
    route: '/pdf-tools/scan',
    iconName: 'Camera',
    category: 'convert'
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    shortDescription: 'Extract readable text and copyable contents from PDF pages.',
    longDescription: 'Extract clean text from PDF files for editing, copying, or saving as plain text (.txt) and Markdown documents.',
    route: '/pdf-tools/pdf-to-text',
    iconName: 'FileCode',
    category: 'convert'
  },
  {
    id: 'html-to-pdf',
    name: 'HTML / Text to PDF',
    shortDescription: 'Convert styled HTML text or markdown documents into formatted PDFs.',
    longDescription: 'Paste formatted HTML or plain text content to generate print-ready, beautifully styled PDF documents instantly.',
    route: '/pdf-tools/html-to-pdf',
    iconName: 'Code',
    category: 'convert'
  }
];
