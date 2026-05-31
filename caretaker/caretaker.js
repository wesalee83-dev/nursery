// caretaker/caretaker.js — conductor

const { loadAllEggs, saveEgg } = require('./io/eggStore');
const { evolveEgg } = require('./engine/evolution');

async function handleEvent(evt) {
    const entries = loadAllEggs();
    
    for (const entry of entries) {
        const updated = await evolveEgg(entry.egg, evt, entries);
        saveEgg(entry.file, updated);
    }

    return { status: "ok", eggsProcessed: entries.length };
}

module.exports = { handleEvent };
