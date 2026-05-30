// sidecar/hooks/growth.js
const { Ollama } = require('ollama')
const fs = require('fs')
const path = require('path')

const ollama = new Ollama()

module.exports = async function(egg) {
    const interesting = 
        egg.growth?.multispark > 3 || 
        egg.traits?.chaotic ||
        egg.growth?.value > 100

    if (!interesting) return  // sidecar stays quiet on boring ticks

    const res = await ollama.chat({
        model: 'mistral',
        messages: [{
            role: 'user',
            content: `You are observing an evolving egg in the Mycelial system.
            
Egg: ${egg.id ?? 'unnamed'}
Species: ${egg.species ?? 'unknown'}
Traits: ${JSON.stringify(egg.traits ?? {})}
Growth value: ${egg.growth?.value}
Multispark count: ${egg.growth?.multispark}

Observe what's emerging. One or two sentences. Poetic but specific.`
        }]
    })

    const note = res.message.content
    const stamp = new Date().toISOString()
    const line = `\n## ${stamp} — ${egg.id}\n${note}\n`

    // writes to nursery, not generic notes
    const pulsePath = path.join(__dirname, '../../..', 'PULSE.md')
    fs.appendFileSync(pulsePath, line)
    
    console.log(`🌱 sidecar whispered: ${note}`)
}
