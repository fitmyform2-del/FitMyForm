import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'How to Resize Photo & Signature for Online Application Forms | Complete Guide & Tool',
  description: 'Learn step-by-step how to resize, crop, and compress passport photos and signatures to exact pixel dimensions (200x230, 140x60) and file limits (20-50 KB) for government forms.',
  keywords: ['how to resize photo for online form', 'resize image for exam form online', 'passport photo dimensions for indian exams']
};

export default function ResizePhotoGuidePage() {
  return <HomePage />;
}
