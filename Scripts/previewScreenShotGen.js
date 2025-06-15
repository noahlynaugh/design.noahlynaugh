import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Config
const OUTPUT_DIR = './public/link-previews';
const DATA_FILE = './public/link-previews/previews.json';
const WIDTH = 1280;
const HEIGHT = 720;  // aspect ratio 16:9

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// List of URLs to process
const urls = [
  { name: 'kekDesign', url: 'https://www.kekdesign.com/' },
  { name: 'instagram', url: 'https://www.instagram.com/noahlynaugh.design' },
  { name: 'layerMetrics', url: 'https://www.layermetricsinc.com/' },
  { name: 'github', url: 'https://github.com/noahlynaugh' },
];

// We'll collect the data here
const previewData = {};

(async () => {
  const browser = await puppeteer.launch();

  for (const { name, url } of urls) {
    const webpPath = path.join(OUTPUT_DIR, `${name}.webp`);
    const relativePath = `/link-previews/${name}.webp`;
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT });

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      if (name==='instagram') {
        try{
        // Wait until the main content is visible
        await page.waitForSelector('article', { timeout: 120000 });
      } catch (err) {
        console.warn(`⚠️ SSR content may not have fully loaded: ${err.message}`);
      }
    }

      const tempPath = path.join(OUTPUT_DIR, `${name}.png`);
      await page.screenshot({ path: tempPath });

      await sharp(tempPath)
        .webp({ quality: 80 })
        .toFile(webpPath);

      fs.unlinkSync(tempPath);
      console.log(`✅ Saved screenshot: ${webpPath}`);

      // Add entry to JSON mapping
      previewData[name] = {
        url,
        image: relativePath
      };

    } catch (err) {
      console.error(`❌ Failed to capture ${url}:`, err.message);
    }
    await page.close();
  }

  await browser.close();

  // Write JSON file
  fs.writeFileSync(DATA_FILE, JSON.stringify(previewData, null, 2));
  console.log(`✅ JSON mapping saved: ${DATA_FILE}`);
})();
