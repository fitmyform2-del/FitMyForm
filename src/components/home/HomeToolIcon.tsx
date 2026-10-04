import React from 'react';
import {
  Sparkles,
  Minimize2,
  Maximize2,
  Crop,
  FileImage,
  Repeat,
  Wand2,
  Eraser,
  Shield,
  Smile,
  RotateCw,
  Code,
  EyeOff,
  Camera,
  PenTool,
  FileCheck,
  GraduationCap,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export function getToolIcon(iconName: string) {
  switch (iconName) {
    case 'Minimize2': return <Minimize2 className="w-6 h-6 text-rose-400" />;
    case 'Maximize2': return <Maximize2 className="w-6 h-6 text-blue-400" />;
    case 'Crop': return <Crop className="w-6 h-6 text-amber-400" />;
    case 'FileImage': return <FileImage className="w-6 h-6 text-yellow-400" />;
    case 'Repeat': return <Repeat className="w-6 h-6 text-cyan-400" />;
    case 'Wand2': return <Wand2 className="w-6 h-6 text-pink-400" />;
    case 'Sparkles': return <Sparkles className="w-6 h-6 text-teal-300" />;
    case 'Eraser': return <Eraser className="w-6 h-6 text-emerald-400" />;
    case 'Shield': return <Shield className="w-6 h-6 text-indigo-400" />;
    case 'Smile': return <Smile className="w-6 h-6 text-amber-400" />;
    case 'RotateCw': return <RotateCw className="w-6 h-6 text-sky-400" />;
    case 'Code': return <Code className="w-6 h-6 text-purple-400" />;
    case 'EyeOff': return <EyeOff className="w-6 h-6 text-rose-400" />;
    case 'Camera': return <Camera className="w-6 h-6 text-emerald-400" />;
    case 'PenTool': return <PenTool className="w-6 h-6 text-purple-400" />;
    case 'FileCheck': return <FileCheck className="w-6 h-6 text-blue-400" />;
    case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-teal-400" />;
    case 'FileText': return <FileText className="w-6 h-6 text-rose-400" />;
    default: return <ImageIcon className="w-6 h-6 text-indigo-400" />;
  }
}
