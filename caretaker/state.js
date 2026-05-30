const path = require('path');
const fs = require('fs');

const state = {
  eggsDir: path.join(__dirname, '..', 'eggs'),
  metadataFile: path.join(__dirname, 'metadata', 'state.json'),

  load() {
    try {
      const raw = fs.readFileSync(this.metadataFile, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      return {
        pulser: 0,
        growth: 0,
        morph: null,
        lastEvent: null,
        lastPulser: null,
        lastGrowthTick: null,
        mutationCount: 0
      };
    }
  },

  save(data) {
    fs.writeFileSync(this.metadataFile, JSON.stringify(data, null, 2));
  }
};

module.exports = state;
