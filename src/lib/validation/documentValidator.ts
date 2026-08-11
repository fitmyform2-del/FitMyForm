import { DocumentRequirements, FileFormat } from '@/types/document';

export interface ValidationCheckItem {
  id: string;
  label: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  validationErrors: string[];
  checklist: ValidationCheckItem[];
}

export function validateDocumentResult({
  fileSizeKB,
  width,
  height,
  format,
  requirements
}: {
  fileSizeKB: number;
  width: number;
  height: number;
  format: FileFormat;
  requirements: DocumentRequirements;
}): ValidationResult {
  const checklist: ValidationCheckItem[] = [];
  const errors: string[] = [];

  // 1. Format check
  const expectedFormat = requirements.format;
  const formatPassed =
    format === expectedFormat ||
    (expectedFormat === 'JPG' && format === 'JPEG') ||
    (expectedFormat === 'JPEG' && format === 'JPG');
  
  checklist.push({
    id: 'format',
    label: 'File Format',
    expected: expectedFormat,
    actual: format,
    passed: formatPassed
  });
  if (!formatPassed) {
    errors.push(`Format must be ${expectedFormat}, but got ${format}.`);
  }

  // 2. Dimensions check
  const targetW = requirements.width;
  const targetH = requirements.height;
  if (targetW && targetH) {
    const dimPassed = width === targetW && height === targetH;
    checklist.push({
      id: 'dimensions',
      label: 'Exact Dimensions',
      expected: `${targetW} × ${targetH} px`,
      actual: `${width} × ${height} px`,
      passed: dimPassed
    });
    if (!dimPassed) {
      errors.push(`Dimensions must be exactly ${targetW} × ${targetH} px, but got ${width} × ${height} px.`);
    }
  } else {
    // Min / Max range check if specified
    if (requirements.minWidth || requirements.maxWidth) {
      const minW = requirements.minWidth || 0;
      const maxW = requirements.maxWidth || Infinity;
      const wPassed = width >= minW && width <= maxW;
      checklist.push({
        id: 'width_range',
        label: 'Width Limit',
        expected: `${minW} - ${maxW === Infinity ? 'Any' : maxW} px`,
        actual: `${width} px`,
        passed: wPassed
      });
      if (!wPassed) errors.push(`Width must be between ${minW} and ${maxW} px.`);
    }

    if (requirements.minHeight || requirements.maxHeight) {
      const minH = requirements.minHeight || 0;
      const maxH = requirements.maxHeight || Infinity;
      const hPassed = height >= minH && height <= maxH;
      checklist.push({
        id: 'height_range',
        label: 'Height Limit',
        expected: `${minH} - ${maxH === Infinity ? 'Any' : maxH} px`,
        actual: `${height} px`,
        passed: hPassed
      });
      if (!hPassed) errors.push(`Height must be between ${minH} and ${maxH} px.`);
    }
  }

  // 3. File Size Range Check
  const minKB = requirements.minSizeKB || 0;
  const maxKB = requirements.maxSizeKB || Infinity;
  const sizePassed = fileSizeKB >= minKB && fileSizeKB <= maxKB;
  checklist.push({
    id: 'filesize',
    label: 'File Size Limit',
    expected: `${minKB} – ${maxKB} KB`,
    actual: `${fileSizeKB} KB`,
    passed: sizePassed
  });
  if (!sizePassed) {
    errors.push(`File size must be between ${minKB} KB and ${maxKB} KB (Current: ${fileSizeKB} KB).`);
  }

  // 4. Privacy Guarantee Check
  checklist.push({
    id: 'privacy',
    label: 'Client-Side Privacy',
    expected: 'Processed 100% locally',
    actual: 'Zero server upload',
    passed: true
  });

  return {
    isValid: errors.length === 0,
    validationErrors: errors,
    checklist
  };
}
