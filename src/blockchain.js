// Import block
const { Block } = require("./block");
// const { log16 } = require("./utility");
const { Transaction } = require("./transaction");
const EC = require("elliptic").ec, ec = new EC("secp256k1"); 

// for minting
const MINT_PRIVATE_ADDRESS = "0700a1ad28a20e5b2a517c00242d3e25a88d84bf54dce9e1733e6096e6d6495e";
const MINT_KEY_PAIR = ec.keyFromPrivate(MINT_PRIVATE_ADDRESS, "hex");
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");
const holderKeyPair = ec.genKeyPair();
// const crypto = require('crypto'), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");

class Blockchain {
    constructor() {
        const initialCoinRelease = new Transaction(MINT_PUBLIC_ADDRESS, holderKeyPair.getPublic("hex"), 100000);
        
        // for genesis block
        this.transactions = [];
        this.chain = [new Block(new Date(Date.now()).toLocaleString(), [initialCoinRelease])];
        this.difficulty = 1;
        this.blockTime = 30000;
        this.reward = 300;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.prevHash = this.getLastBlock().hash;
        block.hash = Block.getHash(block);
        block.mine(this.difficulty);
        this.chain.push(Object.freeze(block));

        this.difficulty += Date.now() - parseInt(this.getLastBlock().timestamp) < this.blockTime ? 1 : -1;
    }

    addTransaction(transaction) {
        if (Transaction.isValid(transaction, this)) {
            this.transactions.push(transaction);
        }
    }

    mineTransaction(rewardAddress) {
        let gas = 0;

        this.transactions.forEach(transaction => {
            gas += transaction.gas;
        });

        // create mint transaction for reward
        const rewardTransaction = new Transaction(MINT_PUBLIC_ADDRESS, rewardAddress, this.reward + gas);
        rewardTransaction.sign(MINT_KEY_PAIR);

        const blockTransaction = [rewardTransaction, ...this.transactions];

        // prevent people from minting coins and mine the minting transaction
        if (this.transactions.length !== 0) this.addBlock(new Block(new Date(Date.now().toLocaleString(), blockTransaction)));

        this.transactions.splice(0, blockTransaction.length - 1);
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

    static isValid(blockchain = this) {

        for(let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i];
            const prevBlock = blockchain.chain[i-1];

            // Check validation, without any unpredictable errors
            if (
                currentBlock.hash !== currentBlock.getHash(currentBlock) || 
                prevBlock.hash !== currentBlock.prevHash || 
                !Block.hasValidTransaction(currentBlock, blockchain)
                ) {
                return false;
            }
        }
        
        return true;
    }
}


// Exports block
module.exports = {Blockchain};