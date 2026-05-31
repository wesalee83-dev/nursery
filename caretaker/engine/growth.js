// engine/growth.js — applies growth math to eggs

module.exports = { applyGrowth }

function applyGrowth(egg, pulser) {
    if (!egg.growth) egg.growth = {}
    if (egg.growth.value == null) egg.growth.value = 1000
    if (egg.growth.rate == null) egg.growth.rate = 0.003
    if (egg.growth.multispark == null) egg.growth.multispark = 0
    if (!egg.traits) egg.traits = {}

    // base growth
    let base = egg.growth.rate

    // pulser boost
    let pulserBoost = pulser?.multiplier ?? 1

    // trait modifiers
    let traitBoost = 1
    if (egg.traits.reactive) traitBoost += 0.1
    if (egg.traits.chaotic)  traitBoost += 0.25
    if (egg.traits.lightness) traitBoost += egg.traits.lightness * 0.2

    // species modifiers
    let speciesBoost = 1
    if (egg.species === 'tree') speciesBoost += 0.15
    if (egg.species === 'rock') speciesBoost -= 0.05

    // element modifiers from code
    const code = egg.code || ''
    const fire  = parseInt(code[0]) || 0
    const water = parseInt(code[1]) || 0
    const air   = parseInt(code[2]) || 0
    const earth = parseInt(code[3]) || 0

    let elementBoost = 1
    elementBoost += fire  * 0.15   // fire burns fast
    elementBoost += water * 0.08   // water steady
    elementBoost += air   * 0.12   // air quick
    elementBoost += earth * 0.05   // earth slow but sure

    // apply growth
    let increment = base * pulserBoost * traitBoost * speciesBoost * elementBoost
    egg.growth.value = parseFloat(
        Math.min(egg.growth.value + increment, 1e8).toFixed(7)
    )

    // multispark
    if (Math.random() < 0.01 * traitBoost) {
        egg.growth.multispark += 1
        egg.traits.chaotic = true
        egg.growth._chaoticTicks = (egg.growth._chaoticTicks ?? 0) + 1
    }

    // decay chaotic after 10 ticks
    if (egg.traits.chaotic && egg.growth._chaoticTicks > 10) {
        egg.traits.chaotic = false
        egg.growth._chaoticTicks = 0
    }

    // fix bad multiplier — never below 1
    if (egg.growth.multiplier != null && egg.growth.multiplier < 1) {
        egg.growth.multiplier = 1
    }

    return egg
}
