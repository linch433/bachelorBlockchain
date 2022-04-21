// Import block
const { log16 } = require("./utility");
const crypto = require('crypto'), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");

class Block {
    constructor(timestamp = "", data = []) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.getHash();
        this.prevHash = "";
        this.nonce = 0;
    }

    getHash() {
        return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce);
    }

    mine(difficulty) {

        // loops until hash start with the string 0...000 with length of {difficulty}
        // Bitcoin require 8 zeros by default, but this require a lot of time to generate new block (cause u need to randomize new eight zeros)
        while (!this.hash.startsWith("0001" + Array(Math.round(log16(difficulty)) + 1).join("0"))) {
            this.nonce ++;
            this.hash = this.getHash();
        }
    }

    hasValidTransaction(chain) {
        return this.data.every(transaction => transaction.isValid(transaction, chain));
    }
}

// Export block
module.exports = {Block};