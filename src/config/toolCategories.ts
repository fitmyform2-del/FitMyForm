export interface ToolCategory {
  id: string;
  label: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: 'all', label: 'All Tools' },
  { id: 'exam', label: 'Online Exam Resizers' },
  { id: 'create', label: 'Creative & Studio' },
  { id: 'optimize', label: 'Compress & Resize' },
  { id: 'edit', label: 'Crop & Edit' },
  { id: 'convert', label: 'Convert' },
  { id: 'pdf', label: 'PDF & e-Sign' },
  { id: 'security', label: 'Security & Blur' }
];
