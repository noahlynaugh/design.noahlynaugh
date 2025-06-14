import { defineConfig } from "vite";
import { resolve } from 'path';
import fs from 'fs';

// helper function to recursively find HTML files
function findHtmlFiles(dir) {
  let htmlFiles = {};
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = resolve(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subFiles = findHtmlFiles(fullPath);
      htmlFiles = { ...htmlFiles, ...subFiles };
    } else if (file.endsWith('.html')) {
      const name = file === 'index.html'
        ? 'index'
        : file.replace('.html', '');
      htmlFiles[name] = fullPath;
    }
  }
  return htmlFiles;
}

// automatically find all html files
const input = {
  index: resolve(__dirname, './index.html'),
  ...findHtmlFiles(resolve(__dirname, './Pages'))
};

export default defineConfig({
    root: './',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input
        }
    },
})