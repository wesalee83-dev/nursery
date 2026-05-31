// nursery/caretaker/watcher.js
const caretaker = require('./caretaker');
const incubator = require('../incubator/incubator');
const { fullTally } = require('./tally');

console.log("🌱 watcher online");

// ─── Heartbeat (every 30s) ───────────────────────────────────
function tickAllEggs() {
    try {
        const evt = { type: 'heartbeat', ts: Date.now() };
        caretaker.handleEvent(evt);
    } catch(e) {
        console.warn('tick error:', e.message);
    }
}
setInterval(tickAllEggs, 30000);

// ─── Tally (every 30 min) ────────────────────────────────────
fullTally();
setInterval(fullTally, 30 * 60 * 1000);

// ─── 11:11 daily egg creation ────────────────────────────────
function msUntilNext1111() {
    const now = new Date();
    const next = new Date();
    next.setHours(11, 11, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next - now;
}

setTimeout(function schedule() {
    incubator.createEgg();
    setTimeout(schedule, 24 * 60 * 60 * 1000);
}, msUntilNext1111());
