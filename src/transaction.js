const EC = require("elliptic").ec, ec = new EC("secp256k1");
const crypto = require('crypto'), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");

const MINT_KEY_PAIR = ec.genKeyPair();
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");


class Transaction {
    constructor(from, to, amount, gas = 0) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.gas = gas;
    }

    sign(keyPair) {
        if (keyPair.getPublic("hex") === this.from) {
            this.signature = keyPair.sign(SHA256(this.from + this.to + this.amount + this.gas), "base64").toDER("hex");
        }
    }

    isValid(tx, chain) {
        return (
            tx.from && 
            tx.to && 
            tx.amount && 
            (chain.getBalance(tx.from) >= tx.amount + tx.gas || tx.from === MINT_PUBLIC_ADDRESS) && 
            ec.keyFromPublic(tx.from, "hex").verify(SHA256(tx.from + tx.to + tx.amount + tx.gas), tx.signature)
        );
    }
}

module.exports = {Transaction};