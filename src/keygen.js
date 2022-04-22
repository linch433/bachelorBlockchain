const EC = require("elliptic").ec, ec = new EC("secp256k1");

// eslint-disable-next-line no-unused-vars
const keyPair = ec.genKeyPair();