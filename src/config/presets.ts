import { ExamPreset } from '@/types/presets';
import { NATIONAL_EXAM_PRESETS } from './presets/nationalPresets';
import { STATE_AND_OTHER_PRESETS } from './presets/stateAndOtherPresets';

export const EXAM_PRESETS: ExamPreset[] = [
  ...NATIONAL_EXAM_PRESETS,
  ...STATE_AND_OTHER_PRESETS
];

export * from './presets/labels';
