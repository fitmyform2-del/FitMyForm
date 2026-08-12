import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fitmyform.com';
  const routes = [
    '',
    '/pdf-tools/sign',
    '/esignature-features',
    '/esignature-compliance-standards',
    '/esignature-security',
    '/legal-validity',
    '/esignatures-for-insurance',
    '/esignatures-for-real-estate',
    '/esignatures-for-financial-services',
    '/esignatures-for-legal-services',
    '/esignatures-for-human-resources',
    '/esignatures-for-sales',
    '/photo-resizer',
    '/signature-resizer',
    '/image-compressor',
    '/crop-image',
    '/rotate-image',
    '/watermark-image',
    '/meme-generator',
    '/upscale-image',
    '/remove-background',
    '/blur-face',
    '/html-to-image',
    '/photo-editor',
    '/convert-to-jpg',
    '/jpg-to-image',
    '/image-to-jpg',
    '/image-to-png',
    '/pdf-compressor',
    '/pdf-tools',
    '/ssc-photo-resizer',
    '/uptet-photo-resizer',
    '/ctet-photo-resizer',
    '/resize-photo-for-online-form',
    '/presets',
    '/dashboard'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8
  }));
}
