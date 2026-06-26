/**
 * watcher.js — Chokar, the timekeeper
 * Heartbeat (30s) + 11:11 ritual
 * Bob's JS world — caretaker layer
 * ~/root-project/nursery/caretaker/watcher.js
 *
 * UPDATED: switched backend from LM Studio (phi-3.1-mini) to real
 * Ollama running llama3.1, since .ollama was wiped and rebuilt.
 * Also fixed EGGS_PATH to match tally.js (was nursery/incubator/eggs,
 * tally.js reads nursery/eggs — egg census was silently undercounting).
 */

import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fullTally } from './tally.js';

// Ollama's native API, port 11434. (LM Studio used 1234 — no longer in play.)
const OLLAMA      = process.env.OLLAMA_HOST      ?? 'http://localhost:11434';
const BOB_MODEL   = process.env.OLLAMA_BOB_MODEL ?? 'llama3.1';
const W3Z_MODEL   = process.env.OLLAMA_W3Z_MODEL ?? 'llama3.1';
const PULSE_PATH  = process.env.PULSE_PATH       ?? '/home/wespc/vault/PULSE.md';
const BUILDS_PATH = process.env.BUILDS_PATH      ?? '/home/wespc/vault/BUILDS.md';
// FIXED: was '.../nursery/incubator/eggs' — tally.js counts '.../nursery/eggs'.
const EGGS_PATH   = process.env.NURSERY_EGGS     ?? '/home/wespc/root-project/nursery/eggs';

const HEARTBEAT_MS = 30_000;

// ── Agent roster ─────────────────────────────────────────────────────────────

const AGENTS = {
  trillian:        { active: 'diurnal',   hours: [6, 22], model: W3Z_MODEL },
  'stoned-willey': { active: 'nocturnal', hours: [22, 6], model: BOB_MODEL },
  oscar:           { active: 'always',    hours: [0, 24], model: BOB_MODEL },
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
    const res = await fetch(`${OLLAMA}/v1/models`);
    if (!res.ok) return { alive: false, models: [] };
    const data = await res.json();
    const models = data.data?.map(m => m.id) ?? [];
    return { alive: true, models };
  } catch {
    return { alive: false, models: [] };
  }
}

export async function callAgent(model, prompt) {
  try {
    const res = await fetch(`${OLLAMA}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });
    if (!res.ok) return { ok: false, response: null };
    const data = await res.json();
    const response = data.choices?.[0]?.message?.content ?? null;
    return { ok: !!response, response };
  } catch (err) {
    return { ok: false, response: null, error: err.message };
  }
}

// ── Vault writers ─────────────────────────────────────────────────────────────

async function appendVault(filePath, entry) {
  try {
    await fs.appendFile(filePath, entry + '\n');
  } catch {
    console.warn(`[watcher] vault write failed: ${filePath}`);
  }
}

// ── Heartbeat ─────────────────────────────────────────────────────────────────

async function heartbeat() {
  const now  = new Date().toISOString();
  const alive = activeAgents();
  const rot   = nextRotation();

  console.log(`[${now}] 💓 heartbeat — active: ${alive.join(', ')} — next rotation in ${rot.hoursUntil}h`);

  fullTally(); // 🌍 census on every heartbeat

  const { alive: ollamaUp, models } = await pingOllama();
  if (!ollamaUp) {
    console.warn(`[watcher] ⚠ ${BOB_MODEL} not found in ollama — run: ollama pull ${BOB_MODEL}`);
    return;
  }

  console.log(`[watcher] ollama ✓ — models: ${models.join(', ') || 'none loaded'}`);
  if (!models.some(m => m === BOB_MODEL || m.startsWith(`${BOB_MODEL}:`))) {
    console.warn(`[watcher] ⚠ ${BOB_MODEL} not found in ollama — run: ollama pull ${BOB_MODEL}`);
  }

  await appendVault(
    BUILDS_PATH,
    `\n## ${now}\n- heartbeat ok\n- agents: ${alive.join(', ')}\n- ollama: ${ollamaUp ? 'up' : 'down'}`
  );
}

// ── 11:11 ritual ──────────────────────────────────────────────────────────────

async function ritual1111() {
  const now = new Date();
  console.log(`[${now.toISOString()}] ✨ 11:11 ritual firing`);

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

  try {
    await fs.mkdir(EGGS_PATH, { recursive: true });
    await fs.writeFile(
      path.join(EGGS_PATH, `${eggId}.json`),
      JSON.stringify(egg, null, 2)
    );
    console.log(`[watcher] 🥚 egg born: ${eggName} → ${EGGS_PATH}`);
  } catch (err) {
    console.warn('[watcher] egg write failed:', err.message);
  }

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
    schedule1111();
  }, ms);
}

// ── Boot ──────────────────────────────────────────────────────────────────────

async function boot() {
  console.log('[watcher] 🌱 booting — mycelial timekeeper online');
  console.log(`[watcher] ollama → ${OLLAMA}`);
  console.log(`[watcher] model  → ${BOB_MODEL}`);
  console.log(`[watcher] agents → ${Object.keys(AGENTS).join(', ')}`);

  await heartbeat();

  // confirm llama3.1 actually responds, not just that ollama is alive
  const { ok, response } = await callAgent(BOB_MODEL, 'Reply with one word: awake.');
  console.log(ok
    ? `[watcher] 🧠 ${BOB_MODEL} invoked ✓ — said: "${response}"`
    : `[watcher] 🧠 ${BOB_MODEL} invoke failed`
  );

  setInterval(heartbeat, HEARTBEAT_MS);
  schedule1111();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  boot();
}
