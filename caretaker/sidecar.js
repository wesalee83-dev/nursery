// sidecar/observer.js
const ollama = require('ollama')

async function onEggChange(filePath) {
    const egg = loadEgg(filePath);
    if (!egg) return;

    if (egg.pulser) await runHook('pulse', egg);
    if (egg.growth) await runHook('growth', egg);
    // ...
}
        // write to nursery notes, not generic notes
        writeToNursery(egg.id, response.message.content)
