import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');

async function convertImage(filename, width) {
    const inputPath = path.join(publicDir, filename);
    const outputPath = path.join(publicDir, 'logo.webp');

    if (fs.existsSync(inputPath)) {
        await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toFile(outputPath);
        console.log(`Converted ${filename} to logo.webp`);
    } else {
        console.log(`${filename} not found`);
    }
}

async function run() {
    await convertImage('logo.png', 512);
}

run();
