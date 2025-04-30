const fs = require('fs');
const path = require('path');

const directoriesToCreate = ['uploads', 'outputs'];

directoriesToCreate.forEach(dirName => {
  const dirPath = path.join(__dirname, '..', dirName); // Go up one level from 'scripts' to the root

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
});

console.log('Finished creating necessary directories.');