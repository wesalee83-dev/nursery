// caretaker/engine/evolution.js
// Bridge — calls asteroid's Python brain

const { spawn } = require('child_process');
const path = require('path');

const EVOLUTION_PY = path.join('/home/wespc/asteroid/core/evolution.py');

function evolveEgg(egg, evt, allEggs) {
    return new Promise((resolve) => {
        const py = spawn('python3', [
            EVOLUTION_PY,
            JSON.stringify(egg)
        ]);

        let output = '';
        py.stdout.on('data', (data) => output += data);
        py.stderr.on('data', (d) => console.warn('evolution.py:', d.toString()));
        py.on('close', () => {
            try {
                resolve(JSON.parse(output));
            } catch (e) {
                console.warn('evolution bridge: bad output', output);
                resolve(egg); // return unchanged egg on failure
            }
        });
    });
}

module.exports = { evolveEgg };
