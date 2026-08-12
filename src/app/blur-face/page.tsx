import type { Metadata } from 'next';
import BlurFaceClient from './BlurFaceClient';

export const metadata: Metadata = {
  title: 'Blur Face in Photo Online Free - Censor Sensitive Image Data',
  description: 'Blur faces and private information in photos online. Draw blur boxes or pixelate sensitive text, license plates, and documents securely with client-side privacy.',
  keywords: [
    'blur face photo online',
    'censor image free',
    'pixelate photo region',
    'blur sensitive info photo',
    'hide face image'
  ],
  alternates: {
    canonical: '/blur-face'
  },
  openGraph: {
    title: 'Blur Face in Photo Online Free - FitMyForm',
    description: 'Censor sensitive information, blur faces, and pixelate license plates directly inside your web browser memory.',
    url: 'https://fitmyform.com/blur-face',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function BlurFacePage() {
  return <BlurFaceClient />;
}
