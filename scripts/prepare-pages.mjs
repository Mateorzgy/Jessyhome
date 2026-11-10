import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';

// Preserve configuration edited directly in docs/config.js on GitHub.
let config;
try { config = await readFile(new URL('../docs/config.js', import.meta.url), 'utf8'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(new URL('../docs/', import.meta.url), { recursive: true });
await cp(new URL('../dist/', import.meta.url), new URL('../docs/', import.meta.url), { recursive: true });
if (config !== undefined) await writeFile(new URL('../docs/config.js', import.meta.url), config);
console.log('Listo: publicá main /docs en GitHub Pages. Configuración existente conservada.');
