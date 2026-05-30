// nursery/caretaker/watcher.js
const caretaker = require('./caretaker');
const incubator = require('../incubator/incubator'); // adjust path as needed

console.log("watcher online");

function tickAllEggs() {
    const evt = {
        type: 'heartbeat',
        ts: Date.now()
    };
    caretaker.handleEvent(evt);
}

setInterval(tickAllEggs, 30000);

// --- 11:11 daily egg creation ---
function msUntilNext1111() {
    const now = new Date();
    const next = new Date();
    next.setHours(11, 11, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1); // already past today's 11:11
    return next - now;
}

setTimeout(function schedule() {
    incubator.createEgg();
    setTimeout(schedule, 24 * 60 * 60 * 1000); // repeat every 24h
}, msUntilNext1111());
