const {Block} = require("./block");
const {log16} = require("./utility");
const crypto = require('crypto'), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");

class Blockchain {
    constructor() {
        // for genesis block
        this.chain = [new Block(new Date(Date.now()).toLocaleString())];
        this.transactions = [];
        this.difficulty = 1;
        this.blockTime = 300000;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }


    addBlock(block) {
        block.prevHash = this.getLastBlock().hash;
        block.hash = block.getHash();
        block.mine(this.difficulty);
        this.chain.push(Object.freeze(block));

        this.difficulty += Date.now() - parseInt(this.getLastBlock().timestamp) < this.blockTime ? 1 : -1;
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    mineTransaction() {
        this.addBlock(new Block(new Date(Date.now().toLocaleString(), this.transactions)));

        this.transactions = [];
    }

    isValid(blockchain = this) {

        for(let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i];
            const prevBlock = blockchain.chain[i-1];

            // Check validation, without any unpredictable errors
            if (currentBlock.hash !== currentBlock.getHash() || prevBlock.hash !== currentBlock.prevHash) {
                return false;
            }
        }
        
        return true;
    }
}

module.exports = {Blockchain};