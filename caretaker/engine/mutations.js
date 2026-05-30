// mutations.js
// Full mutation + morph engine for your organism

const state = require('../state');

// ------------------------------------------------------------
// MAIN ENTRY POINT
// ------------------------------------------------------------

function applyMutations(egg) {
    const s = state.load();

    // 1. Growth-based mutations
    checkGrowthThresholds(egg, s);

    // 2. Pulse-based mutations
    checkPulseMutations(egg, s);

    // 3. Morph stages
    checkMorphStages(egg, s);

    state.save(s);
    return egg;
}

// ------------------------------------------------------------
// GROWTH THRESHOLDS
// ------------------------------------------------------------

function checkGrowthThresholds(egg, s) {
    const g = egg.growth.value;

    if (g >= 10000) chaoticMutation(egg, s);
    else if (g >= 5000) majorMorph(egg, s);
    else if (g >= 1000) speciesMutation(egg, s);
    else if (g >= 500) traitMutation(egg, s);
    else if (g >= 100) minorMutation(egg, s);
}

// ------------------------------------------------------------
// PULSE-DRIVEN MUTATIONS
// ------------------------------------------------------------

function checkPulseMutations(egg, s) {
    if (!egg.pulse || !egg.pulse.type) return;

    switch (egg.pulse.type) {
        case "undead":
            undeadMutation(egg, s);
            break;

        case "chaos":
            chaoticMutation(egg, s);
            break;

        case "nurture":
            nurtureMutation(egg, s);
            break;

        case "fast":
            speedMutation(egg, s);
            break;

        case "slow":
            stabilityMutation(egg, s);
            break;
    }
}

// ------------------------------------------------------------
// MORPH STAGES
// ------------------------------------------------------------

function checkMorphStages(egg, s) {
    const g = egg.growth.value;

    if (!egg.morphStage) egg.morphStage = 0;

    if (g >= 5000 && egg.morphStage < 4) {
        egg.morphStage = 4;
        s.lastMorph = "ascended";
    } else if (g >= 2000 && egg.morphStage < 3) {
        egg.morphStage = 3;
        s.lastMorph = "stable";
    } else if (g >= 1000 && egg.morphStage < 2) {
        egg.morphStage = 2;
        s.lastMorph = "awakening";
    } else if (g >= 300 && egg.morphStage < 1) {
        egg.morphStage = 1;
        s.lastMorph = "forming";
    }
}

// ------------------------------------------------------------
// MUTATION TYPES
// ------------------------------------------------------------

function minorMutation(egg, s) {
    egg.traits.minor = true;
    recordMutation(s, "minor");
}

function traitMutation(egg, s) {
    egg.traits.hardy = true;
    egg.growth.rate *= 1.1;
    recordMutation(s, "trait");
}

function speciesMutation(egg, s) {
    egg.species = "sapling";
    egg.traits.evolved = true;
    egg.growth.rate *= 1.2;
    recordMutation(s, "species");
}

function majorMorph(egg, s) {
    egg.species = "tree";
    egg.traits.mature = true;
    egg.growth.rate *= 1.3;
    recordMutation(s, "morph");
}

function chaoticMutation(egg, s) {
    egg.traits.chaotic = true;
    egg.growth.rate *= (1 + Math.random());
    recordMutation(s, "chaos");
}

function undeadMutation(egg, s) {
    egg.species = "undead_tree";
    egg.traits.undead = true;
    egg.growth.rate *= 1.5;
    recordMutation(s, "undead");
}

function nurtureMutation(egg, s) {
    egg.traits.nurtured = true;
    egg.growth.rate *= 1.15;
    recordMutation(s, "nurture");
}

function speedMutation(egg, s) {
    egg.traits.fast = true;
    egg.growth.rate *= 1.25;
    recordMutation(s, "fast");
}

function stabilityMutation(egg, s) {
    egg.traits.stable = true;
    egg.growth.rate *= 0.9;
    recordMutation(s, "slow");
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function recordMutation(s, type) {
    s.mutationCount++;
    s.lastEvent = `mutation:${type}`;
    s.lastMutation = type;
}

// ------------------------------------------------------------
module.exports = {
    applyMutations
};
