import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';

const appDirectory = resolve(process.argv[2] ?? '');
const entry = resolve(appDirectory, 'index.html');
const visited = new Set();
const errors = [];

if (!existsSync(entry)) {
  console.error(`Entrée absente: ${entry}`);
  process.exit(1);
}

const isRemote = (value) => /^(?:[a-z]+:|\/\/|#)/i.test(value);

function inspect(file) {
  if (visited.has(file) || !existsSync(file) || !statSync(file).isFile()) return;
  visited.add(file);

  const extension = extname(file).toLowerCase();
  if (!['.html', '.css'].includes(extension)) return;

  const contents = readFileSync(file, 'utf8');
  const references = [];
  const htmlPattern = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  const cssPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  const pattern = extension === '.html' ? htmlPattern : cssPattern;

  for (const match of contents.matchAll(pattern)) references.push(match[1]);

  for (const rawReference of references) {
    if (isRemote(rawReference)) continue;
    const cleanReference = rawReference.split('#')[0].split('?')[0];
    if (!cleanReference) continue;

    let decodedReference;
    try {
      decodedReference = decodeURIComponent(cleanReference);
    } catch {
      errors.push(`${file}: URL locale invalide « ${rawReference} »`);
      continue;
    }

    const target = resolve(dirname(file), decodedReference);
    if (!target.startsWith(`${appDirectory}/`) && target !== appDirectory) {
      errors.push(`${file}: référence hors de l'application « ${rawReference} »`);
      continue;
    }
    if (!existsSync(target)) {
      errors.push(`${file}: fichier absent « ${rawReference} »`);
      continue;
    }
    inspect(target);
  }
}

inspect(entry);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`OK: ${appDirectory} (${visited.size} fichiers locaux vérifiés)`);
