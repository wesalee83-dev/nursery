module.exports = function pulser() {
    return {
        ts: Date.now(),
        pulse: Math.random().toString(36).slice(2, 8),
        rhythm: 1
    };
};
