// hooks/growth.js
const fs = require('fs');

module.exports = function(egg) {
    console.log(`🌱 [growth] ${egg.id} | stage: ${egg.stage} | value: ${egg.growth?.value?.toFixed(2)}`);
    
    // only do something special on stage change
    if (egg.stage !== 'seed') {
        console.log(`🌟 ${egg.id} has reached stage: ${egg.stage}!`);
    }
};
