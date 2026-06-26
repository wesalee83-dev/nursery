// tally.js — full organism census
import fs from 'fs';
import path from 'path';

const ROOT = '/home/wespc/root-project';
const VAULT = path.join(ROOT, 'vault');

const LOCATIONS = {
    '🌱 nursery':       path.join(ROOT, 'nursery/eggs'),
    '👻 undead-forest': path.join(ROOT, 'undead-forest'),
    '🏚️  mad-hattery':  path.join(ROOT, 'mad-hattery'),
    '🧘 sane-asylum':   path.join(ROOT, 'sane-asylum'),
    '🌀 wack-hoes':     path.join(ROOT, 'wack-hoes'),
};

function countEggs(dir) {
    try {
        return fs.readdirSync(dir)
            .filter(f => f.endsWith('.json') && !f.includes('registry'))
            .length;
    } catch(e) { return 0; }
}

export function fullTally() {
    const stamp = new Date().toISOString();
    const time = new Date().toLocaleTimeString();

    console.log(`\n🌍 ORGANISM CENSUS — ${time}`);

    let total = 0;
    const counts = {};

    for (const [label, dir] of Object.entries(LOCATIONS)) {
        const count = countEggs(dir);
        counts[label] = count;
        total += count;
        if (count > 0) console.log(`  ${label}: ${count}`);
    }
    console.log(`  📦 total: ${total}\n`);

    try {
        const line = [
            `\n## ${stamp}`,
            Object.entries(counts)
                .filter(([,v]) => v > 0)
                .map(([k,v]) => `${k}: ${v}`)
                .join(' | '),
            `📦 total: ${total}`
        ].join('\n') + '\n';

        fs.appendFileSync(path.join(VAULT, 'CENSUS.md'), line);
    } catch(e) {
        console.warn('tally: could not write to vault:', e.message);
    }
}
