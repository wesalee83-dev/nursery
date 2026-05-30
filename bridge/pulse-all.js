#!/usr/bin/env node
/**
 * Pulse All Active Eggs
 * Evolves every egg in the eggs/ directory
 */

const fs = require('fs');
const path = require('path');
const { pulseEgg } = require('./asteroid-bridge.js');

const EGGS_DIR = path.join(__dirname, '../eggs');

async function pulseAll() {
  console.log("🚀 Starting mass pulse of all eggs...\n");

  if (!fs.existsSync(EGGS_DIR)) {
    console.error("❌ No eggs directory found");
    return;
  }

  const files = fs.readdirSync(EGGS_DIR).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const eggId = file.replace('.json', '');
    console.log(`\n--- Pulsing ${eggId} ---`);
    await pulseEgg(eggId);
    // Small delay to not overwhelm
    await new Promise(r => setTimeout(r, 300));
  }

  console.log("\n✅ Mass pulse completed!");
}

if (require.main === module) {
  pulseAll();
}
