/**
 * Cipher: Bornomala Symmetric Key (BSK) stream cipher, a text encrypting tool
 * Developed By: Sazzad-Saju
 * Documentation: https://sazzad-saju.github.io/BSK-Online/
 */

let rand, max;

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

//KeyGeneration
function keyGeneration(Mlength, K) {
    let subkey1;
    let Klength = K.length;

    //Text to Int
    var grd = 1;
    let countK = 0;
    for (var i = 0; i < Klength; i++) {
        countK = countK + K[i].charCodeAt() * grd;
        grd *= 2;
    }
    countK += Mlength;

    //Key Enhancement
    if (Mlength > Klength) {
        var rep = parseInt(Mlength / Klength);
        var add = Mlength - (rep * Klength);
        subkey1 = K.repeat(rep);

        var i = 0;
        while (add > 0) {
            subkey1 = subkey1 + K[i];
            add--;
            i++;
        }
    } else {
        Mlength = Klength;
        subkey1 = K;
    }

    //Key Substitution
    for (var i = 0; i < Mlength; i++) {
        var numb = subkey1[i].charCodeAt();
        countK = (numb + countK) % 95;
        numb = numb + countK;
        if (numb > 126) {
            numb = numb - 95;
        }
        var repChar = String.fromCharCode(numb);
        subkey1 = replaceAt(subkey1, i, repChar);
    }
    countK += Mlength;

    //random-indexing
    var seed = xmur3(subkey1);
    rand = mulberry32(seed());
    for (var i = 0; i < Mlength; i++) {
        countK = subkey1[i].charCodeAt();
        while (countK > 10) {
            countK = countK % 10;
        }
        max = Math.pow(10, countK);
        var pos = parseInt(rand() * max) % Mlength;
        subkey1 = subkey1.split('');
        var temp = subkey1[i];
        subkey1[i] = subkey1[pos];
        subkey1[pos] = temp;
        subkey1 = subkey1.join("").toString();
    }

    //length enhancement
    var i = 0;
    let subkey2 = subkey1;
    while (subkey2.length % 8 != 0) {
        subkey2 += subkey1[i];
        i++;
    }

    //generate subkey2
    var rndNum = parseInt(rand() * max)
    for (var i = 0; i < subkey2.length; i++) {
        var numb = subkey2[i].charCodeAt();
        rndNum = (numb + rndNum) % 95;
        numb = numb + rndNum;
        if (numb > 126) {
            numb = numb - 95;
        }
        var repChar = String.fromCharCode(numb);
        subkey2 = replaceAt(subkey2, i, repChar);
    }

    return {
        subkey1,
        subkey2
    };
}

//encryption
function encrypt(M, K) {
    //generate keypair
    let keyGen = keyGeneration(M.length, K)
        //subkey1 operation
    M = M.split('');
    for (var i = 0; i < M.length; i++) {
        var mv = M[i].charCodeAt();
        if (mv == 10) {
            mv = 126;
        }
        var sk1v = keyGen.subkey1[i].charCodeAt();
        var pos = (mv + sk1v) % 94;
        if (pos < 32) {
            pos = pos + 94;
        }
        M[i] = String.fromCharCode(pos);
    }
    M = M.join("").toString();

    //padding
    //length formating
    while (M.length % 8 != 0) {
        M += '~';
    }

    //key-triggered indexing: subkey2
    M = M.split('');
    for (var i = M.length - 1; i >= 0; i--) {
        var t = keyGen.subkey2[i].charCodeAt();
        var j = t % M.length;
        [M[i], M[j]] = [M[j], M[i]];
    }

    //hexadecimal convertion and dopping
    for (var i = 0; i < M.length; i++) {
        M[i] = M[i].charCodeAt().toString(16);
        if (M[i] == '7e') {
            if (i % 2 == 0) {
                var numb = parseInt(rand() * max) % 32;
                M[i] = numb.toString(16);
                if (M[i].length != 2) {
                    M[i] = "0" + M[i];
                }
            } else {
                var numb = parseInt(rand() * max) % 256;
                if (numb < 126) {
                    numb += 130;
                }
                M[i] = numb.toString(16);
            }
        }
    }
    M = M.join("").toString().toUpperCase();

    return M;
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

//decryption
function decrypt(C, K) {
    let Mlength = C.length / 2;
    var pad = 0;
    //pad characters elimination
    C = C.match(/.{1,2}/g);
    for (i = 0; i < C.length; i++) {
        var val = parseInt(C[i], 16);
        if (val < 32 || val > 125) {
            C[i] = '7E';
            pad += 1;
        }
    }

    //Original Messege length and Key generation
    Mlength = Mlength - pad;
    let keyGen = keyGeneration(Mlength, K);

    //ASCII Conversion
    for (i = 0; i < C.length; i++) {
        C[i] = String.fromCharCode(parseInt(C[i], 16));
    }

    //Key-triggered rev. indexing- subkey2
    for (var i = 0; i < C.length; i++) {
        var t = keyGen.subkey2[i].charCodeAt();
        var j = t % C.length;
        [C[i], C[j]] = [C[j], C[i]];
    }

    //shrink length
    while (pad--) {
        C.pop();
    }

    //subkey1 operation
    for (var i = 0; i < C.length; i++) {
        var mv = C[i].charCodeAt();
        var sk1v = keyGen.subkey1[i].charCodeAt();
        var pos = mv - sk1v;
        while (pos < 32) {
            pos = pos + 94;
        }
        C[i] = String.fromCharCode(pos);
    }

    C = C.join("").toString();

    return C;
}

module.exports = { encrypt, decrypt }