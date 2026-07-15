// hooks/born.js
const fs = require('fs');
const path = require('path');
const { LMStudioClient } = require('@lmstudio/sdk');

const VAULT = '/home/wespc/root-project/vault';
const W3Z_MODEL = process.env.W3Z_MODEL || 'qwen/qwen3-4b-2507'; // swap to phi-3's exact LM Studio model key via `lms ls`

const lmClient = new LMStudioClient();
let w3zModel = null;
async function getW3zModel() {
    if (!w3zModel) {
        w3zModel = await lmClient.llm.load(W3Z_MODEL, { ttl: 300 });
    }
    return w3zModel;
}

function fallbackName() {
    const roots = ['spore', 'glim', 'rask', 'ninu', 'vex', 'orn'];
    const suffix = Math.floor(Math.random() * 999);
    return `${roots[Math.floor(Math.random() * roots.length)]}-${suffix}`;
}

async function w3zNames(egg) {
    const prompt = `You are w3z, a chaotic-creative evolution agent. A new egg has just been born.
Traits: ${JSON.stringify(egg.traits || {})}
Give this egg a short, strange, one-or-two-word name (lowercase, no punctuation), and write ONE short sentence as a birth observation in your own irreverent voice. Respond ONLY as JSON: {"name": "...", "note": "..."}`;

    try {
        const model = await getW3zModel();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('w3z timed out')), 15000)
        );
        const result = await Promise.race([
            model.respond([{ role: 'user', content: prompt }]),
            timeoutPromise
        ]);
        const raw = result.content ?? result; // confirm exact lmstudio-js response shape
        const parsed = JSON.parse(raw);
        if (!parsed.name || !parsed.note) throw new Error('malformed w3z response');
        return { name: parsed.name.toLowerCase().trim(), note: parsed.note.trim() };
    } catch (err) {
        const name = fallbackName();
        return { name, note: `something cracked the surface. calling it ${name} for now — w3z was quiet (${err.message}).` };
    }
}

// Matches transcendence.js's convention: mutate egg, persist to egg._path, then log to PULSE.
module.exports = async function(egg) {
    if (egg.named) return; // already done

    const { name, note } = await w3zNames(egg);
    const stamp = new Date().toISOString();

    console.log(`🥚 [born] ${egg.id} named ${name}`);

    egg.named = true;
    egg.name = name;
    egg.bornAt = egg.bornAt || stamp;
    fs.writeFileSync(egg._path, JSON.stringify(egg, null, 2));

    const pulse = `\n## ${stamp} — BIRTH\n**${egg.id}** named **${name}**\n${note}\n`;
    fs.appendFileSync(path.join(VAULT, 'PULSE.md'), pulse);
};
