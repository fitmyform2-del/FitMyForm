import { MetadataRoute } from 'next';
import { EXAM_PRESETS } from '@/config/presets';

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fitmyform.com';
  const currentDate = new Date();

  const routes: RouteConfig[] = [
    // 1. Homepage
    { path: '', priority: 1.0, changeFrequency: 'daily' },

    // 2. Core Exam Document Resizers & Batch Kit
    { path: '/exam-kit', priority: 0.98, changeFrequency: 'daily' },
    { path: '/photo-resizer', priority: 0.95, changeFrequency: 'daily' },
    { path: '/signature-resizer', priority: 0.95, changeFrequency: 'daily' },
    { path: '/ssc-photo-resizer', priority: 0.95, changeFrequency: 'daily' },
    { path: '/image-compressor', priority: 0.95, changeFrequency: 'daily' },
    { path: '/resize-photo-for-online-form', priority: 0.9, changeFrequency: 'daily' },
    { path: '/uptet-photo-resizer', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/ctet-photo-resizer', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/presets', priority: 0.9, changeFrequency: 'weekly' },

    // 3. Image Editing & Creator Tools
    { path: '/crop-image', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/remove-background', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/upscale-image', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/photo-editor', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/meme-generator', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/blur-face', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/rotate-image', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/watermark-image', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/html-to-image', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/convert-to-jpg', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/jpg-to-image', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/image-to-jpg', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/image-to-png', priority: 0.85, changeFrequency: 'weekly' },

    // 4. Interactive Whiteboard
    { path: '/whiteboard', priority: 0.95, changeFrequency: 'daily' },

    // 5. Complete PDF Tools Suite
    { path: '/pdf-compressor', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/pdf-tools', priority: 0.9, changeFrequency: 'daily' },
    { path: '/pdf-tools/sign', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/pdf-tools/merge', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/pdf-tools/split', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/pdf-tools/compress', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/pdf-tools/jpg-to-pdf', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/pdf-to-jpg', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/edit', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/unlock', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/organize', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/rotate', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/scan', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/page-numbers', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/watermark', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/pdf-to-text', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/compare', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/redact', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pdf-tools/html-to-pdf', priority: 0.85, changeFrequency: 'weekly' },

    // 6. E-Signature Industry Standards & Compliance
    { path: '/legal-validity', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/esignature-features', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/esignature-compliance-standards', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/esignature-security', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/esignatures-for-financial-services', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/esignatures-for-human-resources', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/esignatures-for-insurance', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/esignatures-for-legal-services', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/esignatures-for-real-estate', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/esignatures-for-sales', priority: 0.75, changeFrequency: 'monthly' },

    // 7. Dedicated SEO Pages for All 40 Verified Exam Presets
    ...EXAM_PRESETS.map((exam): RouteConfig => ({
      path: `/exam/${exam.id}`,
      priority: 0.88,
      changeFrequency: 'weekly'
    }))
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: currentDate,
    changeFrequency: r.changeFrequency,
    priority: r.priority
  }));
}
