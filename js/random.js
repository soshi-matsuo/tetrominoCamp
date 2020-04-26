function rand(min, max) {
    return lerp(Math.random(), min, max);
}

function lerp(ratio, start, end) {
    return start + (end - start) * ratio;
}

function randInt(min, max) {
    // can't be `max + 0.5` otherwise it will round up if `rand`
    // returns `max` causing it to overflow range.
    return Math.round(rand(min - 0.5, max + 0.499999999999));
}