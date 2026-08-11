import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fitmyform.com';
  const routes = [
    '',
    '/photo-resizer',
    '/signature-resizer',
    '/image-compressor',
    '/image-to-jpg',
    '/image-to-png',
    '/pdf-compressor',
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
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8
  }));
}
