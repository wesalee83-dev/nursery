// caretaker/sidecar.js
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const EGGS_DIR = path.join(__dirname, '../eggs');
const HOOKS_DIR = path.join(__dirname, 'hooks');

function startSidecar() {
    console.log('🚐 sidecar online — watching', EGGS_DIR);
    const watcher = chokidar.watch(EGGS_DIR, {
        ignoreInitial: true,
        depth: 1
    });
    watcher.on('change', onEggChange);
    watcher.on('add',    onEggBorn);
    watcher.on('error',  (err) => console.error('sidecar error:', err));
}

function loadEgg(filePath) {
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const egg = JSON.parse(raw);
        egg._path = filePath;
        return egg;
    } catch (err) {
        console.warn('sidecar: failed to load egg:', filePath);
        return null;
    }
}

async function runHook(name, egg) {
    const hookPath = path.join(HOOKS_DIR, `${name}.js`);
    try {
        delete require.cache[require.resolve(hookPath)];
        const hook = require(hookPath);
        await hook(egg);
    } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') {
            console.warn(`sidecar: hook [${name}] error:`, e.message);
        }
    }
}

const MORPH_HOOKS = {
    1: 'rupture',
    2: 'sequencing',
    3: 'morphComplete',
    4: 'awakening',
    5: 'symbiosis',
    6: 'transcendence',
};

async function onEggChange(filePath) {
    const egg = loadEgg(filePath);
    if (!egg) return;

    // skip already transcended eggs
    if (egg.transcended) return;

    console.log(`🥚 egg changed — ${path.basename(filePath)}`);

    if (egg.pulser)           await runHook('pulse', egg);
    if (egg.growth)           await runHook('growth', egg);
    if (egg.traits?.chaotic)  await runHook('chaos', egg);

    const stage = egg.morph_n_time;
    if (stage && MORPH_HOOKS[stage]) {
        await runHook(MORPH_HOOKS[stage], egg);
    }
}

async function onEggBorn(filePath) {
    const egg = loadEgg(filePath);
    if (!egg) return;
    console.log(`🐣 new egg — ${path.basename(filePath)}`);
    await runHook('born', egg);
}

startSidecar();
