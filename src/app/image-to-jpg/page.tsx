import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'Convert PNG / WEBP / HEIC to JPG for Online Exams | FitMyForm',
  description: 'Convert PNG, WEBP, or smartphone photos to official JPG/JPEG format for online exam applications. Fast, client-side, and privacy-protected.',
  keywords: ['png to jpg converter for online form', 'image to jpg converter', 'convert photo to jpeg format', 'exam form jpg converter']
};

export default function ImageToJpgPage() {
  return <HomePage />;
}
