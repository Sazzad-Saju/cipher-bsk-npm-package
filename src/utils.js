//Replace in String
function replaceAt(str, index, newChar) {
    function replacer(origChar, strIndex) {
        if (strIndex === index)
            return newChar;
        else
            return origChar;
    }
    return str.replace(/./g, replacer);
}

//swap in string
function swapStr(str, first, last) {
    return str.substr(0, first) +
        str[last] +
        str.substring(first + 1, last) +
        str[first] +
        str.substr(last + 1);
}

//random number generation
function mulberry32(a) {
    return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function xmur3(str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

//calculate padding characters
function pad_bytes(C) {
    var pad = 0;
    C = C.match(/.{1,2}/g);
    for (i = 0; i < C.length; i++) {
        var val = parseInt(C[i], 16);
        if (val < 32 || val > 125) {
            pad += 1;
        }
    }
    return pad;
}


module.exports = { replaceAt, swapStr, mulberry32, xmur3, pad_bytes };