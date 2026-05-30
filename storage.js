// nursery/storage.js
const fs = require('fs');
const path = require('path');

const EGGS_DIR = path.join(__dirname, 'eggs');

function ensureDir() {
  if (!fs.existsSync(EGGS_DIR)) {
    fs.mkdirSync(EGGS_DIR, { recursive: true });
  }
}

function eggPath(id) {
  return path.join(EGGS_DIR, `${id}.json`);
}

function loadEgg(id) {
  ensureDir();
  const file = eggPath(id);

  if (!fs.existsSync(file)) {
    return null; // egg doesn't exist yet
  }

  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveEgg(egg) {
  ensureDir();
  const file = eggPath(egg.id);
  fs.writeFileSync(file, JSON.stringify(egg, null, 2));
}

module.exports = { loadEgg, saveEgg };
