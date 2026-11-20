import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

const loaderCode = `
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const rootDir = process.cwd();

function resolveCandidate(basePath) {
  const candidates = [
    basePath,
    basePath + '.ts',
    basePath + '.tsx',
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      return pathToFileURL(c).href;
    }
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const abs = path.join(rootDir, 'src', specifier.slice(2));
    const found = resolveCandidate(abs);
    if (found) return { url: found, shortCircuit: true };
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL));
    const abs = path.resolve(parentDir, specifier);
    const found = resolveCandidate(abs);
    if (found) return { url: found, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
`;

register('data:text/javascript,' + encodeURIComponent(loaderCode), pathToFileURL('./'));
