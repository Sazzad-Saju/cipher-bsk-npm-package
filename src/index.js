const { encrypt, decrypt } = require('./cipher');

const state = {
    rand: null,
    max: null
};

module.exports = {
    encrypt: (M, K) => encrypt(M, K, state),
    decrypt: (C, K) => decrypt(C, K, state)
};