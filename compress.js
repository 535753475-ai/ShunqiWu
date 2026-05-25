const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const MIN_SIZE_KB = 200; // Only compress files > 200KB
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;

let totalBefore = 0, totalAfter = 0, count = 0;

async function compressFile(filePath) {
  const stat = fs.statSync(filePath);
  const sizeKB = stat.size / 1024;
  if (sizeKB < MIN_SIZE_KB) return;

  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  const before = stat.size;
  const backupPath = filePath + '.bak';

  try {
    // Read image metadata
    const metadata = await sharp(filePath).metadata();

    let pipeline = sharp(filePath);

    // Resize if wider than MAX_WIDTH
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH);
    }

    // Compress
    if (ext === '.png') {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
    } else {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    }

    // Write to temp then replace
    const tmpPath = filePath + '.tmp';
    await pipeline.toFile(tmpPath);

    const after = fs.statSync(tmpPath).size;

    // Only replace if actually smaller
    if (after < before) {
      fs.copyFileSync(filePath, backupPath); // backup
      fs.renameSync(tmpPath, filePath);
      const saved = ((before - after) / 1024).toFixed(1);
      const pct = ((1 - after / before) * 100).toFixed(0);
      console.log(`[${count + 1}] ${path.basename(filePath)}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (${pct}% saved, ${saved}KB)`);
      totalBefore += before;
      totalAfter += after;
      count++;
    } else {
      fs.unlinkSync(tmpPath);
      console.log(`[SKIP] ${path.basename(filePath)}: already optimal`);
    }
  } catch (err) {
    console.error(`[ERROR] ${path.basename(filePath)}: ${err.message}`);
    // Cleanup tmp if exists
    try { fs.unlinkSync(filePath + '.tmp'); } catch(e) {}
  }
}

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip backup dirs
      if (entry.name === 'bak' || entry.name === 'backup') continue;
      await walk(full);
    } else if (entry.isFile()) {
      await compressFile(full);
    }
  }
}

(async () => {
  console.log('Compressing images > 200KB, max width 1920px...\n');
  await walk(IMAGES_DIR);

  if (count > 0) {
    const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
    const pct = ((1 - totalAfter / totalBefore) * 100).toFixed(0);
    console.log(`\n=== DONE ===`);
    console.log(`${count} images compressed`);
    console.log(`Before: ${(totalBefore/1024/1024).toFixed(0)}MB → After: ${(totalAfter/1024/1024).toFixed(0)}MB`);
    console.log(`Saved: ${savedMB}MB (${pct}%)`);
    console.log(`\nBackups saved as *.bak files. Delete with: del /s *.bak`);
  } else {
    console.log('No images needed compression.');
  }
})();
