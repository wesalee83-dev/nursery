// caretaker/io/eggStore.js

const fs = require('fs');
const path = require('path');

const EGGS_DIR = path.join(__dirname, '../../eggs');

function loadAllEggs() {
    if (!fs.existsSync(EGGS_DIR)) {
        fs.mkdirSync(EGGS_DIR, { recursive: true });
        return [];
    }

    return fs.readdirSync(EGGS_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => {
            const filePath = path.join(EGGS_DIR, f);
            try {
                const egg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                return { file: filePath, egg };
            } catch (e) {
                console.warn(`eggStore: failed to load ${f}`, e.message);
                return null;
            }
        })
        .filter(Boolean);
}

function saveEgg(filePath, egg) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(egg, null, 2));
    } catch (e) {
        console.warn(`eggStore: failed to save ${filePath}`, e.message);
    }
}

module.exports = { loadAllEggs, saveEgg };
