const fs = require('fs');
const path = require('path');

const VAULT = '/home/wespc/root-project/vault';
const ROOT = '/home/wespc/root-project';

function chooseBiome(egg) {
    const traits = egg.traits || {};
    const multispark = egg.growth?.multispark ?? 0;
    if (traits.chaotic && multispark > 5)     return 'undead-forest';
    if (traits.reactive && traits.volatile)   return 'wack-hoes';
    if (traits.structured && !traits.chaotic) return 'sane-asylum';
    return 'mad-hattery';
}

module.exports = async function(egg) {
    if (egg.transcended) return; // already done

    const biome = chooseBiome(egg);
    const stamp = new Date().toISOString();

    console.log(`🌀 TRANSCENDENCE — ${egg.id} → ${biome}`);

    // stamp egg as transcended BEFORE moving
    egg.transcended = true;
    egg.biome = biome;
    egg.transcendedAt = stamp;
    fs.writeFileSync(egg._path, JSON.stringify(egg, null, 2));

    // write to PULSE.md
    const pulse = `\n## ${stamp} — TRANSCENDENCE\n**${egg.id}** → ${biome}\nGrowth: ${egg.growth?.value}\nTraits: ${JSON.stringify(egg.traits)}\n`;
    fs.appendFileSync(path.join(VAULT, 'PULSE.md'), pulse);

    // move to biome
    const dest = path.join(ROOT, biome, path.basename(egg._path));
    try {
        fs.renameSync(egg._path, dest);
        console.log(`🌳 ${egg.id} now lives in ${biome}`);
    } catch(e) {
        console.warn(`transcendence: failed to move`, e.message);
    }
}
