#!/usr/bin/env node
(async () => {
  'use strict';
  const fs = require('fs').promises;
  const path = require('path');
  let sharp;
  try {
    sharp = require('sharp');
  } catch (err) {
    console.error('Missing dependency: please run `npm install --save-dev sharp` first.');
    process.exit(2);
  }

  const SRC = path.resolve(process.cwd(), 'src', 'resources');
  const DEST = path.resolve(process.cwd(), 'src', 'assets');
  const QUALITY = 80;

  async function ensureDir(dir) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      // ignore
    }
  }

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        files.push(...(await walk(full)));
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') {
          files.push(full);
        }
      }
    }
    return files;
  }

  async function convert() {
    try {
      const srcStat = await fs.stat(SRC).catch(() => null);
      if (!srcStat || !srcStat.isDirectory()) {
        console.error('Source directory `resources/` not found. Nothing to convert.');
        process.exit(1);
      }

      await ensureDir(DEST);
      const images = await walk(SRC);
      if (!images.length) {
        console.log('No JPG/PNG images found in resources/.');
        return;
      }

      console.log(`Found ${images.length} image(s). Converting to WebP → ${path.relative(process.cwd(), DEST)}`);

      for (const srcPath of images) {
        const rel = path.relative(SRC, srcPath);
        const ext = path.extname(srcPath).toLowerCase();
        const outPath = path.join(DEST, rel).replace(/\.[^.]+$/, '.webp');
        const outDir = path.dirname(outPath);
        await ensureDir(outDir);
        try {
          if (ext === '.webp') {
            // already webp — copy to destination
            await fs.copyFile(srcPath, outPath);
            console.log('Copied:', rel, '→', path.relative(process.cwd(), outPath));
          } else {
            await sharp(srcPath).webp({ quality: QUALITY }).toFile(outPath);
            console.log('Converted:', rel, '→', path.relative(process.cwd(), outPath));
          }
        } catch (err) {
          console.error('Failed:', rel, err.message || err);
        }
      }

      console.log('Conversion complete.');
    } catch (err) {
      console.error('Unexpected error:', err);
      process.exit(3);
    }
  }

  convert();
})();
