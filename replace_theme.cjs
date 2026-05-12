const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace dark theme with maroon theme
    content = content.replace(/bg-dark-900/g, 'bg-maroon-950');
    content = content.replace(/bg-dark-800/g, 'bg-maroon-900');
    content = content.replace(/text-dark-900/g, 'text-maroon-950');
    content = content.replace(/text-dark-800/g, 'text-maroon-900');
    content = content.replace(/border-dark-900/g, 'border-maroon-950');
    content = content.replace(/border-dark-800/g, 'border-maroon-900');
    content = content.replace(/from-dark-900/g, 'from-maroon-950');
    content = content.replace(/via-dark-900/g, 'via-maroon-950');
    content = content.replace(/to-dark-900/g, 'to-maroon-950');
    content = content.replace(/from-dark-800/g, 'from-maroon-900');
    content = content.replace(/via-dark-800/g, 'via-maroon-900');
    content = content.replace(/to-dark-800/g, 'to-maroon-900');
    
    if (original !== content) {
      fs.writeFileSync(filePath, content);
      console.log('Updated', filePath);
      count++;
    }
  }
});

console.log(`Updated ${count} files.`);
