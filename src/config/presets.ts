import type { ExamPreset } from '@/types/presets';
import { NATIONAL_EXAM_PRESETS } from './presets/nationalPresets';
import { ADMISSION_EXAM_PRESETS } from './presets/admissionPresets';
import { BANKING_EXAM_PRESETS } from './presets/bankingPresets';
import { TEACHING_EXAM_PRESETS } from './presets/teachingPresets';
import { STATE_EXAM_PRESETS } from './presets/statePresets';
import { STATE_AND_OTHER_PRESETS } from './presets/stateAndOtherPresets';

export const EXAM_PRESETS: ExamPreset[] = [
  ...NATIONAL_EXAM_PRESETS,
  ...ADMISSION_EXAM_PRESETS,
  ...BANKING_EXAM_PRESETS,
  ...TEACHING_EXAM_PRESETS,
  ...STATE_EXAM_PRESETS,
  ...STATE_AND_OTHER_PRESETS
];

export * from './presets/labels';
