// Import block
const { Block } = require("./block");
// const { log16 } = require("./utility");
const { Transaction } = require("./transaction");
const EC = require("elliptic").ec, ec = new EC("secp256k1"); 

// for minting
const MINT_KEY_PAIR = ec.genKeyPair();
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");
const holderKeyPair = ec.genKeyPair();
// const crypto = require('crypto'), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");

class Blockchain {
    constructor() {
        const initialCoinRelease = new Transaction(MINT_PUBLIC_ADDRESS, holderKeyPair.getPublic("hex"), 100000);
        
        // for genesis block
        this.chain = [new Block(new Date(Date.now()).toLocaleString(), [initialCoinRelease])];
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
        let gas = 0;

        this.transactions.forEach(transaction => {
            gas += transaction.gas;
        })
        // create mint transaction for reward
        const rewardTransaction = new Transaction(MINT_PUBLIC_ADDRESS, rewardAddress, this.reward + gas);
        rewardTransaction.sign(MINT_KEY_PAIR);

        // prevent people from minting coins and mine the minting transaction
        if (this.transactions.length !== 0) this.addBlock(new Block(new Date(Date.now().toLocaleString(), [rewardTransaction, ...this.transaction])));

        this.transactions = [];
    }

    getBalance(address) {
        let balance = 0;

        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if (transaction.from === address) {
                    balance -= transaction.amount;
                    balance -= transaction.gas;
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