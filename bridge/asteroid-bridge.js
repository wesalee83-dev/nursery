#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const { loadEgg, saveEgg } = require('../storage.js');

// More flexible path detection
const possiblePaths = [
  path.resolve(__dirname, '../../dev/asteroid/python/core/evolution.py'),     // direct ~/dev/asteroid
  path.resolve(__dirname, '../../root-project/dev/asteroid/python/core/evolution.py'),
  path.resolve(process.env.HOME || '~', 'dev/asteroid/python/core/evolution.py')
];

let EVOLUTION_SCRIPT = null;

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    EVOLUTION_SCRIPT = p;
    break;
  }
}

async function pulseEgg(eggId) {
  const egg = loadEgg(eggId);
  if (!egg) {
    console.error(`❌ Egg ${eggId} not found`);
    return null;
  }

  console.log(`🌉 Pulsing ${eggId}...`);

  if (!EVOLUTION_SCRIPT) {
    console.warn(`⚠️ Python evolution script not found yet. Using local fallback.`);
    if (!egg.growth) egg.growth = { value: 0, rate: 1 };
    egg.growth.value = Math.floor(egg.growth.value * 1.065) + 35;
    egg.lastAsteroidPulse = Date.now();
    saveEgg(egg);
    console.log(`✅ Local pulse → ${egg.growth.value}`);
    return egg;
  }

  console.log(`✅ Using Python engine: ${EVOLUTION_SCRIPT}`);
  // Real Python integration will go here
  return egg;
}

if (require.main === module) {
  const eggId = process.argv[2];
  if (eggId) {
    pulseEgg(eggId);
  } else {
    console.log("Usage: node bridge/asteroid-bridge.js <egg-id>");
  }
}

module.exports = { pulseEgg };
