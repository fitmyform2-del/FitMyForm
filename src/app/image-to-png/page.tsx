import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'Convert JPG to Transparent / Lossless PNG Format | FitMyForm',
  description: 'Convert JPG or WEBP images to crisp PNG format for digital signatures and official certificates.',
  keywords: ['convert image to png', 'jpg to png converter', 'transparent signature png']
};

export default function ImageToPngPage() {
  return <HomePage />;
}
