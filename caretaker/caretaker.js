#   root-project/nusery/caretaker/caretaker.js

const { loadAllEggs, saveEgg } = require('./io/eggStore');
const { evolveEgg } = require('./engine/evolution');

function handleEvent(evt) {
    const entries = loadAllEggs();

    for (const entry of entries) {
        const updated = evolveEgg(entry.egg, evt, entries);
        saveEgg(entry.file, updated);
    }

    return { status: "ok", eggsProcessed: entries.length };
}
