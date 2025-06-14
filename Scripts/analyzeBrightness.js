import sharp  from 'sharp';
import fs  from 'fs';
import path  from 'path';
import ffmpeg  from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from 'ffprobe-static';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path)

// Config
const IMAGES_DIR = './public/WEBP';
const VIDEOS_DIR = './public/MP4';
const OUTPUT_FILE = './public/brightness-metadata.json';
const BRIGHTNESS_THRESHOLD = 0.8;

// Helpers
function getFiles(dir, extensions) {
  return fs.readdirSync(dir).filter(file =>
    extensions.test(file)
  );
}

async function computeImageBrightness(filePath) {
  const image = sharp(filePath);
  const { data, info } = await image.resize(10, 10).raw().toBuffer({ resolveWithObject: true });

  let total = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    total += (r + g + b) / 3 / 255;
  }
  return total / (data.length / info.channels);
}

async function extractVideoFrame(videoPath, framePath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => resolve())
      .on('error', reject)
      .screenshots({
        count: 1,
        timemarks: ['10%'],
        filename: path.basename(framePath),
        folder: path.dirname(framePath),
        size: '320x?'
      });
  });
}

async function computeVideoBrightness(videoPath) {
  const tempFramePath = './temp_frame.jpg';
  await extractVideoFrame(videoPath, tempFramePath);
  const brightness = await computeImageBrightness(tempFramePath);
  fs.unlinkSync(tempFramePath);
  return brightness;
}

async function processAll() {
  const result = {};

  // Images
  const imageFiles = getFiles(IMAGES_DIR, /\.(jpe?g|png|webp|gif)$/i);
  for (const file of imageFiles) {
    const fullPath = path.join(IMAGES_DIR, file);
    const brightness = await computeImageBrightness(fullPath);
    result[file] = {
      type: 'image',
      brightness: brightness.toFixed(3),
      lightMode: brightness >= BRIGHTNESS_THRESHOLD
    };
  }

  // Videos
  const videoFiles = getFiles(VIDEOS_DIR, /\.(mp4|mov|webm)$/i);
  for (const file of videoFiles) {
    const fullPath = path.join(VIDEOS_DIR, file);
    const brightness = await computeVideoBrightness(fullPath);
    result[file] = {
      type: 'video',
      brightness: brightness.toFixed(3),
      lightMode: brightness >= BRIGHTNESS_THRESHOLD
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log('✅ Build-time brightness analysis complete.');
}

processAll();
