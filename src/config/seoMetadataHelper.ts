import type { Metadata } from 'next';

interface ToolMetadataOptions {
  title: string;
  description: string;
  route: string;
  keywords: string[];
}

export function createToolMetadata(opts: ToolMetadataOptions): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: {
      canonical: opts.route
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: `https://fitmyform.com${opts.route}`,
      siteName: 'FitMyForm',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description
    }
  };
}
