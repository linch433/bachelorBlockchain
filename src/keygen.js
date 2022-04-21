const EC = require("elliptic").ec, ec = new EC("secp256k1");

const keyPair = ec.genKeyPair();