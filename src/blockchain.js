// Import block
const { Block } = require("./block");
const { log16 } = require("./utility");
const { Transaction } = require("./transaction");
const { ec } = require("elliptic");

// for minting
const MINT_KEY_PAIR = ec.genKeyPair()
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

const crypto = require('crypto'), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");

class Blockchain {
    constructor() {
        // for genesis block
        this.chain = [new Block(new Date(Date.now()).toLocaleString())];
        this.transactions = [];
        this.difficulty = 1;
        this.blockTime = 300000;
        this.reward = 300;
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

    isValid(blockchain = this) {

        for(let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i];
            const prevBlock = blockchain.chain[i-1];

            // Check validation, without any unpredictable errors
            if (
                currentBlock.hash !== currentBlock.getHash() || 
                prevBlock.hash !== currentBlock.prevHash || 
                !currentBlock.hasValidTransaction(blockchain)
                ) {
                return false;
            }
        }
        
        return true;
    }

    addTransaction(transaction) {
        if (transaction.isValid(transaction, this)) {
            this.transactions.push(transaction);
        }
    }

    mineTransaction(rewardAddress) {

        const rewardTransaction = new Transaction(MINT_PUBLIC_ADDRESS, rewardAddress, this.reward);
        rewardTransaction.sign(MIN_KEY_PAIR);
        this.addBlock(new Block(new Date(Date.now().toLocaleString(), [rewardTransaction, ...this.transactions])));

        this.transactions = [];
    }

    getBalance(address) {
        let balance = 0;

        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if (transaction.from === address) {
                    balance -= transaction.amount;
                }

                if (transaction.to === address) {
                    balance += transaction.amount;
                }
            })
        });

        return balance;
    }
}


// Exports block
module.exports = {Blockchain};