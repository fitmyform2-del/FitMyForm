import { MemeTemplate } from './memeTypes';
import {
  createDrakeTemplate,
  createSideBySideTemplate,
  createTopBottomTemplate,
  createFourGridTemplate,
  createTwoButtonsTemplate,
  createBreakingNewsTemplate
} from './templateDrawers';

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Dislike / Like',
    description: 'Iconic 2-panel reaction: add photos or captions to top & bottom right boxes.',
    category: 'popular',
    defaultTopText: 'MANUALLY EDITING EXAM PHOTO',
    defaultBottomText: 'FITMYFORM 1-CLICK INSTANT RESIZE',
    viralCaptions: [
      { top: 'MANUALLY EDITING EXAM PHOTO', bottom: 'FITMYFORM 1-CLICK INSTANT RESIZE' },
      { top: 'WRITING 500 LINES OF BOILERPLATE', bottom: 'USING 1 CLEAN REUSABLE HOOK' },
      { top: 'GOING TO SLEEP AT 10:00 PM', bottom: 'WATCHING WIKIPEDIA RABBIT HOLE TILL 3 AM' },
      { top: 'READING 80-PAGE USER MANUAL', bottom: 'CLICKING BUTTONS UNTIL IT WORKS' }
    ],
    slots: [
      { id: 'drake-top', name: 'Top Box (Dislike Panel)', description: 'Rejected photo or caption', xPercent: 50, yPercent: 0, widthPercent: 50, heightPercent: 50 },
      { id: 'drake-bottom', name: 'Bottom Box (Like Panel)', description: 'Approved photo or caption', xPercent: 50, yPercent: 50, widthPercent: 50, heightPercent: 50 }
    ],
    defaultTexts: [
      { id: '1', text: 'MANUALLY EDITING EXAM PHOTO', xPercent: 75, yPercent: 25, fontSizeRatio: 0.055, color: '#000000', strokeColor: 'transparent', align: 'center' },
      { id: '2', text: 'FITMYFORM 1-CLICK INSTANT RESIZE', xPercent: 75, yPercent: 75, fontSizeRatio: 0.055, color: '#000000', strokeColor: 'transparent', align: 'center' }
    ],
    createDataUrl: createDrakeTemplate
  },
  {
    id: 'side-by-side',
    name: 'Side-by-Side (2 Photos)',
    description: 'Horizontal comparison: Left photo vs Right photo (Expectation vs Reality).',
    category: 'two-panel',
    defaultTopText: 'EXPECTATION',
    defaultBottomText: 'REALITY',
    viralCaptions: [
      { top: 'EXPECTATION', bottom: 'REALITY' },
      { top: 'HOW I THINK I LOOK', bottom: 'HOW I ACTUALLY LOOK' },
      { top: 'FIRST RESIZE ATTEMPT', bottom: 'FITMYFORM 1-CLICK EXAM RESIZE' },
      { top: 'MONDAY MORNING 9 AM', bottom: 'FRIDAY AFTERNOON 5 PM' }
    ],
    slots: [
      { id: 'sbs-left', name: 'Left Image (Expectation)', description: 'Left panel photo', xPercent: 0, yPercent: 0, widthPercent: 50, heightPercent: 100 },
      { id: 'sbs-right', name: 'Right Image (Reality)', description: 'Right panel photo', xPercent: 50, yPercent: 0, widthPercent: 50, heightPercent: 100 }
    ],
    defaultTexts: [
      { id: '1', text: 'EXPECTATION', xPercent: 25, yPercent: 12, fontSizeRatio: 0.06, color: '#FFFFFF', strokeColor: '#000000', strokeWidth: 4, align: 'center' },
      { id: '2', text: 'REALITY', xPercent: 75, yPercent: 12, fontSizeRatio: 0.06, color: '#FFFFFF', strokeColor: '#000000', strokeWidth: 4, align: 'center' }
    ],
    createDataUrl: createSideBySideTemplate
  },
  {
    id: 'top-bottom',
    name: 'Top / Bottom (2 Photos)',
    description: 'Vertical stacked comparison: How it started vs How it is going.',
    category: 'two-panel',
    defaultTopText: 'HOW IT STARTED',
    defaultBottomText: 'HOW IT IS GOING',
    viralCaptions: [
      { top: 'HOW IT STARTED', bottom: 'HOW IT IS GOING' },
      { top: 'BEFORE COFFEE IN THE MORNING', bottom: 'AFTER FIRST SIP OF ESPRESSO' },
      { top: 'STARTING NEW PROJECT WITH ENERGY', bottom: 'DEBUGGING CSS 4 DAYS LATER' }
    ],
    slots: [
      { id: 'tb-top', name: 'Top Image', description: 'Top panel photo', xPercent: 0, yPercent: 0, widthPercent: 100, heightPercent: 50 },
      { id: 'tb-bottom', name: 'Bottom Image', description: 'Bottom panel photo', xPercent: 0, yPercent: 50, widthPercent: 100, heightPercent: 50 }
    ],
    defaultTexts: [
      { id: '1', text: 'HOW IT STARTED', xPercent: 50, yPercent: 10, fontSizeRatio: 0.06, color: '#FFFFFF', strokeColor: '#000000', strokeWidth: 4, align: 'center' },
      { id: '2', text: 'HOW IT IS GOING', xPercent: 50, yPercent: 60, fontSizeRatio: 0.06, color: '#FFFFFF', strokeColor: '#000000', strokeWidth: 4, align: 'center' }
    ],
    createDataUrl: createTopBottomTemplate
  },
  {
    id: 'four-grid',
    name: '4-Panel Comic Grid',
    description: '2x2 grid layout: add 4 different photos or story sequence.',
    category: 'popular',
    defaultTopText: 'STAGE 1: HOPEFUL',
    defaultBottomText: 'STAGE 4: DEPLOYED',
    viralCaptions: [
      { top: 'STAGE 1: HOPEFUL', bottom: 'STAGE 4: DEPLOYED' },
      { top: 'THE 4 MOODS OF CODING', bottom: 'IT WAS A TYPO ALL ALONG' }
    ],
    slots: [
      { id: 'grid-1', name: 'Panel 1 (Top Left)', description: '1st photo', xPercent: 0, yPercent: 0, widthPercent: 50, heightPercent: 50 },
      { id: 'grid-2', name: 'Panel 2 (Top Right)', description: '2nd photo', xPercent: 50, yPercent: 0, widthPercent: 50, heightPercent: 50 },
      { id: 'grid-3', name: 'Panel 3 (Bottom Left)', description: '3rd photo', xPercent: 0, yPercent: 50, widthPercent: 50, heightPercent: 50 },
      { id: 'grid-4', name: 'Panel 4 (Bottom Right)', description: '4th photo', xPercent: 50, yPercent: 50, widthPercent: 50, heightPercent: 50 }
    ],
    defaultTexts: [
      { id: '1', text: 'STAGE 1: HOPEFUL', xPercent: 25, yPercent: 10, fontSizeRatio: 0.05, color: '#FFFFFF', strokeColor: '#000000', strokeWidth: 3, align: 'center' },
      { id: '2', text: 'STAGE 4: DEPLOYED', xPercent: 75, yPercent: 60, fontSizeRatio: 0.05, color: '#FFFFFF', strokeColor: '#000000', strokeWidth: 3, align: 'center' }
    ],
    createDataUrl: createFourGridTemplate
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons Sweat',
    description: 'Tough dilemma: place images or labels on the two red buttons.',
    category: 'popular',
    defaultTopText: 'GO TO SLEEP EARLY',
    defaultBottomText: 'WATCH CAT VIDEOS UNTIL 4AM',
    viralCaptions: [
      { top: 'GO TO SLEEP EARLY', bottom: 'WATCH CAT VIDEOS UNTIL 4AM' },
      { top: 'FIX THE KNOWN CRITICAL BUG', bottom: 'ADD 10 NEW UNTESTED FEATURES' },
      { top: 'STUDY FOR TOMORROW TEST', bottom: 'DEEP CLEAN ENTIRE APARTMENT FIRST' }
    ],
    slots: [
      { id: 'btn-left', name: 'Button 1 Option', description: 'Left button choice', xPercent: 14, yPercent: 18, widthPercent: 33, heightPercent: 24 },
      { id: 'btn-right', name: 'Button 2 Option', description: 'Right button choice', xPercent: 53, yPercent: 18, widthPercent: 33, heightPercent: 24 }
    ],
    defaultTexts: [
      { id: '1', text: 'GO TO SLEEP EARLY', xPercent: 30, yPercent: 30, fontSizeRatio: 0.045, color: '#FFFFFF', strokeColor: '#000000', align: 'center' },
      { id: '2', text: 'WATCH CAT VIDEOS UNTIL 4AM', xPercent: 70, yPercent: 30, fontSizeRatio: 0.045, color: '#FFFFFF', strokeColor: '#000000', align: 'center' }
    ],
    createDataUrl: createTwoButtonsTemplate
  },
  {
    id: 'breaking-news',
    name: 'Breaking News TV',
    description: 'Broadcast screen: add your photo into the main news screen.',
    category: 'news',
    defaultTopText: 'BREAKING: LOCAL DEVELOPER',
    defaultBottomText: 'FIXES BUG BY REMOVING ENTIRE FEATURE',
    viralCaptions: [
      { top: 'BREAKING: LOCAL DEVELOPER', bottom: 'FIXES BUG BY REMOVING ENTIRE FEATURE' },
      { top: 'URGENT: STUDENT EXAM PHOTO', bottom: 'APPROVED INSTANTLY ON FIRST TRY' },
      { top: 'SCIENTISTS FINALLY DISCOVER', bottom: '20-MIN NAP ACTUALLY LASTED 4 HOURS' }
    ],
    slots: [
      { id: 'news-anchor', name: 'Main Screen Frame', description: 'TV studio photo', xPercent: 5, yPercent: 8, widthPercent: 90, heightPercent: 60 }
    ],
    defaultTexts: [
      { id: '1', text: 'BREAKING: LOCAL DEVELOPER', xPercent: 50, yPercent: 74, fontSizeRatio: 0.048, color: '#FFFFFF', strokeColor: '#000000', align: 'center' },
      { id: '2', text: 'FIXES BUG BY REMOVING ENTIRE FEATURE', xPercent: 50, yPercent: 88, fontSizeRatio: 0.04, color: '#FACC15', strokeColor: '#000000', align: 'center' }
    ],
    createDataUrl: createBreakingNewsTemplate
  }
];
