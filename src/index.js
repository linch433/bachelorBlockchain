// Import block
const { Block } = require("./block");
const { Blockchain } = require("./blockchain");
const { Transaction } = require("./transaction");
const EC = require("elliptic").ec, ec = new EC("secp256k1"); 
const holderKeyPair = ec.genKeyPair();

/*const testCoin = new Blockchain();
testCoin.addBlock(new Block(new Date(Date.now()).toLocaleString(), {from: "John", to: "Bob", amount: 100}));

// for testing
console.log(testCoin.chain);
*/

const testCoin = new Blockchain();

const userTwoWallet = ec.genKeyPair();

const transaction = new Transaction(holderKeyPair.getPublic("hex"), userTwoWallet.getPublic("hex"), 100, 10);
transaction.sign(holderKeyPair);

testCoin.addTransaction(transaction);
testCoin.mineTransaction(holderKeyPair.getPublic("hex"));

console.log("Your balance:", testCoin.getBalance(holderKeyPair.getPublic("hex")));
console.log("Balance of the second wallet:", testCoin.getBalance(userTwoWallet.getPublic("hex")));


