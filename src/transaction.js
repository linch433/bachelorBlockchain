const { ec } = require("elliptic");

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    sign(keyPair) {
        if (keyPair.getPublic("hex") === this.from) {
            this.signature = keyPair.sign(SHA256(this.from + this.to + this.amount), "base64").toDER("hex");
        }
    }

    isValid(tx, chain) {
        return (
            tx.from && 
            tx.to && 
            tx.amount && 
            (chain.getBalance(tx.from) >= tx.amount || tx.from === MINT_PUBLIC_ADDRESS) && 
            ec.keyFromPublic(tx.from, "hex").verify(SHA256(tx.from + tx.to + tx.amount + tx.gas), tx.signature)
        );
    }
}