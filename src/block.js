// Import block
const { Transaction } = require("./transaction");
// const { log16 } = require("./utility");
const crypto = require('crypto'), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");
const EC = require("elliptic").ec, ec = new EC("secp256k1"); 
const MINT_PRIVATE_ADDRESS = "0700a1ad28a20e5b2a517c00242d3e25a88d84bf54dce9e1733e6096e6d6495e";
const MINT_KEY_PAIR = ec.keyFromPrivate(MINT_PRIVATE_ADDRESS, "hex");
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

class Block {
    constructor(timestamp = new Date(Date.now).toLocaleString(), data = []) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = Block.getHash(this);
        this.prevHash = "";
        this.nonce = 0;
    }

    static getHash(block) {
        return SHA256(block.prevHash + block.timestamp + JSON.stringify(block.data) + block.nonce);
    }

    mine(difficulty) {

        // loops until hash start with the string 0...000 with length of {difficulty}
        // Bitcoin require 8 zeros by default, but this require a lot of time to generate new block (cause u need to randomize new eight zeros)
        // but if u put 8 zeros before hash for PoW consensus it will take a long time to generate this combination -> around 10 minutes
        
        // ERROR: while (!this.hash.startsWith("0f0" + Array(Math.floor(log16(difficulty)) + 1).join("0"))) {
        // ERROR: Invalid array length if I have more than 4 new generated blocks

            while(!this.hash.startsWith("0f01" + Array(difficulty + 1).join("0"))) {
            this.nonce ++;
            this.hash = Block.getHash(this);
        }
    }

    static hasValidTransaction(block, chain) {
        let gas = 0, reward = 0;

        block.data.forEach(transaction => {
            if (transaction.from !== MINT_PUBLIC_ADDRESS) {
                gas += transaction.gas;
            } else {
                reward = transaction.amount;
            }
        });


        return (
            reward - gas === chain.reward &&
            block.data.every(transaction => Transaction.isValid(transaction, chain)) &&
            block.data.filter(transaction => transaction.from === MINT_PUBLIC_ADDRESS).length === 1
        );
    }
}

// Export block
module.exports = {Block};