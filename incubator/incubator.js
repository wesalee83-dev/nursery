// ~/root-project/nursery/incubator/incubator.js
const path = require('path');
const { loadEgg, saveEgg } = require('../storage');   // ← Note the ../

const EGGS_DIR = path.resolve(__dirname, "../eggs");

// Simple create
function createEgg(options = {}) {
    const code = options.code ? String(options.code).padStart(4, '0') : null;

    const id = code || 'egg-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    const egg = {
        id,
        code: code,
        element: code ? `Sigil-${code}` : "wild",
        growth: { value: 0 },
        created: Date.now(),
        gifts: []
    };

    saveEgg(egg);
    console.log(`🌱 Egg created → ${id} ${code ? `[${code}]` : '[wild]'}`);
    return egg;
}

// Add growth (with 1M milestone)
function addGrowth(id, amount = 1) {
    let egg = loadEgg(id);
    if (!egg) {
        console.log(`❌ Egg ${id} not found`);
        return null;
    }

    egg.growth.value += amount;

    if (egg.growth.value >= 1_000_000) {
        console.log(`✨ BOOM! ${id} reached 1,000,000 growth!`);
        egg.growth.value = 0;
        // TODO: Add elemental gift / sigil here later
    }

    saveEgg(egg);
    console.log(`Growth updated: ${egg.growth.value}`);
    return egg;
}

module.exports = { createEgg, addGrowth };

if (require.main === module) {
    const code = process.argv[2];
    if (code) {
        createEgg({ code });
    } else {
        createEgg();
    }
}
