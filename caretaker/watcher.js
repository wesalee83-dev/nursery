/**
 * watcher.js — Chokar, the timekeeper
 * Heartbeat (30s) + 11:11 ritual
 * Bob's JS world — caretaker layer
 * ~/root-project/nursery/caretaker/watcher.js
 */

import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OLLAMA       = process.env.OLLAMA_HOST      ?? 'http://localhost:11434';
const BOB_MODEL    = process.env.OLLAMA_BOB_MODEL ?? 'bob';
const W3Z_MODEL    = process.env.OLLAMA_W3Z_MODEL ?? 'w3z';
const PULSE_PATH   = process.env.PULSE_PATH       ?? '/home/wespc/vault/PULSE.md';
const BUILDS_PATH  = process.env.BUILDS_PATH      ?? '/home/wespc/vault/BUILDS.md';
const EGGS_PATH    = process.env.NURSERY_EGGS     ?? '/home/wespc/root-project/nursery/incubator/eggs';

const HEARTBEAT_MS = 30_000;

// ── Agent roster ─────────────────────────────────────────────────────────────

const AGENTS = {
  trillian:        { active: 'diurnal',   hours: [6, 22],  model: W3Z_MODEL },
  'stoned-willey': { active: 'nocturnal', hours: [22, 6],  model: BOB_MODEL },
  oscar:           { active: 'always',    hours: [0, 24],  model: BOB_MODEL },
};

export function currentHour() {
  return new Date().getHours();
}

export function activeAgents() {
  const h = currentHour();
  return Object.entries(AGENTS)
    .filter(([, cfg]) => {
      if (cfg.active === 'always') return true;
      const [start, end] = cfg.hours;
      return start < end
        ? h >= start && h < end
        : h >= start || h < end;
    })
    .map(([name]) => name);
}

export function nextRotation() {
  const h = currentHour();
  const pivots = [6, 22];
  const next = pivots.find(p => p > h) ?? (pivots[0] + 24);
  const hoursUntil = next > h ? next - h : next + 24 - h;
  return { nextPivot: next % 24, hoursUntil };
}

// ── Ollama REST calls ─────────────────────────────────────────────────────────

export async function pingOllama() {
  try {
    const res = await fetch(`${OLLAMA}/api/tags`);
    if (!res.ok) return { alive: false, models: [] };
    const data = await res.json();
    const models = data.models?.map(m => m.name) ?? [];
    return { alive: true, models };
  } catch {
    return { alive: false, models: [] };
  }
}

export async function callAgent(model, prompt) {
  try {
    const res = await fetch(`${OLLAMA}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });
    if (!res.ok) return { ok: false, response: null };
    const data = await res.json();
    return { ok: true, response: data.response };
  } catch (err) {
    return { ok: false, response: null, error: err.message };
  }
}

// ── Vault writers ─────────────────────────────────────────────────────────────

async function appendVault(filePath, entry) {
  try {
    await fs.appendFile(filePath, entry + '\n');
  } catch {
    // vault dir may not exist yet — soft fail, log to console
    console.warn(`[watcher] vault write failed: ${filePath}`);
  }
}

// ── Heartbeat ─────────────────────────────────────────────────────────────────

async function heartbeat() {
  const now   = new Date().toISOString();
  const alive = activeAgents();
  const rot   = nextRotation();

  console.log(`[${now}] 💓 heartbeat — active: ${alive.join(', ')} — next rotation in ${rot.hoursUntil}h`);

  // ping ollama
  const { alive: ollamaUp, models } = await pingOllama();
  if (!ollamaUp) {
    console.warn('[watcher] ⚠ ollama unreachable');
    return;
  }

  console.log(`[watcher] ollama ✓ — models: ${models.join(', ') || 'none loaded'}`);

  // bob writes heartbeat to BUILDS.md
  await appendVault(
    BUILDS_PATH,
    `\n## ${now}\n- heartbeat ok\n- agents: ${alive.join(', ')}\n- ollama: ${ollamaUp ? 'up' : 'down'}`
  );
}

// ── 11:11 ritual ──────────────────────────────────────────────────────────────

async function ritual1111() {
  const now = new Date();
  console.log(`[${now.toISOString()}] ✨ 11:11 ritual firing`);

  // w3z names the new egg
  const { ok, response } = await callAgent(
    W3Z_MODEL,
    'A new egg has appeared in the nursery. Give it a poetic one-word name and a one-sentence birth observation. Respond in JSON: {"name":"...","observation":"..."}'
  );

  const eggId   = `egg-${Date.now()}`;
  const eggName = ok ? parseEggName(response) : eggId;

  const egg = {
    id:          eggId,
    name:        eggName,
    born:        now.toISOString(),
    stage:       0,
    traits:      {},
    morphStage:  0,
    observation: ok ? response : 'born in silence',
  };

  // write egg to incubator
  try {
    await fs.mkdir(EGGS_PATH, { recursive: true });
    await fs.writeFile(
      path.join(EGGS_PATH, `${eggId}.json`),
      JSON.stringify(egg, null, 2)
    );
    console.log(`[watcher] 🥚 egg born: ${eggName}`);
  } catch (err) {
    console.warn('[watcher] egg write failed:', err.message);
  }

  // w3z whispers to PULSE.md
  await appendVault(
    PULSE_PATH,
    `\n## ${now.toISOString()} — birth\n**${eggName}** entered the nursery.\n${ok ? response : '_born in silence_'}`
  );
}

function parseEggName(response) {
  try {
    const json = JSON.parse(response);
    return json.name ?? `egg-${Date.now()}`;
  } catch {
    return `egg-${Date.now()}`;
  }
}

// ── Scheduler ─────────────────────────────────────────────────────────────────

function msUntil1111() {
  const now  = new Date();
  const next = new Date(now);
  next.setHours(11, 11, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next - now;
}

function schedule1111() {
  const ms = msUntil1111();
  const h  = Math.floor(ms / 3_600_000);
  const m  = Math.floor((ms % 3_600_000) / 60_000);
  console.log(`[watcher] 11:11 ritual scheduled in ${h}h ${m}m`);
  setTimeout(async () => {
    await ritual1111();
    // reschedule for next day
    schedule1111();
  }, ms);
}

// ── Boot ──────────────────────────────────────────────────────────────────────

async function boot() {
  console.log('[watcher] 🌱 booting — mycelial timekeeper online');
  console.log(`[watcher] ollama → ${OLLAMA}`);
  console.log(`[watcher] agents → ${Object.keys(AGENTS).join(', ')}`);

  // immediate first heartbeat
  await heartbeat();

  // rolling heartbeat
  setInterval(heartbeat, HEARTBEAT_MS);

  // daily 11:11 ritual
  schedule1111();
}


if (process.argv[1] === fileURLToPath(import.meta.url)) {
  boot();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  boot();
}
