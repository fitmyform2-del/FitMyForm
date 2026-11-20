import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toPixels, fromPixels, formatDimensionDisplay } from '@/lib/utils/unitConverter';
import { EXAM_PRESETS } from '@/config/presets';
import { PASSPORT_SHEET_SPECS } from '@/lib/image/tools/passportSheet';
import { applyWhiteBackground } from '@/lib/image/tools/whiteBgTools';

describe('unitConverter', () => {
  it('converts cm, mm, and inches accurately to pixels at 200 and 300 DPI', () => {
    // 3.5 cm at 200 DPI = 275.59 -> 276 px
    assert.equal(toPixels(3.5, 'cm', 200), 276);
    // 4.5 cm at 200 DPI = 354.33 -> 354 px
    assert.equal(toPixels(4.5, 'cm', 200), 354);
    // 35 mm at 200 DPI == 3.5 cm
    assert.equal(toPixels(35, 'mm', 200), 276);
    // 2 inches at 300 DPI == 600 px (US Visa / Passport standard)
    assert.equal(toPixels(2, 'in', 300), 600);
    // px passthrough
    assert.equal(toPixels(200.4, 'px', 200), 200);
  });

  it('converts pixels back to cm, mm, and inches cleanly', () => {
    assert.equal(fromPixels(600, 'in', 300), 2);
    assert.equal(fromPixels(200, 'px', 200), 200);
    assert.equal(fromPixels(276, 'cm', 200), 3.51);
    assert.equal(fromPixels(276, 'mm', 200), 35);
  });

  it('formats human-readable dimension display string', () => {
    const label = formatDimensionDisplay(200, 230, 200);
    assert.match(label, /200×230 px/);
    assert.match(label, /200DPI/);
  });
});

describe('EXAM_PRESETS catalog integrity', () => {
  it('contains 40 verified exams with unique IDs and valid specs', () => {
    assert.ok(EXAM_PRESETS.length >= 40, `Expected >= 40 presets, got ${EXAM_PRESETS.length}`);
    const ids = new Set<string>();

    for (const exam of EXAM_PRESETS) {
      assert.ok(exam.id && !ids.has(exam.id), `Duplicate or empty exam id: ${exam.id}`);
      ids.add(exam.id);

      const docs = Object.values(exam.documents).filter(Boolean);
      assert.ok(docs.length > 0, `Exam ${exam.id} has no documents`);

      for (const doc of docs) {
        if (!doc) continue;
        assert.ok(doc.minSizeKB >= 0, `${exam.id}/${doc.title} invalid minSizeKB`);
        assert.ok(doc.maxSizeKB >= doc.minSizeKB, `${exam.id}/${doc.title} maxSizeKB < minSizeKB`);
        assert.ok(doc.format.length > 0, `${exam.id}/${doc.title} missing format`);
        if (doc.width !== undefined) assert.ok(doc.width >= 10, `${exam.id} width too small`);
        if (doc.height !== undefined) assert.ok(doc.height >= 10, `${exam.id} height too small`);
      }
    }
  });

  it('matches official specs for flagship exams (SSC, UPSC, IBPS, NEET, RRB, CTET)', () => {
    const byId = new Map(EXAM_PRESETS.map((e) => [e.id, e]));

    const ssc = byId.get('ssc-cgl');
    assert.equal(ssc?.documents.photo?.width, 200);
    assert.equal(ssc?.documents.photo?.height, 230);
    assert.equal(ssc?.documents.photo?.minSizeKB, 20);
    assert.equal(ssc?.documents.photo?.maxSizeKB, 50);

    const upsc = byId.get('upsc-civil-services');
    assert.equal(upsc?.documents.photo?.width, 350);
    assert.equal(upsc?.documents.photo?.height, 350);
    assert.equal(upsc?.documents.photo?.maxSizeKB, 300);

    const neet = byId.get('nta-neet-jee');
    assert.equal(neet?.documents.photo?.width, 350);
    assert.equal(neet?.documents.photo?.height, 450);
    assert.equal(neet?.documents.photo?.maxSizeKB, 200);

    const rrb = byId.get('rrb-railway');
    assert.equal(rrb?.documents.photo?.minSizeKB, 30);
    assert.equal(rrb?.documents.photo?.maxSizeKB, 70);

    const ctet = byId.get('ctet');
    assert.equal(ctet?.documents.photo?.minSizeKB, 10);
    assert.equal(ctet?.documents.photo?.maxSizeKB, 100);
  });
});

describe('PASSPORT_SHEET_SPECS', () => {
  it('defines accurate 300 DPI dimensions and grid counts for 4x6 and A4 sheets', () => {
    assert.equal(PASSPORT_SHEET_SPECS['4x6'].cols * PASSPORT_SHEET_SPECS['4x6'].rows, 8);
    assert.equal(PASSPORT_SHEET_SPECS['4x6'].widthPx, 1800);
    assert.equal(PASSPORT_SHEET_SPECS['4x6'].heightPx, 1200);

    assert.equal(PASSPORT_SHEET_SPECS['a4-12'].cols * PASSPORT_SHEET_SPECS['a4-12'].rows, 12);
    assert.equal(PASSPORT_SHEET_SPECS['a4-30'].cols * PASSPORT_SHEET_SPECS['a4-30'].rows, 30);
    assert.equal(PASSPORT_SHEET_SPECS['a4-30'].widthPx, 2480);
    assert.equal(PASSPORT_SHEET_SPECS['a4-30'].heightPx, 3508);
  });
});

describe('applyWhiteBackground flood-fill', () => {
  it('whitens a blue outer studio backdrop while preserving the dark center subject', () => {
    const w = 20;
    const h = 20;
    const pixels = new Uint8ClampedArray(w * h * 4);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const isSubject = x >= 6 && x <= 13 && y >= 5 && y <= 18;
        if (isSubject) {
          // Dark skin/clothing center subject
          pixels[idx] = 60;
          pixels[idx + 1] = 45;
          pixels[idx + 2] = 40;
          pixels[idx + 3] = 255;
        } else {
          // Light blue studio backdrop
          pixels[idx] = 90;
          pixels[idx + 1] = 150;
          pixels[idx + 2] = 220;
          pixels[idx + 3] = 255;
        }
      }
    }

    let putCalled = false;
    const mockCanvas = {
      width: w,
      height: h,
      getContext: () => ({
        getImageData: () => ({ data: pixels, width: w, height: h }),
        putImageData: () => {
          putCalled = true;
        }
      })
    } as unknown as HTMLCanvasElement;

    applyWhiteBackground(mockCanvas, { enabled: true, tolerance: 42, fillColor: '#FFFFFF' });

    assert.equal(putCalled, true);
    // Corner pixel (0,0) should now be pure white
    assert.deepEqual([pixels[0], pixels[1], pixels[2]], [255, 255, 255]);
    // Center subject pixel (10,10) should remain untouched
    const centerIdx = (10 * w + 10) * 4;
    assert.deepEqual([pixels[centerIdx], pixels[centerIdx + 1], pixels[centerIdx + 2]], [60, 45, 40]);
  });
});
